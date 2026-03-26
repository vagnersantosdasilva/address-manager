package com.vss.address_manager.infra.security;

import com.vss.address_manager.domain.atutentication.TokenService;
import com.vss.address_manager.domain.user.User;
import com.vss.address_manager.domain.user.UserRepository;
import com.vss.address_manager.infra.exceptions.BusinessException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AccessTokenFilter extends OncePerRequestFilter {
    private final TokenService tokenService;
    private final UserRepository userRepository;

    public AccessTokenFilter(TokenService tokenService, UserRepository userRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //recuperar o token da requisição
        String token = recoverRequestToken(request);

        if(token != null){

            String idUsuarioStr = tokenService.verifyToken(token);
            Long idUsuario = Long.parseLong(idUsuarioStr);

            // IMPORTANTE: Buscar por ID no repositório
            var usuario = userRepository.findById(idUsuario)
                    .orElseThrow(() -> new BusinessException("Usuário não encontrado com o ID do Token"));

            // Coloca o usuário no contexto do Spring
            var authentication = new UsernamePasswordAuthenticationToken(
                    usuario,
                    null,
                    usuario.getAuthorities()
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            /*

            String cpf = tokenService.verifyToken(token);
            User user = userRepository.findByCpf(cpf).orElseThrow();

            Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);*/
        }

        filterChain.doFilter(request, response);
    }

    private String recoverRequestToken(HttpServletRequest request) {
        var authorizationHeader = request.getHeader("Authorization");
        if(authorizationHeader != null){
            return authorizationHeader.replace("Bearer ", "");
        }
        return null;
    }
}
