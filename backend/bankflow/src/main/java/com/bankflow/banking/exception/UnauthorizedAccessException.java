package com.bankflow.banking.exception;

public class UnauthorizedAccessException {
    
}
package com.bankflow.banking.exception;

public class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException(String message) {
        super(message);
    }
}