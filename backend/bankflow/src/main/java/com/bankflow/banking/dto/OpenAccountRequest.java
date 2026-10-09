package com.bankflow.banking.dto;

import com.bankflow.banking.entity.AccountType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpenAccountRequest {

    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    private BigDecimal initialDeposit;
}