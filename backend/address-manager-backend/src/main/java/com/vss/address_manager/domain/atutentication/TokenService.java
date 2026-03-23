package com.vss.address_manager.domain.atutentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.vss.address_manager.domain.atutentication.dto.TokenDto;
import com.vss.address_manager.domain.user.User;
import com.vss.address_manager.domain.user.UserRepository;
import com.vss.address_manager.infra.exceptions.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    private UserRepository userRepository;

    @Value("${api.security.algorithm:#solutionsa}")
    private String algorithmHMAC;

    TokenService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public TokenDto updateTokens(String token){

        Long idUser = Long.valueOf(verifyToken(token));
        var user = userRepository.findById(idUser).orElseThrow();
        String accessToken = generateToken(user);
        String refreshToken = generateRefreshToken(user);

        return new TokenDto(accessToken, refreshToken);
    }

    public TokenDto createTokens(User user){
        String accessToken = generateToken(user);
        String refreshToken = generateRefreshToken(user);
        return new TokenDto(accessToken,refreshToken);
    }

    private String generateToken(User user){
        try {
            Algorithm algorithm = Algorithm.HMAC256(algorithmHMAC);
            return JWT.create()
                    .withIssuer("Manager Address")
                    .withSubject(user.getUsername())
                    .withExpiresAt(expiration(5))
                    .sign(algorithm);
        } catch (JWTCreationException exception){
            throw new BusinessException("Erro ao gerar token JWT de acesso!");
        }
    }

    private String generateRefreshToken(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(algorithmHMAC);
            return JWT.create()
                    .withIssuer("Manager Address")
                    .withSubject(user.getId().toString())
                    .withExpiresAt(expiration(120))
                    .sign(algorithm);
        } catch (JWTCreationException exception){
            throw new BusinessException("Erro ao gerar refresh token JWT de acesso!");
        }
    }

    private Instant expiration(Integer minutes) {
        return LocalDateTime.now().plusMinutes(minutes).toInstant(ZoneOffset.of("-03:00"));
    }

    public String verifyToken(String token){
        DecodedJWT decodedJWT;
        try {
            Algorithm algorithm = Algorithm.HMAC256(algorithmHMAC);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer("Manager Address")
                    .build();
            decodedJWT = verifier.verify(token);
            return decodedJWT.getSubject();
        } catch (JWTVerificationException exception){
            throw new BusinessException("Erro ao verificar token JWT de acesso!");
        }
    }
}
