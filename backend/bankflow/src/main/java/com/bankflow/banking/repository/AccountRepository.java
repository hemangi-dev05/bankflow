package com.bankflow.banking.repository;

import com.bankflow.banking.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByOwnerId(Long userId);

    Optional<Account> findByAccountNumber(String accountNumber);
}