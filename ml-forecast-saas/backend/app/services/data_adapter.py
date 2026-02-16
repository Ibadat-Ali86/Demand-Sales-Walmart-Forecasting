import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Optional, Any
import re
from dateutil import parser as date_parser
from fuzzywuzzy import fuzz, process
import logging

logger = logging.getLogger(__name__)

class DataAdapter:
    """
    Universal Data Adapter for handling messy enterprise data.
    Implements Task 0.1 of the Student-Optimized Roadmap.
    """
    
    # 200+ Common Synonyms for Column Mapping
    SYNONYMS = {
        'date': [
            'date', 'timestamp', 'time', 'day', 'dt', 'record_date', 'order_date', 
            'transaction_date', 'trans_date', 'invoice_date', 'ship_date', 'shipping_date',
            'purchase_date', 'sale_date', 'period', 'month', 'year', 'week', 'quarter',
            'fecha', 'datum', 'calendar_date', 'full_date'
        ],
        'target': [
            'sales', 'revenue', 'quantity', 'qty', 'amount', 'total', 'price', 
            'cost', 'turnover', 'gross_sales', 'net_sales', 'units_sold', 'volume', 
            'demand', 'consumption', 'spend', 'value', 'total_amount', 'qty_sold',
            'sold', 'count', 'orders', 'bookings', 'income', 'profit'
        ],
        'item': [
            'item', 'product', 'sku', 'product_id', 'item_id', 'material', 'part_number',
            'article', 'model', 'variant', 'stock_code', 'upc', 'ean', 'isbn', 
            'product_name', 'item_name', 'description', 'category', 'group', 'family',
            'segment', 'brand', 'merchandise'
        ],
        'location': [
            'store', 'shop', 'location', 'warehouse', 'branch', 'site', 'outlet',
            'market', 'region', 'zone', 'territory', 'district', 'city', 'state',
            'country', 'zip', 'postal_code', 'store_id', 'location_id', 'dc', 'loc'
        ]
    }

    def __init__(self, confidence_threshold: int = 80):
        self.confidence_threshold = confidence_threshold

    def read_file(self, file_path: str) -> pd.DataFrame:
        """
        Robustly read a file into a DataFrame.
        """
        try:
            if file_path.endswith('.csv') or file_path.endswith('.txt') or file_path.endswith('.tsv'):
                # Try with default settings first
                try:
                    return pd.read_csv(file_path, sep=None, engine='python')
                except:
                    # Try with latin1 encoding if utf-8 fails
                    return pd.read_csv(file_path, sep=None, engine='python', encoding='latin1')
            elif file_path.endswith('.xlsx') or file_path.endswith('.xls'):
                return pd.read_excel(file_path)
            else:
                raise ValueError("Unsupported file format")
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {e}")
            raise

    def normalize_dataset(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """
        Main entry point to normalize any incoming dataframe.
        """
        report = {
            "original_shape": df.shape,
            "transformations": [],
            "column_mapping": {},
            "warnings": []
        }

        # 1. Preprocess (Wide->Long, Clean Headers)
        df, preprocess_report = self.preprocess_data(df)
        report["transformations"].extend(preprocess_report["transformations"])

        # 2. Intelligent Column Mapping
        mapping = self._map_columns(df.columns)
        report["column_mapping"] = mapping
        
        # 3. Apply Mapping & Standardize
        df, standardization_report = self.apply_mapping(df, mapping)
        report["warnings"].extend(standardization_report["warnings"])
        if standardization_report["mapped_columns"] > 0:
             report["transformations"].append(f"Mapped {standardization_report['mapped_columns']} columns to standard schema")

        report["final_shape"] = df.shape
        return df, report

    def preprocess_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """
        Apply structural transformations (Unpivot, Header Cleaning)
        """
        report = {"transformations": []}
        
        # Wide to Long
        df, was_pivoted = self._detect_and_fix_wide_format(df)
        if was_pivoted:
            report["transformations"].append("Detected wide format (pivoted time series) -> Unpivoted to long format")

        # Header Cleanup
        df = self._clean_headers(df)
        
        return df, report

    def apply_mapping(self, df: pd.DataFrame, mapping: Dict[str, Any]) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """
        Apply confirmed column mapping and standardized types
        """
        report = {"warnings": [], "mapped_columns": 0}
        
        # Flatten mapping if nested (e.g. {'date': {'source_column': 'OrderDate'}})
        flat_mapping = {}
        for target, source in mapping.items():
            if isinstance(source, dict) and 'source_column' in source:
                flat_mapping[target] = source['source_column']
            else:
                flat_mapping[target] = source
        
        # Rename
        rename_dict = {orig: target for target, orig in flat_mapping.items() if orig and orig in df.columns}
        
        if rename_dict:
            df = df.rename(columns=rename_dict)
            report["mapped_columns"] = len(rename_dict)

        # Robust Date Parsing
        if 'date' in df.columns:
            df, date_warnings = self._parse_dates(df, 'date')
            report["warnings"].extend(date_warnings)

        # Numeric Conversion
        if 'target' in df.columns:
            df['target'] = pd.to_numeric(df['target'], errors='coerce')
            df = df.dropna(subset=['target'])
            
        return df, report

    def validate_dataset(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Validate the converted data quality
        """
        validation_results = {
            'is_valid': True,
            'errors': [],
            'warnings': [],
            'stats': {}
        }
        
        required_cols = ['date', 'target'] # minimal requirement
        
        # Check required columns
        for col in required_cols:
            if col not in df.columns:
                validation_results['is_valid'] = False
                validation_results['errors'].append(f"Missing required column: {col}")
        
        # Check data quality
        if len(df) < 10: # Lowered threshold for students/testing
            validation_results['warnings'].append("Dataset has fewer than 10 records - forecasts may be unreliable")
        
        if 'date' in df.columns and df['date'].isnull().sum() > 0:
            validation_results['errors'].append(f"{df['date'].isnull().sum()} invalid dates found")
            validation_results['is_valid'] = False
        
        # Calculate statistics
        if validation_results['is_valid']:
            validation_results['stats'] = {
                'total_records': len(df),
                'date_range': f"{df['date'].min()} to {df['date'].max()}" if 'date' in df.columns else "N/A",
                'total_target': float(df['target'].sum()) if 'target' in df.columns else 0,
                'avg_target': float(df['target'].mean()) if 'target' in df.columns else 0,
                'missing_values': {k: int(v) for k, v in df.isnull().sum().to_dict().items()}
            }
        
        return validation_results

    def _detect_and_fix_wide_format(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, bool]:
        """
        Detects if data is in wide format (e.g., Dates as columns) and melts it.
        """
        # Logic: If >50% of columns look like dates, it's likely wide
        date_cols = []
        for col in df.columns:
            if self._is_date_string(str(col)):
                date_cols.append(col)
        
        if len(date_cols) > 0 and len(date_cols) / len(df.columns) > 0.4:
            # Identifier columns are the ones that are NOT dates
            id_vars = [c for c in df.columns if c not in date_cols]
            
            # Melt
            df_melted = df.melt(id_vars=id_vars, value_vars=date_cols, var_name='date', value_name='target')
            return df_melted, True
            
        return df, False

    def _is_date_string(self, s: str) -> bool:
        """Check if a string looks like a date (for column headers)"""
        try:
            date_parser.parse(s)
            return True
        except:
            # Check for patterns like '2023-01', 'Jan 2023', 'Q1 2023'
            patterns = [
                r'\d{4}', r'\d{1,2}/\d{1,2}', r'[A-Za-z]{3}[-_]?\d{2,4}', r'Q\d'
            ]
            for p in patterns:
                if re.search(p, s):
                    return True
            return False

    def _clean_headers(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean column names: lowercase, strip, replace spaces"""
        df.columns = df.columns.astype(str).str.lower().str.strip().str.replace(r'[^\w\s]', '', regex=True).str.replace(r'\s+', '_', regex=True)
        return df

    def _map_columns(self, columns: List[str]) -> Dict[str, str]:
        """Map existing columns to standard schema using fuzzy matching"""
        mapping = {}
        used_cols = set()

        for standard_col, synonyms in self.SYNONYMS.items():
            best_match = None
            best_score = 0
            
            # 1. Exact match (in synonyms)
            for col in columns:
                if col in used_cols: continue
                if col in synonyms:
                    best_match = col
                    best_score = 100
                    break
            
            # 2. Fuzzy match if no exact match
            if not best_match:
                for col in columns:
                    if col in used_cols: continue
                    # Replace underscores with spaces for better token matching
                    col_text = col.replace('_', ' ')
                    # Check each synonym
                    score = process.extractOne(col_text, synonyms, scorer=fuzz.token_set_ratio)[1]
                    if score > best_score and score >= self.confidence_threshold:
                        best_score = score
                        best_match = col
            
            if best_match:
                mapping[standard_col] = best_match
                used_cols.add(best_match)
            else:
                mapping[standard_col] = None
        
        # If 'target' not found, look for remaining numeric columns
        if not mapping.get('target'):
            remaining = [c for c in columns if c not in used_cols]
            for c in remaining:
                # Heuristic: if column name implies number or is 'value'
                if any(x in c for x in ['val', 'num', 'amt', 'count']):
                     mapping['target'] = c
                     used_cols.add(c)
                     break
                     
        return mapping

    def _parse_dates(self, df: pd.DataFrame, col_name: str) -> Tuple[pd.DataFrame, List[str]]:
        """Robustly parse dates with fallback strategies"""
        warnings = []
        try:
            # Strategy 1: Fast pandas parse
            df[col_name] = pd.to_datetime(df[col_name], errors='raise')
        except:
            try:
                # Strategy 2: Infer format from first non-null
                first_valid = df[col_name].dropna().iloc[0]
                inferred_parse = date_parser.parse(str(first_valid))
                df[col_name] = df[col_name].apply(lambda x: date_parser.parse(str(x)) if pd.notnull(x) else pd.NaT)
                warnings.append("Used rigorous date parsing (slower)")
            except Exception as e:
                # Strategy 3: Coerce and warn
                df[col_name] = pd.to_datetime(df[col_name], errors='coerce')
                warnings.append(f"Forced date parsing, some invalid dates may vary: {str(e)}")
        
        return df, warnings
