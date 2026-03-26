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

    private String generateToken(User user) {
        return JWT.create()
                .withIssuer("Manager Address")
                .withSubject(user.getId().toString()) // Identidade única
                .withClaim("role", user.getAuthorities().toString()) // Opcional: para o front ler
                .withExpiresAt(expiration(60))
                .sign(Algorithm.HMAC256(algorithmHMAC));
    }

    private String generateRefreshToken(User user) {
        return JWT.create()
                .withIssuer("Manager Address")
                .withSubject(user.getId().toString()) // Mesma identidade
                .withClaim("purpose", "refresh") // Diferenciação de uso
                .withExpiresAt(expiration(120))
                .sign(Algorithm.HMAC256(algorithmHMAC));
    }

    private Instant expiration(Integer minutes) {
        return LocalDateTime.now().plusMinutes(minutes).toInstant(ZoneOffset.of("-03:00"));
    }

    public String verifyToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(algorithmHMAC);
            return JWT.require(algorithm)
                    .withIssuer("Manager Address")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            // IMPORTANTE: Logar o erro real ajuda a saber se expirou ou se a assinatura é inválida
            System.out.println("Erro na verificação do JWT: " + exception.getMessage());
            throw new BusinessException("Token inválido ou expirado");
        }
    }
}
