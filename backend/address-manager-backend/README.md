# ⚙️ Address Manager - API Backend

API REST para o ecossistema Address Manager, desenvolvida com **Java 17** e **Spring Boot 4.0.3**. A aplicação utiliza uma arquitetura com segurança JWT, migrações de banco de dados automatizadas e integração com serviços externos.

## 🚀 Tecnologias e Dependências

* **Spring Boot 4.0.3**: Framework principal.
* **Spring Security + Auth0 Java JWT (4.4.0)**: Autenticação robusta e autorização baseada em Roles.
* **Spring Data JPA**: Camada de persistência de dados.
* **MySQL Connector**: Driver para banco de dados MySQL 8.
* **Flyway Migration**: Controle de versão do esquema do banco de dados (MySQL).
* **Spring Validation**: Validação de Beans (Constraints de CPF, Email, etc).
* **Lombok**: Redução de código boilerplate.

## 🏗️ Diferenciais Técnicos

* **Flyway Versioning**: O banco de dados é versionado automaticamente ao subir a aplicação, garantindo consistência entre ambientes.
* **Integração ViaCEP**: Consumo da API externa `https://viacep.com.br/ws/` para preenchimento automático de endereços.
* **Seed de Administrador**: O sistema suporta a criação de um usuário administrador padrão via variáveis de ambiente.
* **Logging de Segurança**: Configurado em nível `DEBUG` para facilitar a rastreabilidade de filtros do Spring Security durante o desenvolvimento.

## 📋 Configuração (Variáveis de Ambiente)

Para rodar o projeto, as seguintes variáveis de ambiente devem ser configuradas (ou passadas via Docker):

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `BD_USER` | Usuário do MySQL | `root` |
| `BD_SECRET` | Senha do MySQL | `senha123` |
| `ALG_SECRET` | Chave secreta para assinatura do JWT | `minha_chave_secreta` |
| `ADM_CPF_DEFAULT` | CPF do Admin padrão criado no startup | `00000000000` |
| `ADM_PASSWORD_DEFAULT` | Senha do Admin padrão | `admin123` |
| `SERVICE_ZIPCODE_URL` | URL da API de CEP (Opcional) | `https://viacep.com.br/ws/` |

## 🛠️ Execução Local

### Passo 1: Preparar o Banco
Certifique-se de que um banco de dados chamado `address_manager` existe no seu MySQL local.

### Passo 2: Rodar o Maven
```bash
mvn clean install
mvn spring-boot:run