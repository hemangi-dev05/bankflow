package com.bankflow.banking.dto;

import com.bankflow.banking.entity.Account;
import com.bankflow.banking.entity.AccountType;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Minimal, non-sensitive identity info returned when a user looks up a
 * transfer recipient by account number. Deliberately excludes balance,
 * piggy bank, and any other financial detail — this endpoint only exists
 * so the sender can confirm "who am I sending this to" before a transfer.
 */
@Data
@AllArgsConstructor
public class AccountLookupResponse {
    private Long id;
    private String accountNumber;
    private AccountType accountType;
    private String ownerName;

    public static AccountLookupResponse fromEntity(Account account) {
        return new AccountLookupResponse(
                account.getId(),
                account.getAccountNumber(),
                account.getAccountType(),
                account.getOwner() != null ? account.getOwner().getName() : null
        );
    }
}