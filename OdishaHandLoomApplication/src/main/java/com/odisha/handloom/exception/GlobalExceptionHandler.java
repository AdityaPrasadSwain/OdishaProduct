package com.odisha.handloom.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex) {
        logger.error("Unhandled exception occurred: ", ex);
        Map<String, String> error = new HashMap<>();
        error.put("error", "Internal Server Error");
        error.put("message", ex.getMessage() != null ? ex.getMessage() : "Unknown error occurred");
        error.put("details", ex.getClass().getName());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        logger.error("Runtime exception occurred: ", ex);
        Map<String, String> error = new HashMap<>();
        error.put("error", "Request Failed");
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(
            org.springframework.web.bind.MethodArgumentNotValidException ex) {
        Map<String, Object> error = new HashMap<>();
        if (ex.getBindingResult().hasErrors()) {
            org.springframework.validation.FieldError firstError = ex.getBindingResult().getFieldErrors().get(0);
            error.put("status", HttpStatus.BAD_REQUEST.value());
            error.put("field", firstError.getField());
            error.put("message", firstError.getDefaultMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "File too large");
        error.put("message", "File too large!");
        return new ResponseEntity<>(error, HttpStatus.EXPECTATION_FAILED);
    }
}
