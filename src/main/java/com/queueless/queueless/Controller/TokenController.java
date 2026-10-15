
package com.queueless.queueless.controller;

import com.queueless.queueless.entity.Token;
import com.queueless.queueless.repository.TokenRepository;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tokens")
@CrossOrigin(origins = "*")
public class TokenController {

    private final TokenRepository repository;

    public TokenController(TokenRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Token> getAllTokens() {
        return repository.findAll();
    }

    @PostMapping
    public Token bookToken(@RequestBody Token token) {
        token.setStatus("WAITING");
        return repository.save(token);
    }

    @PutMapping("/{id}/complete")
    public Token completeToken(@PathVariable Long id) {
        Token token = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        token.setStatus("COMPLETED");
        return repository.save(token);
    }

    @DeleteMapping("/{id}")
    public void deleteToken(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
