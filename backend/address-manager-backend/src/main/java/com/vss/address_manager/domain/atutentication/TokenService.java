package com.vss.address_manager.domain.atutentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.vss.address_manager.domain.user.User;
import com.vss.address_manager.infra.exceptions.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.algorithm:#solutionsa}")
    private String algorithmHMAC;

    public String generateToken(User user){
        try {
            Algorithm algorithm = Algorithm.HMAC256(algorithmHMAC);
            return JWT.create()
                    .withIssuer("Manager Address")
                    .withSubject(user.getUsername())
                    .withExpiresAt(expiration(120))
                    .sign(algorithm);
        } catch (JWTCreationException exception){
            throw new BusinessException("Erro ao gerar token JWT de acesso!");
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
