"""
Universal Schema Detector - Identifies business domain and analyzes data gaps.

Part of Phase 1: Intelligent Schema Detection.
detects: Sales, HR, Finance, Inventory, etc.
provides: Gap Analysis Report
"""

import re
from typing import Dict, List, Optional, Any
import pandas as pd
import logging

logger = logging.getLogger(__name__)

class UniversalSchemaDetector:
    """
    detects the business domain of a dataset and performs gap analysis
    to guide the user on missing fields.
    """

    # Domain Definitions
    DOMAINS = {
        'Sales Forecasting': {
            'required_patterns': ['date|time', 'qty|quantity|units|volume', 'sales|revenue|amount'],
            'optional_patterns': ['product|sku|item', 'store|location|region', 'price|cost', 'promo|discount'],
            'kpis': ['Total Revenue', 'Units Sold', 'Growth Rate'],
            'description': 'Historical sales data for demand forecasting.'
        },
        'HR Analytics': {
            'required_patterns': ['hire_date|join_date', 'emp|employee|staff', 'status|active|term'],
            'optional_patterns': ['term_date|exit_date', 'dept|department', 'salary|comp', 'performance|rating'],
            'kpis': ['Headcount', 'Turnover Rate', 'Avg Tenure'],
            'description': 'Employee data for retention and workforce planning.'
        },
        'Financial Metrics': {
            'required_patterns': ['date|period', 'amount|value|balance', 'account|category|gl'],
            'optional_patterns': ['dept|cost_center', 'budget|forecast', 'variance'],
            'kpis': ['Total Expenses', 'Budget Variance', 'Run Rate'],
            'description': 'General ledger or expense data for financial forecasting.'
        },
        'Inventory Management': {
            'required_patterns': ['date|time', 'stock|inventory|on_hand', 'sku|product'],
            'optional_patterns': ['warehouse|location', 'reorder_point', 'lead_time'],
            'kpis': ['Stockout Risk', 'Inventory Turnover', 'Weeks of Supply'],
            'description': 'Stock levels for supply chain optimization.'
        },
        'Marketing Analytics': {
            'required_patterns': ['date|campaign_date', 'clicks|visits', 'spend|cost'],
            'optional_patterns': ['campaign|source|medium', 'conversions|leads', 'ctr|cpc', 'impressions'],
            'proxies': {
                'clicks|visits': ['impressions', 'conversions'], # metrics that correlate or can substitute
                'spend|cost': ['clicks'] # approximate if cpc is known (advanced) - for now just simple relations
            },
            'kpis': ['ROAS', 'CPR', 'Conversion Rate'],
            'description': 'Campaign performance data for marketing optimization.'
        },
    }

    GENERIC_DOMAIN = {
        'name': 'Generic Time-Series',
        'description': 'Unclassified time-series data.',
        'required_patterns': ['date|time', 'value|count|amount|metric'],
        'proxies': {},
        'kpis': ['Trend', 'Volatility', 'Growth']
    }

    def detect_domain(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Identify the most likely domain for the given dataframe.
        """
        columns = [str(c).lower().strip() for c in df.columns]
        best_domain = None
        best_score = 0.0
        details = {}

        for domain_name, rules in self.DOMAINS.items():
            score = self._calculate_domain_score(columns, rules)
            details[domain_name] = score
            if score > best_score:
                best_score = score
                best_domain = domain_name
        
        # Threshold for detection (e.g., 60% match of required/optional patterns)
        if best_score < 0.4:
            matched_domain = self.GENERIC_DOMAIN['name']
            confidence = 0.0
        else:
            matched_domain = best_domain
            confidence = best_score

        return {
            'detected_domain': matched_domain,
            'confidence': round(confidence, 2),
            'all_scores': details
        }

    def analyze_gaps(self, df: pd.DataFrame, domain_name: str) -> Dict[str, Any]:
        """
        Analyze missing columns for the chosen domain.
        """
        if domain_name == self.GENERIC_DOMAIN['name']:
             return {
                'status': 'Generic',
                'missing_required': [],
                'missing_optional': [],
                'proxy_suggestions': [],
                'suggestions': ['Ensure you have a Date column and at least one Metric column.']
            }

        if domain_name not in self.DOMAINS:
             return {'status': 'Unknown'}

        rules = self.DOMAINS[domain_name]
        columns = [str(c).lower().strip() for c in df.columns]

        missing_required = []
        proxy_suggestions = []

        for pattern in rules['required_patterns']:
            if not self._match_pattern(columns, pattern):
                missing_col = self._humanize_pattern(pattern)
                missing_required.append(missing_col)
                
                # Check for proxies
                if 'proxies' in rules and pattern in rules['proxies']:
                    for proxy_pat in rules['proxies'][pattern]:
                        if self._match_pattern(columns, proxy_pat):
                            found_proxy = self._find_matching_col(columns, proxy_pat)
                            proxy_suggestions.append(
                                f"Missing '{missing_col}' but found '{found_proxy}'. Use as proxy?"
                            )

        missing_optional = []
        for pattern in rules['optional_patterns']:
            if not self._match_pattern(columns, pattern):
                missing_optional.append(self._humanize_pattern(pattern))
        
        # Generate suggestions
        suggestions = []
        if missing_required:
            suggestions.append(f"Critical: Missing {', '.join(missing_required)}. Analysis may be limited.")
        if missing_optional:
            suggestions.append(f"Recommended: Add {', '.join(missing_optional)} for deeper insights.")
        if proxy_suggestions:
             suggestions.append(f"Proxies Available: {'; '.join(proxy_suggestions)}")

        return {
            'domain': domain_name,
            'description': rules['description'],
            'kpis': rules['kpis'],
            'missing_required': missing_required,
            'missing_optional': missing_optional,
            'proxy_suggestions': proxy_suggestions,
            'suggestions': suggestions,
            'status': 'Incomplete' if missing_required else 'Complete'
        }

    def _calculate_domain_score(self, columns: List[str], rules: Dict) -> float:
        """
        Score = (Found Required / Total Required) * 0.7 + (Found Optional / Total Optional) * 0.3
        """
        req_pats = rules['required_patterns']
        opt_pats = rules['optional_patterns']

        found_req = sum(1 for p in req_pats if self._match_pattern(columns, p))
        found_opt = sum(1 for p in opt_pats if self._match_pattern(columns, p))

        # Weights
        req_score = (found_req / len(req_pats)) if req_pats else 0
        opt_score = (found_opt / len(opt_pats)) if opt_pats else 0

        return (req_score * 0.7) + (opt_score * 0.3)

    def _match_pattern(self, columns: List[str], pattern: str) -> bool:
        """
        Check if any column matches the regex pattern.
        """
        # Pattern is like 'date|time|timestamp'
        regex = re.compile(pattern, re.IGNORECASE)
        return any(regex.search(col) for col in columns)

    def _find_matching_col(self, columns: List[str], pattern: str) -> Optional[str]:
        """
        Find the first column that matches the regex pattern.
        """
        regex = re.compile(pattern, re.IGNORECASE)
        for col in columns:
            if regex.search(col):
                return col
        return None

    def _humanize_pattern(self, pattern: str) -> str:
        """
        Convert 'qty|quantity|units' -> 'Quantity' (first term capitalized)
        """
        return pattern.split('|')[0].title()
