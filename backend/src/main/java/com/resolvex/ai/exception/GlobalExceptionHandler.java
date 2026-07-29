package com.resolvex.ai.exception;

import com.resolvex.ai.response.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());
        ApiResponse<Void> response = ApiResponse.failure("Validation Failed", errors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidCredentials(InvalidCredentialsException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(BadCredentialsException ex) {
        ApiResponse<Void> response = ApiResponse.failure("Invalid credentials provided", "Invalid email or password");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiResponse<Void>> handleExpiredJwt(ExpiredJwtException ex) {
        ApiResponse<Void> response = ApiResponse.failure("JWT Token has expired", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler({MalformedJwtException.class, SignatureException.class})
    public ResponseEntity<ApiResponse<Void>> handleInvalidJwt(Exception ex) {
        ApiResponse<Void> response = ApiResponse.failure("JWT Token is invalid", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(IncidentNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleIncidentNotFound(IncidentNotFoundException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(KnowledgeNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleKnowledgeNotFound(KnowledgeNotFoundException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ChatException.class)
    public ResponseEntity<ApiResponse<Void>> handleChatException(ChatException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        ApiResponse<Void> response = ApiResponse.failure("Access Denied: " + ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(WorkflowNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleWorkflowNotFound(WorkflowNotFoundException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AssignmentException.class)
    public ResponseEntity<ApiResponse<Void>> handleAssignmentException(AssignmentException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ApprovalException.class)
    public ResponseEntity<ApiResponse<Void>> handleApprovalException(ApprovalException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EscalationException.class)
    public ResponseEntity<ApiResponse<Void>> handleEscalationException(EscalationException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NotificationException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotificationException(NotificationException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EmailException.class)
    public ResponseEntity<ApiResponse<Void>> handleEmailException(EmailException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(SlackException.class)
    public ResponseEntity<ApiResponse<Void>> handleSlackException(SlackException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SMSException.class)
    public ResponseEntity<ApiResponse<Void>> handleSMSException(SMSException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PushNotificationException.class)
    public ResponseEntity<ApiResponse<Void>> handlePushNotificationException(PushNotificationException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AnalyticsException.class)
    public ResponseEntity<ApiResponse<Void>> handleAnalyticsException(AnalyticsException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ReportNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleReportNotFoundException(ReportNotFoundException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ReportException.class)
    public ResponseEntity<ApiResponse<Void>> handleReportException(ReportException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(InsightException.class)
    public ResponseEntity<ApiResponse<Void>> handleInsightException(InsightException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AdminException.class)
    public ResponseEntity<ApiResponse<Void>> handleAdminException(AdminException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PermissionException.class)
    public ResponseEntity<ApiResponse<Void>> handlePermissionException(PermissionException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AuditException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuditException(AuditException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BackupException.class)
    public ResponseEntity<ApiResponse<Void>> handleBackupException(BackupException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(DashboardException.class)
    public ResponseEntity<ApiResponse<Void>> handleDashboardException(DashboardException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(LoggingException.class)
    public ResponseEntity<ApiResponse<Void>> handleLoggingException(LoggingException ex) {
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        ApiResponse<Void> response = ApiResponse.failure("Internal Server Error", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
