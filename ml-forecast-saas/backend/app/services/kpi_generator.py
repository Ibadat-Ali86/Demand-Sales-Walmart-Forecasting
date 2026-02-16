
import pandas as pd
import numpy as np
from typing import Dict, Any, List

class KPIGenerator:
    """
    Generates domain-specific Key Performance Indicators (KPIs) 
    based on the detected business domain of the dataset.
    """
    
    @staticmethod
    def generate_kpis(df: pd.DataFrame, domain: str, column_mapping: Dict[str, str]) -> Dict[str, Any]:
        """
        Calculate KPIs relevant to the specific domain.
        
        Args:
            df: The dataset as a pandas DataFrame
            domain: The detected domain (e.g., "Marketing Analytics", "Sales Forecasting")
            column_mapping: Dictionary mapping logical roles to actual column names
                            (e.g., {'target': 'Sales', 'date': 'Date'})
                            
        Returns:
            Dictionary containing calculated KPIs and their display formats.
        """
        kpis = {}
        
        # Normalize columns for easier access
        cols = {k.lower(): v for k, v in column_mapping.items()}
        
        # Helper to find column by partial name if not in mapping
        def find_col(keywords: List[str]) -> str:
            for col in df.columns:
                if any(k in col.lower() for k in keywords):
                    print(f"DEBUG: Found {col} for keywords {keywords}")
                    return col
            print(f"DEBUG: Failed to find col for keywords {keywords} in {df.columns}")
            return None

        print(f"DEBUG: Generating KPIs for domain: {domain}")
        print(f"DEBUG: DF Columns: {df.columns}")


        try:
            if domain == "Marketing Analytics":
                kpis = KPIGenerator._generate_marketing_kpis(df, find_col)
            elif domain == "Sales Forecasting":
                kpis = KPIGenerator._generate_sales_kpis(df, find_col, cols.get('target'))
            elif domain == "HR Analytics":
                kpis = KPIGenerator._generate_hr_kpis(df, find_col)
            elif domain == "Financial Metrics":
                kpis = KPIGenerator._generate_finance_kpis(df, find_col)
            elif domain == "Inventory Management":
                kpis = KPIGenerator._generate_inventory_kpis(df, find_col)
            
            # Always add generic KPIs if domain specific ones failed or aren't available
            if not kpis:
                kpis = KPIGenerator._generate_generic_kpis(df, cols.get('target'))
                
        except Exception as e:
            print(f"Error generating KPIs for {domain}: {str(e)}")
            kpis = KPIGenerator._generate_generic_kpis(df, cols.get('target'))
            
        return kpis

    @staticmethod
    def _generate_marketing_kpis(df: pd.DataFrame, find_col) -> Dict[str, Any]:
        kpis = []
        
        spend_col = find_col(['spend', 'cost', 'ad_spend', 'budget'])
        revenue_col = find_col(['revenue', 'sales', 'value', 'return'])
        clicks_col = find_col(['click'])
        impr_col = find_col(['impression', 'views'])
        conv_col = find_col(['conversion', 'purchase', 'order'])
        
        # 1. ROAS (Return on Ad Spend)
        if spend_col and revenue_col:
            # Force numeric
            spend = pd.to_numeric(df[spend_col], errors='coerce').fillna(0)
            revenue = pd.to_numeric(df[revenue_col], errors='coerce').fillna(0)
            
            total_spend = spend.sum()
            total_rev = revenue.sum()
            if total_spend > 0:
                roas = total_rev / total_spend
                kpis.append({
                    "label": "ROAS",
                    "value": f"{roas:.2f}x",
                    "trend": "up" if roas > 4 else "neutral",
                    "desc": "Return on Ad Spend"
                })

        # 2. CPA (Cost Per Acquisition)
        if spend_col and conv_col:
            spend = pd.to_numeric(df[spend_col], errors='coerce').fillna(0)
            conv = pd.to_numeric(df[conv_col], errors='coerce').fillna(0)
            
            total_spend = spend.sum()
            total_conv = conv.sum()
            if total_conv > 0:
                cpa = total_spend / total_conv
                kpis.append({
                    "label": "CPA",
                    "value": f"${cpa:.2f}",
                    "trend": "down" if cpa < 50 else "up", # Heuristic
                    "desc": "Cost Per Acquisition"
                })
        
        # 3. CTR (Click Through Rate)
        if clicks_col and impr_col:
            clicks = pd.to_numeric(df[clicks_col], errors='coerce').fillna(0)
            impr = pd.to_numeric(df[impr_col], errors='coerce').fillna(0)
            
            total_clicks = clicks.sum()
            total_impr = impr.sum()
            if total_impr > 0:
                ctr = (total_clicks / total_impr) * 100
                kpis.append({
                    "label": "CTR",
                    "value": f"{ctr:.2f}%",
                    "trend": "up" if ctr > 1.5 else "neutral",
                    "desc": "Click-Through Rate"
                })

        # 4. Conversion Rate
        if conv_col and clicks_col:
            conv = pd.to_numeric(df[conv_col], errors='coerce').fillna(0)
            clicks = pd.to_numeric(df[clicks_col], errors='coerce').fillna(0)
            
            total_conv = conv.sum()
            total_clicks = clicks.sum()
            if total_clicks > 0:
                cr = (total_conv / total_clicks) * 100
                kpis.append({
                    "label": "CVR",
                    "value": f"{cr:.2f}%",
                    "trend": "up" if cr > 2.5 else "neutral",
                    "desc": "Conversion Rate"
                })
                
        return kpis

    @staticmethod
    def _generate_sales_kpis(df: pd.DataFrame, find_col, target_col) -> Dict[str, Any]:
        kpis = []
        
        sales_col = target_col or find_col(['sales', 'revenue', 'amount'])
        qty_col = find_col(['quantity', 'units', 'volume'])
        profit_col = find_col(['profit', 'margin'])
        
        # 1. Total Revenue
        if sales_col:
            total_sales = df[sales_col].sum()
            kpis.append({
                "label": "Total Revenue",
                "value": f"${total_sales:,.0f}",
                "trend": "neutral",
                "desc": "Gross Revenue"
            })
            
        # 2. ASP (Average Selling Price)
        if sales_col and qty_col:
            total_sales = df[sales_col].sum()
            total_qty = df[qty_col].sum()
            if total_qty > 0:
                asp = total_sales / total_qty
                kpis.append({
                    "label": "ASP",
                    "value": f"${asp:.2f}",
                    "trend": "neutral",
                    "desc": "Average Selling Price"
                })
                
        # 3. Profit Margin
        if sales_col and profit_col:
            total_sales = df[sales_col].sum()
            total_profit = df[profit_col].sum()
            if total_sales > 0:
                margin = (total_profit / total_sales) * 100
                kpis.append({
                    "label": "Net Margin",
                    "value": f"{margin:.1f}%",
                    "trend": "up" if margin > 15 else "down",
                    "desc": "Net Profit Margin"
                })
                
        return kpis

    @staticmethod
    def _generate_hr_kpis(df: pd.DataFrame, find_col) -> Dict[str, Any]:
        kpis = []
        
        id_col = find_col(['employee_id', 'staff_id', 'id'])
        term_col = find_col(['attrition', 'termination', 'left', 'term_date'])
        perf_col = find_col(['rating', 'performance', 'score'])
        
        total_headcount = len(df)
        
        # 1. Headcount
        kpis.append({
            "label": "Headcount",
            "value": str(total_headcount),
            "trend": "neutral",
            "desc": "Total Employees"
        })
        
        # 2. Attrition Rate (Simplified snapshot)
        if term_col:
            # Check if boolean/binary (1/0, Yes/No) or date
            is_term = pd.to_numeric(df[term_col], errors='coerce').fillna(0)
            if is_term.max() <= 1: # Binary flag
                terms = is_term.sum()
                rate = (terms / total_headcount) * 100
                kpis.append({
                    "label": "Attrition",
                    "value": f"{rate:.1f}%",
                    "trend": "down" if rate < 10 else "up",
                    "desc": "Attrition Rate"
                })
        
        # 3. Avg Performance
        if perf_col:
            avg_rating = pd.to_numeric(df[perf_col], errors='coerce').mean()
            if not np.isnan(avg_rating):
                kpis.append({
                    "label": "Avg Rating",
                    "value": f"{avg_rating:.2f}",
                    "trend": "up" if avg_rating > 3 else "neutral",
                    "desc": "Performance Score"
                })
                
        return kpis

    @staticmethod
    def _generate_finance_kpis(df: pd.DataFrame, find_col) -> Dict[str, Any]:
        # Placeholder for finance specific logic
        return KPIGenerator._generate_generic_kpis(df, None)

    @staticmethod
    def _generate_inventory_kpis(df: pd.DataFrame, find_col) -> Dict[str, Any]:
        # Placeholder for inventory specific logic
        return KPIGenerator._generate_generic_kpis(df, None)

    @staticmethod
    def _generate_generic_kpis(df: pd.DataFrame, target_col) -> Dict[str, Any]:
        kpis = []
        kpis.append({
            "label": "Records",
            "value": f"{len(df):,}",
            "trend": "neutral",
            "desc": "Total Rows"
        })
        
        if target_col and target_col in df.columns:
            if pd.api.types.is_numeric_dtype(df[target_col]):
                total = df[target_col].sum()
                avg = df[target_col].mean()
                kpis.append({
                    "label": f"Total {target_col}",
                    "value": f"{total:,.0f}",
                    "trend": "neutral",
                    "desc": "Sum of generic target"
                })
                kpis.append({
                    "label": f"Avg {target_col}",
                    "value": f"{avg:,.2f}",
                    "trend": "neutral",
                    "desc": "Mean of generic target"
                })
                
        return kpis
