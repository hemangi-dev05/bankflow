package com.bankflow.banking.service.impl;

import com.bankflow.banking.entity.*;
import com.bankflow.banking.exception.AccountNotFoundException;
import com.bankflow.banking.exception.UnauthorizedAccessException;
import com.bankflow.banking.exception.UserNotFoundException;
import com.bankflow.banking.repository.AccountRepository;
import com.bankflow.banking.repository.TransactionRepository;
import com.bankflow.banking.repository.UserRepository;
import com.bankflow.banking.security.SecurityUtils;
import com.bankflow.banking.service.AccountService;
import com.bankflow.banking.validator.AccountValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {

    private static final int MONEY_SCALE = 2;

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final AccountValidator validator;
    private final SecurityUtils securityUtils;

    public AccountServiceImpl(AccountRepository accountRepository,
                               TransactionRepository transactionRepository,
                               UserRepository userRepository,
                               AccountValidator validator,
                               SecurityUtils securityUtils) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.validator = validator;
        this.securityUtils = securityUtils;
    }

    @Override
    public Account openAccount(Long userId, AccountType type, BigDecimal initialDeposit) {
        validator.validateInitialDeposit(initialDeposit);

        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        Account account = new Account(null, generateAccountNumber(), type,
                scale(initialDeposit), LocalDate.now(), false, BigDecimal.ZERO.setScale(MONEY_SCALE), null, owner);

        return accountRepository.save(account);
    }

    @Override
    public Account deposit(Long accountId, BigDecimal amount, String remarks) {
        validator.validateAmount(amount);
        Account account = getAccount(accountId);

        account.setBalance(scale(account.getBalance().add(amount)));

        accountRepository.save(account);
        logTransaction(account, TransactionType.DEPOSIT, amount, remarks);
        return account;
    }

    @Override
    public Account withdraw(Long accountId, BigDecimal amount, String remarks) {
        validator.validateAmount(amount);
        Account account = getAccount(accountId);

        applyDebit(account, amount, remarks);
        logTransaction(account, TransactionType.WITHDRAW, amount, remarks);
        return account;
    }

    @Override
    public Account pay(Long accountId, BigDecimal amount, String remarks) {
        validator.validateAmount(amount);
        Account account = getAccount(accountId);

        applyDebit(account, amount, remarks);
        logTransaction(account, TransactionType.PAY, amount, remarks);
        return account;
    }

    @Override
    @Transactional
    public void transfer(Long fromAccountId, Long toAccountId, BigDecimal amount, String remarks) {
        validator.validateAmount(amount);
        validator.validateDifferentAccounts(fromAccountId, toAccountId);

        Account from = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new AccountNotFoundException("Sender account not found!"));
        verifyOwnership(from);

        Account to = accountRepository.findById(toAccountId)
                .orElseThrow(() -> new AccountNotFoundException("Recipient account not found!"));

        applyDebit(from, amount, remarks);
        to.setBalance(scale(to.getBalance().add(amount)));
        accountRepository.save(to);

        logTransaction(from, TransactionType.TRANSFER, amount, remarks);
        logTransaction(to, TransactionType.DEPOSIT, amount, "Received from " + from.getAccountNumber());
    }

    @Override
    public Account toggleRoundOff(Long accountId, boolean enabled) {
        Account account = getAccount(accountId);
        account.setRoundOffEnabled(enabled);
        return accountRepository.save(account);
    }

    @Override
    public Account withdrawFromPiggyBank(Long accountId, BigDecimal amount) {
        validator.validatePiggyBankAmount(amount);
        Account account = getAccount(accountId);
        validator.validateSufficientPiggyBank(account, amount);

        account.setPiggyBankBalance(scale(account.getPiggyBankBalance().subtract(amount)));
        account.setBalance(scale(account.getBalance().add(amount)));
        accountRepository.save(account);

        logTransaction(account, TransactionType.DEPOSIT, amount, "Piggy bank withdrawal");
        return account;
    }

    @Override
    public List<Account> getAccountsForUser(Long userId) {
        Long currentUserId = securityUtils.getCurrentUser().getId();
        if (!currentUserId.equals(userId)) {
            throw new UnauthorizedAccessException("You do not have access to this user's accounts");
        }
        return accountRepository.findByOwnerId(userId);
    }

    @Override
    public Account findAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("No account found with that account number."));
    }

    // ---- shared internal logic, used by withdraw/pay/transfer ----

    private void applyDebit(Account account, BigDecimal amount, String remarks) {
        BigDecimal contribution = account.isRoundOffEnabled()
                ? calculateSavingsContribution(amount)
                : BigDecimal.ZERO.setScale(MONEY_SCALE);

        BigDecimal totalDebit = scale(amount.add(contribution));

        validator.validateSufficientBalance(account, totalDebit);

        account.setBalance(scale(account.getBalance().subtract(totalDebit)));
        account.setPiggyBankBalance(scale(account.getPiggyBankBalance().add(contribution)));

        accountRepository.save(account);

        if (contribution.compareTo(BigDecimal.ZERO) > 0) {
            logTransaction(account, TransactionType.PIGGY_CONTRIBUTION, contribution,
                    "Savings contribution from: " + (remarks == null ? "" : remarks));
        }
    }

    private BigDecimal calculateSavingsContribution(BigDecimal amount) {
        BigDecimal contribution = scale(amount.multiply(SAVINGS_PERCENTAGE));
        return contribution.min(MAX_CONTRIBUTION);
    }

    private BigDecimal scale(BigDecimal value) {
        return value.setScale(MONEY_SCALE, RoundingMode.HALF_UP);
    }

    private void logTransaction(Account account, TransactionType type, BigDecimal amount, String remarks) {
        Transaction transaction = new Transaction(null, type, scale(amount),
                LocalDateTime.now(), account.getBalance(), remarks, account);
        transactionRepository.save(transaction);
    }

    private Account getAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found!"));
        verifyOwnership(account);
        return account;
    }

    private void verifyOwnership(Account account) {
        Long currentUserId = securityUtils.getCurrentUser().getId();
        if (!account.getOwner().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException("You do not have access to this account");
        }
    }

    private String generateAccountNumber() {
        return "BF" + System.currentTimeMillis();
    }
}