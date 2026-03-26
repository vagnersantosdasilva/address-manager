# 🌍 Address Manager - Frontend

Esta é a interface web do sistema de gerenciamento de endereços, construída com **React 19**, **TypeScript** e **Vite**. A aplicação oferece uma experiência de usuário fluida para gestão de perfis e localizações, com suporte a múltiplos níveis de acesso (Admin e Comum).

## 🚀 Tecnologias Principais

* **React + TypeScript**: Desenvolvimento robusto e tipado.
* **React Router Dom**: Gerenciamento de rotas complexas (Admin vs. User).
* **React Bootstrap**: Componentização e layout responsivo.
* **Axios**: Integração com API REST.
* **Bootstrap Icons**: Identidade visual consistente.

## ✨ Funcionalidades Implementadas

* **Autenticação JWT**: Fluxo de login com persistência segura.
* **Gestão de Endereços**: 
    * Listagem, criação, edição e exclusão.
    * Definição de endereço principal (`isMain`).
    * Busca automática de logradouro via CEP (Integração ViaCEP no Backend).
* **Perfil de Usuário**: 
    * Edição *inline* (PATCH) campo a campo.
    * Formatação dinâmica de datas.
* **Painel Administrativo**: Visualização e gerenciamento de endereços de terceiros.
* **UX**: Modais de confirmação customizados e feedbacks de carregamento.

## 🛠️ Instalação e Execução Local

### Pré-requisitos
* Node.js (v19 ou superior)
* Gerenciador de pacotes (NPM ou Yarn)

### Passos
1. Entre na pasta do frontend:
   ```bash
   cd frontend/address-manager-frontend 
   ```

2. Instale as dependências:
  ```bash
   npm install
  ```
3. Configure as variáveis de ambiente (crie um arquivo .env na raiz do projeto frontend):

```bash
   VITE_API_URL=http://localhost:8080
```

4. Inicie o servidor de desenvolvimento:

```bash
   npm run dev
```

5. Acesse: http://localhost:5173

