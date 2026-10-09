package com.bankflow.banking.controller;

import com.bankflow.banking.dto.*;
import com.bankflow.banking.entity.Account;
import com.bankflow.banking.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public ResponseEntity<AccountResponse> openAccount(@Valid @RequestBody OpenAccountRequest request) {
        Account account = accountService.openAccount(
                request.getUserId(), request.getAccountType(), request.getInitialDeposit());
        return new ResponseEntity<>(toResponse(account), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AccountResponse>> getAccountsForUser(@PathVariable Long userId) {
        List<AccountResponse> accounts = accountService.getAccountsForUser(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(accounts);
    }

    // Resolves a transfer recipient by their account number so the sender can
    // confirm a name before money moves, instead of typing a raw internal ID.
    @GetMapping("/lookup")
    public ResponseEntity<AccountLookupResponse> lookupByAccountNumber(@RequestParam String accountNumber) {
        Account account = accountService.findAccountByNumber(accountNumber);
        return ResponseEntity.ok(AccountLookupResponse.fromEntity(account));
    }

    @PutMapping("/{id}/deposit")
    public ResponseEntity<AccountResponse> deposit(@PathVariable Long id, @Valid @RequestBody AmountRequest request) {
        Account account = accountService.deposit(id, request.getAmount(), request.getRemarks());
        return ResponseEntity.ok(toResponse(account));
    }

    @PutMapping("/{id}/withdraw")
    public ResponseEntity<AccountResponse> withdraw(@PathVariable Long id, @Valid @RequestBody AmountRequest request) {
        Account account = accountService.withdraw(id, request.getAmount(), request.getRemarks());
        return ResponseEntity.ok(toResponse(account));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<AccountResponse> pay(@PathVariable Long id, @Valid @RequestBody AmountRequest request) {
        Account account = accountService.pay(id, request.getAmount(), request.getRemarks());
        return ResponseEntity.ok(toResponse(account));
    }

    @PostMapping("/{id}/transfer")
    public ResponseEntity<String> transfer(@PathVariable Long id, @Valid @RequestBody TransferRequest request) {
        accountService.transfer(id, request.getToAccountId(), request.getAmount(), request.getRemarks());
        return ResponseEntity.ok("Transfer successful!");
    }

    @PutMapping("/{id}/round-off")
    public ResponseEntity<AccountResponse> toggleRoundOff(@PathVariable Long id,
                                                            @RequestBody ToggleRoundOffRequest request) {
        Account account = accountService.toggleRoundOff(id, request.isEnabled());
        return ResponseEntity.ok(toResponse(account));
    }

    @PutMapping("/{id}/piggy-bank/withdraw")
    public ResponseEntity<AccountResponse> withdrawFromPiggyBank(@PathVariable Long id,
                                                                   @Valid @RequestBody AmountRequest request) {
        Account account = accountService.withdrawFromPiggyBank(id, request.getAmount());
        return ResponseEntity.ok(toResponse(account));
    }

    private AccountResponse toResponse(Account account) {
        BigDecimal rate = account.isRoundOffEnabled() ? AccountService.SAVINGS_PERCENTAGE : BigDecimal.ZERO;
        return AccountResponse.fromEntity(account, rate);
    }
}