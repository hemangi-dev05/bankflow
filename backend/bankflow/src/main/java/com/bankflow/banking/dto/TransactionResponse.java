package com.bankflow.banking.dto;

import com.bankflow.banking.entity.Transaction;
import com.bankflow.banking.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private TransactionType type;
    private BigDecimal amount;
    private LocalDateTime date;
    private BigDecimal balanceAfter;
    private String remarks;

    public static TransactionResponse fromEntity(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getDate(),
                transaction.getBalanceAfter(),
                transaction.getRemarks()
        );
    }
}