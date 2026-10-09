package com.bankflow.banking.controller;

import com.bankflow.banking.dto.TransactionResponse;
import com.bankflow.banking.entity.Account;
import com.bankflow.banking.exception.AccountNotFoundException;
import com.bankflow.banking.exception.UnauthorizedAccessException;
import com.bankflow.banking.repository.AccountRepository;
import com.bankflow.banking.security.SecurityUtils;
import com.bankflow.banking.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts/{accountId}/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final AccountRepository accountRepository;
    private final SecurityUtils securityUtils;

    public TransactionController(TransactionService transactionService,
                                 AccountRepository accountRepository,
                                 SecurityUtils securityUtils) {
        this.transactionService = transactionService;
        this.accountRepository = accountRepository;
        this.securityUtils = securityUtils;
    }

    private void verifyOwnership(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));
        if (!account.getOwner().getId().equals(securityUtils.getCurrentUser().getId())) {
            throw new UnauthorizedAccessException("You do not have access to this account");
        }
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getFullHistory(@PathVariable Long accountId) {
        verifyOwnership(accountId);
        List<TransactionResponse> history = transactionService.getFullHistory(accountId).stream()
                .map(TransactionResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/mini-statement")
    public ResponseEntity<List<TransactionResponse>> getMiniStatement(@PathVariable Long accountId) {
        verifyOwnership(accountId);
        List<TransactionResponse> statement = transactionService.getMiniStatement(accountId).stream()
                .map(TransactionResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(statement);
    }
}
