package com.bankflow.banking.service;

import com.bankflow.banking.entity.Transaction;

import java.util.List;

public interface TransactionService {
    List<Transaction> getFullHistory(Long accountId);
    List<Transaction> getMiniStatement(Long accountId);
}
