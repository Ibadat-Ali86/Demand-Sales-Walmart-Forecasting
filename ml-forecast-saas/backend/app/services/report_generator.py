import base64
import io
import logging
from datetime import datetime
import uuid
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from jinja2 import Environment, FileSystemLoader
# Try importing weasyprint, handle failure gracefully
try:
    from weasyprint import HTML
    WEASYPRINT_AVAILABLE = True
except ImportError:
    WEASYPRINT_AVAILABLE = False
except OSError:
    # This happens if cairo/pango are missing
    WEASYPRINT_AVAILABLE = False

logger = logging.getLogger(__name__)

class GapTranslator:
    """Translates technical data gaps into business opportunities."""
    
    DICTIONARY = {
        "missing_pricing_data": {
            "business_opportunity": "Revenue Optimization Strategy",
            "benefit": "Unlocks dynamic pricing insights and elasticity modeling."
        },
        "short_time_series": {
            "business_opportunity": "Long-term Strategic Forecasting",
            "benefit": "Enables seasonal trend detection and annual growth projections."
        },
        "low_data_quality": {
            "business_opportunity": "Data Governance Initiative",
            "benefit": "Improves decision confidence score from Medium to High."
        },
        "missing_categories": {
            "business_opportunity": "Portfolio Segmentation",
            "benefit": "Allows for granular, category-specific performance tracking."
        }
    }

    @staticmethod
    def translate(gap_key, column_name):
        entry = GapTranslator.DICTIONARY.get(gap_key, {
            "business_opportunity": "Data Enrichment Opportunity",
            "benefit": f"Integration of '{column_name}' would enhance model precision."
        })
        return {
            "column_name": column_name,
            "business_opportunity": entry["business_opportunity"],
            "benefit": entry["benefit"]
        }

class ChartGenerator:
    """Generates static charts for PDF embedding."""
    
    @staticmethod
    def generate_forecast_chart(df: pd.DataFrame, target_col: str, date_col: str):
        """Create a forecast chart and return base64 string."""
        plt.figure(figsize=(10, 4))
        
        # Ensure dates are datetime
        dates = pd.to_datetime(df[date_col])
        values = df[target_col]
        
        # Plot historical (last 30 points max for readability)
        plt.plot(dates, values, label='Historical', color='#6366f1', linewidth=2)
        
        # Add basic forecast simulation for visual if 'yhat' exists, else just data
        if 'yhat' in df.columns:
            plt.plot(dates, df['yhat'], label='Forecast', color='#10b981', linestyle='--')
            if 'yhat_lower' in df.columns and 'yhat_upper' in df.columns:
                plt.fill_between(dates, df['yhat_lower'], df['yhat_upper'], color='#10b981', alpha=0.1)

        plt.title(f"{target_col} Forecast Trend", fontsize=12, pad=20)
        plt.grid(True, linestyle='--', alpha=0.3)
        plt.legend()
        plt.tight_layout()
        
        # Save to buffer
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=150)
        plt.close()
        return base64.b64encode(buf.getvalue()).decode('utf-8')

    @staticmethod
    def generate_comparison_chart(baseline: dict, results: dict):
        """Create a side-by-side bar chart for Revenue and Margin."""
        plt.figure(figsize=(10, 5))
        
        metrics = ['Revenue', 'Margin']
        baseline_vals = [baseline.get('revenue', 0), baseline.get('margin', 0)]
        scenario_vals = [results.get('revenue', 0), results.get('margin', 0)]
        
        x = np.arange(len(metrics))
        width = 0.35
        
        fig, ax = plt.subplots(figsize=(10, 5))
        rects1 = ax.bar(x - width/2, baseline_vals, width, label='Baseline', color='#94a3b8')
        rects2 = ax.bar(x + width/2, scenario_vals, width, label='Scenario', color='#6366f1')
        
        ax.set_ylabel('Amount ($)')
        ax.set_title('Financial Impact Comparison')
        ax.set_xticks(x)
        ax.set_xticklabels(metrics)
        ax.legend()
        
        # Add labels
        def autolabel(rects):
            for rect in rects:
                height = rect.get_height()
                ax.annotate(f'${height:,.0f}',
                            xy=(rect.get_x() + rect.get_width() / 2, height),
                            xytext=(0, 3),  # 3 points vertical offset
                            textcoords="offset points",
                            ha='center', va='bottom', fontsize=8)

        autolabel(rects1)
        autolabel(rects2)
        
        plt.tight_layout()
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=150)
        plt.close()
        return base64.b64encode(buf.getvalue()).decode('utf-8')
    @staticmethod
    def generate_financial_chart(financials: dict):
        """Create a bar chart for Financial Projections."""
        plt.figure(figsize=(8, 4))
        
        metrics = ['Revenue', 'COGS', 'Gross Margin']
        
        # Parse currency strings
        def parse(val):
            if isinstance(val, (int, float)): return val
            if isinstance(val, str):
                 return float(val.replace('$', '').replace(',', '').replace('%', ''))
            return 0

        values = [
            parse(financials.get('projected_revenue', 0)),
            parse(financials.get('projected_cogs', 0)),
            parse(financials.get('gross_margin', 0))
        ]
        
        colors = ['#6366f1', '#f43f5e', '#10b981']
        
        bars = plt.bar(metrics, values, color=colors, width=0.5)
        
        plt.title('Projected Financial Overview', fontsize=12, pad=15)
        plt.ylabel('Amount (USD)', fontsize=10)
        plt.grid(axis='y', linestyle='--', alpha=0.3)
        
        # Add values on top
        for bar in bars:
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height,
                    f'${height:,.0f}',
                    ha='center', va='bottom', fontsize=9)
            
        plt.tight_layout()
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=150)
        plt.close()
        return base64.b64encode(buf.getvalue()).decode('utf-8')

class ReportGenerator:
    def __init__(self, template_dir=None):
        if template_dir is None:
            import os
            # Resolution: services -> app -> templates
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            template_dir = os.path.join(base_dir, 'templates')
            
        self.env = Environment(loader=FileSystemLoader(template_dir))
        
    def generate_pdf(self, session_data: dict, output_path: str = None) -> bytes:
        if not WEASYPRINT_AVAILABLE:
            raise RuntimeError("WeasyPrint not available. Cannot generate PDF.")

        # 1. Prepare Data Context
        context = self._build_context(session_data)
        
        # 2. Render HTML
        template = self.env.get_template("report_template.html")
        html_string = template.render(**context)
        
        # 3. Convert to PDF
        pdf_bytes = HTML(string=html_string).write_pdf()
        
        if output_path:
            with open(output_path, "wb") as f:
                f.write(pdf_bytes)
                
        return pdf_bytes

    def generate_scenario_pdf(self, scenario_data: dict) -> bytes:
        """Generates a scenario comparison PDF."""
        if not WEASYPRINT_AVAILABLE:
            raise RuntimeError("WeasyPrint not available.")

        # 1. Prepare Data
        baseline = scenario_data.get('baseline', {})
        results = scenario_data.get('results', {})
        scenarios = scenario_data.get('scenarios', {})
        
        # Calculate derived metrics for template
        net_impact = results.get('margin', 0) - baseline.get('margin', 0)
        revenue_change = results.get('revenue', 0) - baseline.get('revenue', 0)
        revenue_change_percent = (revenue_change / baseline.get('revenue', 1)) * 100

        # Generate Chart
        chart_b64 = ChartGenerator.generate_comparison_chart(baseline, results)

        context = {
            "generated_date": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "report_id": str(uuid.uuid4())[:8],
            "baseline": baseline,
            "results": results,
            "scenarios": scenarios,
            "net_impact": net_impact,
            "abs_net_impact": abs(net_impact),
            "revenue_change": revenue_change,
            "revenue_change_percent": revenue_change_percent,
            "comparison_chart": chart_b64
        }
        
        # 2. Render
        template = self.env.get_template("scenario_report_template.html")
        html_string = template.render(**context)
        
        # 3. PDF
        return HTML(string=html_string).write_pdf()

    def _build_context(self, data: dict) -> dict:
        """Transforms raw session data into template-friendly context."""
        profile = data.get('profile', {})
        metrics = data.get('metrics', {})
        schema_analysis = data.get('schema_analysis', {})
        insights = data.get('insights', {})
        
        # Confidence logic
        rows = profile.get('row_count', data.get('rows', 0))
        
        # Domain detection fallback
        domain = profile.get('domain')
        if not domain and schema_analysis:
            domain = schema_analysis.get('domain')
        if not domain:
            domain = 'Business Analytics'

        # Confidence Score Calculation
        confidence = 90
        if schema_analysis:
            confidence = int(schema_analysis.get('overall_confidence', 90))
        
        if rows < 50: confidence -= 10 
        
        # Chart generation
        forecast_b64 = None
        if 'forecast' in data:
            forecast_dict = {
                'date': data['forecast']['dates'],
                'yhat': data['forecast']['predictions']
            }
            if 'lower_bound' in data['forecast']:
                 forecast_dict['yhat_lower'] = data['forecast']['lower_bound']
            if 'upper_bound' in data['forecast']:
                 forecast_dict['yhat_upper'] = data['forecast']['upper_bound']
            
            df_forecast = pd.DataFrame(forecast_dict)
            # Mock historical for the chart if not passed explicitly, 
            # ideally we merge actuals + forecast. Use 'yhat' as dummy if needed or empty.
            # We will use 'yhat' as value for simplified chart if 'value' column missing
            df_forecast['sales'] = df_forecast['yhat'] 
            forecast_b64 = ChartGenerator.generate_forecast_chart(df_forecast, 'sales', 'date')

        # Financial Chart
        financial_chart_b64 = None
        if 'financial_metrics' in insights:
            financial_chart_b64 = ChartGenerator.generate_financial_chart(insights['financial_metrics'])

        # Prepare risks and opportunities
        # Backend might return them as dicts
        risks = insights.get('risks', [])
        opportunities = insights.get('opportunities', [])
        
        # Action Plan
        action_plan = insights.get('action_plan', {})
        
        return {
            "domain": domain,
            "generated_date": datetime.now().strftime("%Y-%m-%d"),
            "report_id": str(uuid.uuid4())[:8],
            "filename": data.get('filename', 'dataset.csv'),
            "confidence_score": max(10, confidence),
            "executive_summary": insights.get('executive_summary', {}).get('headline', self._generate_summary(data)),
            "key_metrics": [
                {"label": "Detailed Rows", "value": f"{rows:,}"},
                {"label": "Forecast Accuracy", "value": f"{metrics.get('accuracy_rating', 'Moderate')}"},
                {"label": "Projected Revenue", "value": insights.get('financial_metrics', {}).get('projected_revenue', 'N/A')}
            ],
            "insights": opportunities, # Map opps to Insights section
            "risks": risks,
            "financial_metrics": insights.get('financial_metrics'),
            "financial_chart": financial_chart_b64,
            "action_plan": action_plan,
            "forecast_chart": forecast_b64,
            "model_metrics": {
                "mape": f"{metrics.get('mape', 0):.2f}",
                "rmse": f"{metrics.get('rmse', 0):.2f}",
                "model_type": metrics.get('modelType', data.get('model_used', 'Ensemble'))
            },
            "recommendations": [ 
                 # Convert opportunities to recommendations format if needed, or keep separate
                 {"action": opp['action'], "outcome": opp['description']} for opp in opportunities if 'action' in opp
            ] or [
                 {"action": "Collect More History", "outcome": "Improve seasonality detection."}
            ]
        }

    def _generate_summary(self, data):
        """Simple narrative generator."""
        profile = data.get('profile', {})
        domain = profile.get('domain', 'general')
        return f"This report provides a comprehensive analysis of your {domain} data. " \
               f"Our AI engine processed {profile.get('row_count', 0)} records to generate these insights. " \
               "While the data provides strong directional signals, we have identified specific opportunities " \
               "for data enrichment that could further enhance forecast precision."
