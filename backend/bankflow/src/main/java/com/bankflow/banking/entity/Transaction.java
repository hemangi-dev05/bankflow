package com.bankflow.banking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Column(precision = 19, scale = 2, nullable = false)
    private BigDecimal amount;

    private LocalDateTime date;

    @Column(precision = 19, scale = 2, nullable = false)
    private BigDecimal balanceAfter;

    private String remarks;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;
}