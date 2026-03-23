package com.vss.address_manager.controller;

import com.vss.address_manager.domain.atutentication.TokenService;
import com.vss.address_manager.domain.atutentication.dto.LoginDto;
import com.vss.address_manager.domain.atutentication.dto.RefreshTokenDto;
import com.vss.address_manager.domain.atutentication.dto.TokenDto;
import com.vss.address_manager.domain.user.User;
import com.vss.address_manager.domain.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AutenticationController {

    private TokenService tokenService;
    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;

    @Autowired
    AutenticationController(TokenService tokenService , AuthenticationManager authenticationManager, UserRepository userRepository){
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDto> efetuarLogin(@Valid @RequestBody LoginDto loginDto){
        var autenticationToken = new UsernamePasswordAuthenticationToken(loginDto.cpf(), loginDto.password());
        var authentication = authenticationManager.authenticate(autenticationToken);
        return ResponseEntity.ok(tokenService.createTokens((User) authentication.getPrincipal()));
    }

    @PostMapping("/update-token")
    public ResponseEntity<TokenDto> updateToken(@Valid @RequestBody RefreshTokenDto token){
        return ResponseEntity.ok().body(tokenService.updateTokens(token.refreshToken()));
    }
}
