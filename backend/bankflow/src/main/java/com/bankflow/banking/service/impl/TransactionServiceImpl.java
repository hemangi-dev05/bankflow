package com.bankflow.banking.service.impl;

import com.bankflow.banking.entity.Transaction;
import com.bankflow.banking.repository.TransactionRepository;
import com.bankflow.banking.service.TransactionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    private static final int MINI_STATEMENT_SIZE = 5;

    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public List<Transaction> getFullHistory(Long accountId) {
        return transactionRepository.findByAccountIdOrderByDateDesc(accountId);
    }

    @Override
    public List<Transaction> getMiniStatement(Long accountId) {
        List<Transaction> fullHistory = getFullHistory(accountId);
        int limit = Math.min(MINI_STATEMENT_SIZE, fullHistory.size());
        return fullHistory.subList(0, limit);
    }
}
