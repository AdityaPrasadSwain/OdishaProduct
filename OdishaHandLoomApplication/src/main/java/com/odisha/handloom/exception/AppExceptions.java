package com.odisha.handloom.exception;

import org.springframework.http.HttpStatus;

public class AppExceptions {

    // --- AUTH ---
    public static class EmailAlreadyExistsException extends ApiException {
        public EmailAlreadyExistsException() {
            super("EMAIL_ALREADY_EXISTS", HttpStatus.CONFLICT, "An account with this email already exists. Try logging in, or use a different email.");
        }
    }

    public static class InvalidCredentialsException extends ApiException {
        public InvalidCredentialsException() {
            super("INVALID_CREDENTIALS", HttpStatus.UNAUTHORIZED, "Incorrect email or password. Please try again.");
        }
    }

    public static class AccountNotVerifiedException extends ApiException {
        public AccountNotVerifiedException() {
            super("ACCOUNT_NOT_VERIFIED", HttpStatus.FORBIDDEN, "Please verify your email before logging in. Check your inbox for the verification link.");
        }
    }

    public static class AccountDisabledException extends ApiException {
        public AccountDisabledException() {
            super("ACCOUNT_DISABLED", HttpStatus.FORBIDDEN, "This account has been disabled. Contact support if you think this is a mistake.");
        }
    }

    public static class SessionExpiredException extends ApiException {
        public SessionExpiredException() {
            super("SESSION_EXPIRED", HttpStatus.UNAUTHORIZED, "Your session has expired. Please log in again.");
        }
    }

    public static class InvalidResetTokenException extends ApiException {
        public InvalidResetTokenException() {
            super("INVALID_RESET_TOKEN", HttpStatus.BAD_REQUEST, "This link is invalid or has expired. Please request a new one.");
        }
    }

    public static class TooManyAttemptsException extends ApiException {
        public TooManyAttemptsException() {
            super("TOO_MANY_ATTEMPTS", HttpStatus.TOO_MANY_REQUESTS, "Too many login attempts. Please wait a few minutes and try again.");
        }
    }

    // --- CART & CHECKOUT ---
    public static class CartEmptyException extends ApiException {
        public CartEmptyException() {
            super("CART_EMPTY", HttpStatus.BAD_REQUEST, "Your cart is empty. Add something before checking out.");
        }
    }

    public static class OutOfStockException extends ApiException {
        public OutOfStockException(String productName) {
            super("OUT_OF_STOCK", HttpStatus.CONFLICT, "Sorry, " + productName + " just went out of stock. Please remove it to continue.");
        }
    }

    public static class InsufficientStockException extends ApiException {
        public InsufficientStockException(String productName, int availableQty) {
            super("INSUFFICIENT_STOCK", HttpStatus.CONFLICT, "Only " + availableQty + " left of " + productName + ". Please update the quantity in your cart.");
        }
    }

    public static class PriceChangedException extends ApiException {
        public PriceChangedException() {
            super("PRICE_CHANGED", HttpStatus.CONFLICT, "Prices in your cart have been updated. Please review before continuing.");
        }
    }

    public static class CouponExpiredException extends ApiException {
        public CouponExpiredException() {
            super("COUPON_EXPIRED", HttpStatus.BAD_REQUEST, "This coupon has expired.");
        }
    }

    public static class CouponMinNotMetException extends ApiException {
        public CouponMinNotMetException(java.math.BigDecimal amount) {
            super("COUPON_MIN_NOT_MET", HttpStatus.BAD_REQUEST, "Add ₹" + amount + " more to your cart to use this coupon.");
        }
    }

    public static class CouponLimitReachedException extends ApiException {
        public CouponLimitReachedException() {
            super("COUPON_LIMIT_REACHED", HttpStatus.BAD_REQUEST, "This coupon has already been used the maximum number of times.");
        }
    }

    public static class AddressNotServiceableException extends ApiException {
        public AddressNotServiceableException() {
            super("ADDRESS_NOT_SERVICEABLE", HttpStatus.BAD_REQUEST, "Sorry, we don't deliver to this location yet.");
        }
    }

    // --- ORDERS & PAYMENT ---
    public static class OrderNotFoundException extends ApiException {
        public OrderNotFoundException() {
            super("ORDER_NOT_FOUND", HttpStatus.NOT_FOUND, "We couldn't find this order. It may have been cancelled or the link is incorrect.");
        }
    }

    public static class PaymentFailedException extends ApiException {
        public PaymentFailedException(String sanitizedReason) {
            super("PAYMENT_FAILED", HttpStatus.PAYMENT_REQUIRED, "Your payment couldn't be processed. " + sanitizedReason + " Please try again or use a different payment method.");
        }
    }

    public static class PaymentPendingException extends ApiException {
        public PaymentPendingException() {
            super("PAYMENT_PENDING", HttpStatus.ACCEPTED, "We're confirming your payment. This can take a few minutes — please don't place the order again.");
        }
    }

    public static class DuplicateRequestException extends ApiException {
        public DuplicateRequestException() {
            super("DUPLICATE_REQUEST", HttpStatus.OK, "Request already processed.");
        }
    }

    public static class OrderNotModifiableException extends ApiException {
        public OrderNotModifiableException(String status) {
            super("ORDER_NOT_MODIFIABLE", HttpStatus.CONFLICT, "This order has already been " + status + " and can no longer be changed.");
        }
    }

    public static class RefundAlreadyRequestedException extends ApiException {
        public RefundAlreadyRequestedException() {
            super("REFUND_ALREADY_REQUESTED", HttpStatus.CONFLICT, "A refund for this order is already being processed.");
        }
    }

    // --- GENERIC ---
    public static class ValidationFailedException extends ApiException {
        public ValidationFailedException() {
            super("VALIDATION_FAILED", HttpStatus.BAD_REQUEST, "Please fix the highlighted fields.");
        }
    }

    public static class ResourceNotFoundException extends ApiException {
        public ResourceNotFoundException(String resourceName) {
            super("NOT_FOUND", HttpStatus.NOT_FOUND, "We couldn't find the " + resourceName + " you're looking for.");
        }
    }

    public static class AccessDeniedException extends ApiException {
        public AccessDeniedException() {
            super("ACCESS_DENIED", HttpStatus.FORBIDDEN, "You don't have permission to do that.");
        }
    }

    public static class RateLimitExceededException extends ApiException {
        public RateLimitExceededException() {
            super("RATE_LIMITED", HttpStatus.TOO_MANY_REQUESTS, "You're doing that too quickly. Please wait a moment and try again.");
        }
    }
}
