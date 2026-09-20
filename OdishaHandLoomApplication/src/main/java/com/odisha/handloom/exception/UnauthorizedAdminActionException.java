package com.odisha.handloom.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class UnauthorizedAdminActionException extends RuntimeException {
    public UnauthorizedAdminActionException(String message) {
        super(message);
    }
    
    public UnauthorizedAdminActionException(String action, String reason) {
        super(String.format("Not authorized to perform %s: %s", action, reason));
    }
}
