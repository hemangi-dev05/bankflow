package com.bankflow.banking.controller;

import com.bankflow.banking.dto.TransactionResponse;
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

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getFullHistory(@PathVariable Long accountId) {
        List<TransactionResponse> history = transactionService.getFullHistory(accountId).stream()
                .map(TransactionResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/mini-statement")
    public ResponseEntity<List<TransactionResponse>> getMiniStatement(@PathVariable Long accountId) {
        List<TransactionResponse> statement = transactionService.getMiniStatement(accountId).stream()
                .map(TransactionResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(statement);
    }
}
