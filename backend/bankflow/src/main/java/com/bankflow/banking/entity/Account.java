package com.bankflow.banking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @Column(precision = 19, scale = 2, nullable = false)
    private BigDecimal balance;

    private LocalDate openedDate;

    private boolean roundOffEnabled;

    @Column(precision = 19, scale = 2, nullable = false)
    private BigDecimal piggyBankBalance;

    @Version
    private Long version;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
}