package com.bankflow.banking.validator;

import com.bankflow.banking.entity.Account;
import com.bankflow.banking.exception.InsufficientBalanceException;
import com.bankflow.banking.exception.InvalidAmountException;
import com.bankflow.banking.service.AccountService;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class AccountValidator {

    public void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Amount must be greater than zero!");
        }
        if (amount.compareTo(AccountService.MIN_TRANSACTION_AMOUNT) < 0) {
            throw new InvalidAmountException("Amount must be at least ₹" + AccountService.MIN_TRANSACTION_AMOUNT + "!");
        }
    }

    // used for piggy bank withdrawal — no minimum floor, it's the user's own saved money
    public void validatePiggyBankAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Amount must be greater than zero!");
        }
    }

    public void validateSufficientBalance(Account account, BigDecimal amount) {
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance!");
        }
    }

    public void validateInitialDeposit(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidAmountException("Initial deposit cannot be negative!");
        }
    }

    public void validateDifferentAccounts(Long fromAccountId, Long toAccountId) {
        if (fromAccountId.equals(toAccountId)) {
            throw new InvalidAmountException("Cannot transfer to the same account!");
        }
    }

    public void validateSufficientPiggyBank(Account account, BigDecimal amount) {
        if (account.getPiggyBankBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient piggy bank savings!");
        }
    }
}