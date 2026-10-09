package com.bankflow.banking.service;

import com.bankflow.banking.entity.Account;
import com.bankflow.banking.entity.AccountType;

import java.math.BigDecimal;
import java.util.List;

public interface AccountService {

    BigDecimal SAVINGS_PERCENTAGE = new BigDecimal("0.05");   // 5%
    BigDecimal MAX_CONTRIBUTION = new BigDecimal("100.00");   // cap per transaction
    BigDecimal MIN_TRANSACTION_AMOUNT = BigDecimal.ONE;       // amount must be > this

    Account openAccount(Long userId, AccountType type, BigDecimal initialDeposit);

    Account deposit(Long accountId, BigDecimal amount, String remarks);

    Account withdraw(Long accountId, BigDecimal amount, String remarks);

    Account pay(Long accountId, BigDecimal amount, String remarks);

    void transfer(Long fromAccountId, Long toAccountId, BigDecimal amount, String remarks);

    Account toggleRoundOff(Long accountId, boolean enabled);

    Account withdrawFromPiggyBank(Long accountId, BigDecimal amount);

    List<Account> getAccountsForUser(Long userId);

    Account findAccountByNumber(String accountNumber);
}