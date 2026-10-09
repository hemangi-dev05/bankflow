package com.bankflow.banking.dto;

import com.bankflow.banking.entity.Account;
import com.bankflow.banking.entity.AccountType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class AccountResponse {
    private Long id;
    private String accountNumber;
    private AccountType accountType;
    private BigDecimal balance;
    private LocalDate openedDate;
    private boolean roundOffEnabled;
    private BigDecimal piggyBankBalance;
    private BigDecimal contributionRate;

    public static AccountResponse fromEntity(Account account, BigDecimal contributionRate) {
        return new AccountResponse(
                account.getId(),
                account.getAccountNumber(),
                account.getAccountType(),
                account.getBalance(),
                account.getOpenedDate(),
                account.isRoundOffEnabled(),
                account.getPiggyBankBalance(),
                contributionRate
        );
    }
}