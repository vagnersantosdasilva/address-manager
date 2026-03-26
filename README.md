# 🚀 Address Manager - Fullstack Project

Este repositório contém a solução para o sistema **Address Manager**, um ecossistema para gerenciamento de usuários e endereços, composto por uma API em **Spring Boot 4** e uma interface em **React + Vite**.

## 🐳 Como Executar (Docker Compose)

### 1. Pré-requisitos
* [Docker](https://www.docker.com/products/docker-desktop/) instalado e rodando.
* Portas `80`, `8080` e `3307` livres no seu computador.

### 2. Configuração das Variáveis de Ambiente
Na raiz do repositório, crie um arquivo chamado `.env` (o Docker Compose o lerá automaticamente). Utilize o modelo abaixo:

```env
# Banco de Dados
BD_SECRET="sua_senha_mysql"

# Segurança JWT
ALG_SECRET="sua_chave_secreta_para_assinatura_jwt"

# Credenciais do Administrador Padrão (Criado no Startup)
ADM_CPF_DEFAULT="00000000000"
ADM_PASSWORD_DEFAULT="sua_senha_admin"
```

-----

### 3\. Inicialização

Abra o terminal na raiz do repositório e execute o comando:

```bash
docker-compose up --build
```

Após o build e a inicialização dos containers, acesse:

  * **Frontend:** [http://localhost](https://www.google.com/search?q=http://localhost)
  * **Backend API:** [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080)
  * **Banco de Dados:** Localhost na porta `3307` (Mapeada para não conflitar com MySQL local na 3306).

-----

## 🏗️ Arquitetura e Tecnologias

### Frontend

  * **React 19 + TypeScript**
  * **Vite**
  * **React Bootstrap**
  * **Nginx**

### Backend

  * **Java 17 + Spring Boot 4.0.3**
  * **Spring Security + JWT**
  * **Flyway Migration**
  * **Amazon Corretto**

-----

## 🚀 Próximos Passos & Melhorias (Backlog)

Pontos de evolução para tornar o sistema mais resiliente e amigável:

### 🔐 Regras de Negócio e Segurança

  * **Proteção de Autogestão Admin:** Implementar trava para impedir que um `ADMIN` altere seu próprio nível de acesso para `COMMON` ou exclua a própria conta, garantindo que o sistema nunca fique sem um administrador ativo.
  * **Refresh Token:** Adicionar fluxo de renovação de tokens para manter a sessão do usuário segura por mais tempo sem logins repetitivos.

### 🎨 Experiência do Usuário (UX)

  * **Máscaras de Entrada:** Implementar máscaras dinâmicas para campos de CPF e CEP, facilitando a digitação e padronização.
  * **Toasts de Notificação:** Substituir modais e alertas por notificações flutuantes (Toasts) para feedbacks de sucesso e erro.

### 🏗️ Infraestrutura

  * **Documentação Swagger:** Integrar SpringDoc OpenAPI para gerar documentação interativa dos endpoints.
  * **Testes Automatizados:** Corrigir a compatibilidade de tipos nos testes unitários do backend para integração total no pipeline de CI/CD.

-----

## 📂 Organização das Pastas

  * `/backend/address-manager-backend`: Código fonte da API Java.
  * `/frontend/address-manager-frontend`: Código fonte da SPA React.
  * `docker-compose.yml`: Arquivo de orquestração dos serviços.
  * `.env`: Configurações sensíveis (não versionar em produção).

-----

