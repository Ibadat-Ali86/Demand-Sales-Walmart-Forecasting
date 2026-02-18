"""
Enterprise Pipeline Orchestrator
Main controller for the analysis pipeline with robust error handling and session management
"""

import time
import traceback
from datetime import datetime
from enum import Enum
from typing import Dict, List, Any, Optional, Callable, Tuple
from dataclasses import dataclass, field, asdict
from functools import wraps

import pandas as pd

from ..utils.structured_logger import pipeline_logger
from ..services.enterprise_validator import EnterpriseDataValidator, ValidationError


class PipelineStage(Enum):
    """Enumeration of pipeline stages for tracking"""
    INGESTION = "ingestion"
    VALIDATION = "validation"
    SANITIZATION = "sanitization"
    PROFILING = "profiling"
    PREPROCESSING = "preprocessing"
    FEATURE_ENGINEERING = "feature_engineering"
    MODEL_TRAINING = "model_training"
    ENSEMBLE = "ensemble"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class PipelineContext:
    """Context object passed through pipeline stages"""
    session_id: str
    user_id: str
    file_path: str
    original_filename: str
    file_size_bytes: int
    upload_timestamp: datetime
    column_mapping: Dict[str, str]
    current_stage: PipelineStage = PipelineStage.INGESTION
    stage_history: List[Dict] = field(default_factory=list)
    data_quality_score: float = 0.0
    errors: List[Dict] = field(default_factory=list)
    warnings: List[Dict] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict:
        """Convert context to dictionary"""
        return {
            "session_id": self.session_id,
            "user_id": self.user_id,
            "file_path": self.file_path,
            "original_filename": self.original_filename,
            "file_size_bytes": self.file_size_bytes,
            "upload_timestamp": self.upload_timestamp.isoformat(),
            "column_mapping": self.column_mapping,
            "current_stage": self.current_stage.value,
            "stage_history": self.stage_history,
            "data_quality_score": self.data_quality_score,
            "errors": self.errors,
            "warnings": self.warnings,
            "metadata": self.metadata
        }


class PipelineError(Exception):
    """Base exception for pipeline errors with context"""
    def __init__(self, message: str, stage: PipelineStage, context: Dict, recoverable: bool = False):
        self.message = message
        self.stage = stage
        self.context = context
        self.recoverable = recoverable
        super().__init__(self.message)


def stage_wrapper(stage_name: PipelineStage):
    """Decorator for pipeline stage execution with error handling"""
    def decorator(func):
        @wraps(func)
        def wrapper(self, context: PipelineContext, *args, **kwargs):
            start_time = time.time()
            stage_entry = {
                "stage": stage_name.value,
                "started_at": datetime.utcnow().isoformat(),
                "status": "running"
            }
            context.stage_history.append(stage_entry)
            context.current_stage = stage_name
            
            pipeline_logger.log_event("stage_started", {
                "session_id": context.session_id,
                "stage": stage_name.value,
                "timestamp": start_time
            })
            
            try:
                # Execute the stage
                result = func(self, context, *args, **kwargs)
                
                # Record success
                duration = time.time() - start_time
                stage_entry.update({
                    "completed_at": datetime.utcnow().isoformat(),
                    "status": "completed",
                    "duration_seconds": duration
                })
                
                pipeline_logger.log_event("stage_completed", {
                    "session_id": context.session_id,
                    "stage": stage_name.value,
                    "duration_seconds": duration
                })
                
                return result
                
            except Exception as e:
                # Record failure
                duration = time.time() - start_time
                stage_entry.update({
                    "failed_at": datetime.utcnow().isoformat(),
                    "status": "failed",
                    "duration_seconds": duration,
                    "error": str(e)
                })
                
                pipeline_logger.log_error(e, {
                    "session_id": context.session_id,
                    "stage": stage_name.value,
                    "duration_seconds": duration
                }, f"pipeline_stage_{stage_name.value}")
                
                # Create detailed error context
                error_context = {
                    "session_id": context.session_id,
                    "stage": stage_name.value,
                    "operation": func.__name__,
                    "timestamp": datetime.utcnow().isoformat()
                }
                
                raise PipelineError(
                    message=f"Stage {stage_name.value} failed: {str(e)}",
                    stage=stage_name,
                    context=error_context,
                    recoverable=isinstance(e, ValidationError)
                ) from e
        
        return wrapper
    return decorator


class EnterprisePipelineOrchestrator:
    """Main orchestrator for the enterprise analysis pipeline"""
    
    def __init__(self):
        self.logger = pipeline_logger
        self.active_sessions: Dict[str, PipelineContext] = {}
    
    def create_session(self, user_id: str, file_path: str, 
                      original_filename: str, file_size: int,
                      column_mapping: Dict) -> PipelineContext:
        """
        Initialize new pipeline session
        
        Args:
            user_id: User identifier
            file_path: Path to uploaded file
            original_filename: Original filename
            file_size: File size in bytes
            column_mapping: Column mapping dictionary
            
        Returns:
            PipelineContext object
        """
        session_id = f"ses_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{user_id[:8]}"
        
        context = PipelineContext(
            session_id=session_id,
            user_id=user_id,
            file_path=file_path,
            original_filename=original_filename,
            file_size_bytes=file_size,
            upload_timestamp=datetime.utcnow(),
            column_mapping=column_mapping
        )
        
        self.active_sessions[session_id] = context
        
        self.logger.log_event("session_created", {
            "session_id": session_id,
            "user_id": user_id,
            "filename": original_filename,
            "file_size_bytes": file_size
        })
        
        return context
    
    def get_session(self, session_id: str) -> Optional[PipelineContext]:
        """Get active session by ID"""
        return self.active_sessions.get(session_id)
    
    @stage_wrapper(PipelineStage.VALIDATION)
    def validate_data(self, context: PipelineContext, df: pd.DataFrame) -> Tuple[bool, Dict]:
        """
        Validate data using enterprise validator
        
        Args:
            context: Pipeline context
            df: DataFrame to validate
            
        Returns:
            Tuple of (is_valid, validation_results)
        """
        validator = EnterpriseDataValidator(
            file_path=context.file_path,
            file_size_bytes=context.file_size_bytes,
            column_mapping=context.column_mapping
        )
        
        is_valid, results = validator.validate(df)
        
        # Update context with validation results
        context.data_quality_score = results.get("quality_score", 0.0)
        
        if not is_valid:
            # Add validation errors to context
            for failure in results.get("failed", []):
                context.errors.append({
                    "stage": "validation",
                    "check": failure["check"],
                    "message": failure["error"]
                })
        
        # Add warnings to context
        for warning in results.get("warnings", []):
            context.warnings.append({
                "stage": "validation",
                "check": warning["check"],
                "message": warning["message"]
            })
        
        return is_valid, results
    
    def handle_validation_failure(self, context: PipelineContext, results: Dict) -> Dict:
        """
        Handle validation failures with user-friendly messages
        
        Args:
            context: Pipeline context
            results: Validation results
            
        Returns:
            Error response dictionary
        """
        self.logger.log_event("validation_failed", {
            "session_id": context.session_id,
            "failed_checks": results.get("failed", []),
            "quality_score": context.data_quality_score
        })
        
        # Generate actionable error messages
        user_messages = []
        for failure in results.get("failed", []):
            msg = EnterpriseDataValidator.translate_error_to_user_message(failure)
            user_messages.append(msg)
        
        suggestions = EnterpriseDataValidator.suggest_validation_fixes(results)
        
        return {
            "success": False,
            "session_id": context.session_id,
            "error_type": "validation_failed",
            "error_stage": "validation",
            "user_messages": user_messages,
            "technical_details": results,
            "suggested_actions": suggestions,
            "quality_score": context.data_quality_score
        }
    
    def handle_pipeline_error(self, context: PipelineContext, error: PipelineError) -> Dict:
        """
        Handle known pipeline errors
        
        Args:
            context: Pipeline context
            error: Pipeline error
            
        Returns:
            Error response dictionary
        """
        self.logger.log_error(error, context.to_dict(), "pipeline_execution")
        
        return {
            "success": False,
            "session_id": context.session_id,
            "error_type": "pipeline_error",
            "error_stage": error.stage.value,
            "message": error.message,
            "recoverable": error.recoverable,
            "context": error.context
        }
    
    def handle_unexpected_error(self, context: PipelineContext, error: Exception) -> Dict:
        """
        Handle unexpected errors gracefully
        
        Args:
            context: Pipeline context
            error: Exception
            
        Returns:
            Error response dictionary
        """
        self.logger.log_error(error, context.to_dict(), "unexpected_error")
        
        return {
            "success": False,
            "session_id": context.session_id,
            "error_type": "unexpected_error",
            "error_stage": context.current_stage.value,
            "message": "An unexpected error occurred. Our team has been notified.",
            "recoverable": False,
            "error_id": f"ERR_{context.session_id}"  # For support reference
        }


# Global orchestrator instance
orchestrator = EnterprisePipelineOrchestrator()


def get_orchestrator() -> EnterprisePipelineOrchestrator:
    """Get global orchestrator instance"""
    return orchestrator
