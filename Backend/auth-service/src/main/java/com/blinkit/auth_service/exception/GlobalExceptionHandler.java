package com.blinkit.auth_service.exception;

import com.blinkit.auth_service.dto.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleUserExist(UserAlreadyExistsException ex, HttpServletRequest httpServletRequest){
        return new ResponseEntity<>(
                new ApiErrorResponse(
                        HttpStatus.CONFLICT.value(), "USER_ALREADY_EXISTS",ex.getMessage(),httpServletRequest.getRequestURI()
                ),HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex, HttpServletRequest httpServletRequest){
        return new ResponseEntity<>(
                new ApiErrorResponse(
                        HttpStatus.UNAUTHORIZED.value(), "INVALID_CREDENTIALS",ex.getMessage(),httpServletRequest.getRequestURI()
                ),HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleUserNotFound(UserNotFoundException ex, HttpServletRequest httpServletRequest){
        return new ResponseEntity<>(
                new ApiErrorResponse(
                        HttpStatus.NOT_FOUND.value(), "USER_NOT_FOUND",ex.getMessage(),httpServletRequest.getRequestURI()
                ),HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex, HttpServletRequest httpServletRequest){
        return new ResponseEntity<>(
                new ApiErrorResponse(
                        HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR",ex.getMessage(),httpServletRequest.getRequestURI()
                ),HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

}
