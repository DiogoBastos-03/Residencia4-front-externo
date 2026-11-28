# Contrato das rotas de autenticação

Base path: `/api/v1/auth` · Content-Type: `application/json` · JSON em camelCase.

| Método | Rota | Auth | Rate limit | Sucesso |
|---|---|---|---|---|
| POST | [`/login`](#post-login) | — | `auth-sensitive` | 200 |
| POST | [`/refresh`](#post-refresh) | — | `auth-sensitive` | 200 |
| POST | [`/change-password-first-access`](#post-change-password-first-access) | Bearer | — | 204 |
| POST | [`/forgot-password`](#post-forgot-password) | — | `auth-sensitive` | 204 |
| POST | [`/validate-code`](#post-validate-code) | — | `auth-sensitive` | 200 |
| POST | [`/reset-password`](#post-reset-password) | — | `auth-sensitive` | 204 |

---

## Convenções

### Formato de erro

Todo erro é um `ProblemDetails` (RFC 9457) com o código de negócio em `code`:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.2",
  "title": "CNPJ ou senha inválidos.",
  "status": 401,
  "code": "INVALID_CREDENTIALS",
  "traceId": "00-..."
}
```

O front deve decidir pelo `code`, não pelo `title` (o texto pode mudar).

### Erros comuns a todas as rotas

| Status | `code` | Quando |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Falha de validação do body (campo obrigatório ausente, tamanho, formato). Vem com `errors: { "<Campo>": ["mensagem"] }`. |
| 429 | `TOO_MANY_REQUESTS` | Rate limit excedido. Header `Retry-After` em segundos. |
| 500 | `INTERNAL_ERROR` | Erro não tratado. |

Exemplo de `VALIDATION_ERROR`:

```json
{
  "title": "Um ou mais campos da requisição são inválidos.",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "errors": {
    "Cnpj": ["O CNPJ deve ter entre 14 e 18 caracteres."]
  }
}
```

### Rate limit `auth-sensitive`

Janela fixa por IP do cliente: **10 requisições / 60 s** (padrão, configurável em `RateLimiting:AuthSensitive`). O contador é compartilhado entre todas as rotas com essa policy.

### CNPJ

Aceita com ou sem máscara (`12.345.678/0001-95` ou `12345678000195`), entre 14 e 18 caracteres. Os dígitos verificadores são validados no use case; CNPJ inválido não gera erro de validação próprio, e sim o erro genérico da rota (para não revelar se o cadastro existe).

### Política de senha (`WEAK_PASSWORD`, 422)

- mínimo 8 caracteres, máximo 72 **bytes** UTF-8;
- ao menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial (espaço não conta como especial);
- espaços no início/fim **não** são removidos.

O `title` informa a regra violada.

### Tokens

| Token | Uso | Validade padrão |
|---|---|---|
| `accessToken` | Header `Authorization: Bearer <token>` | 15 min (`Jwt:AccessTokenExpirationMinutes`) |
| `refreshToken` | Body de `/refresh` | 7 dias (`Jwt:RefreshTokenExpirationDays`) |

Um refresh token não é aceito como Bearer. Requisição a rota protegida sem token válido → `401 UNAUTHENTICATED` com header `WWW-Authenticate: Bearer`.

---

## POST /login

Autentica a empresa por CNPJ e senha.

**Request**

```json
{
  "cnpj": "12.345.678/0001-95",
  "password": "Senha@123"
}
```

| Campo | Tipo | Regras |
|---|---|---|
| `cnpj` | string | obrigatório, 14–18 caracteres |
| `password` | string | obrigatório |

**200 OK**

```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "accessTokenExpiresAt": "2026-11-26T15:30:00Z",
  "passwordIsProvisional": true
}
```

Se `passwordIsProvisional` for `true`, o front deve levar o usuário para [`/change-password-first-access`](#post-change-password-first-access).

**Erros**

| Status | `code` | Quando |
|---|---|---|
| 401 | `INVALID_CREDENTIALS` | CNPJ inválido, inexistente, sem credencial ou senha errada (mesma resposta para todos os casos) |
| 403 | `ENTERPRISE_INACTIVE` | Credenciais corretas, mas empresa inativa |

---

## POST /refresh

Troca um refresh token válido por um novo par de tokens.

**Request**

```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

| Campo | Tipo | Regras |
|---|---|---|
| `refreshToken` | string | obrigatório |

**200 OK**

```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "accessTokenExpiresAt": "2026-11-26T15:45:00Z"
}
```

**Erros**

| Status | `code` | Quando |
|---|---|---|
| 401 | `INVALID_REFRESH_TOKEN` | Token inválido/expirado, empresa inexistente ou sem credencial → refazer login |
| 403 | `ENTERPRISE_INACTIVE` | Empresa inativa |

---

## POST /change-password-first-access

Troca a senha provisória no primeiro acesso. Requer `Authorization: Bearer <accessToken>`.

**Request**

```json
{
  "currentPassword": "Provisoria@1",
  "newPassword": "NovaSenha@123",
  "newPasswordConfirmation": "NovaSenha@123"
}
```

| Campo | Tipo | Regras |
|---|---|---|
| `currentPassword` | string | obrigatório |
| `newPassword` | string | obrigatório; [política de senha](#política-de-senha-weak_password-422) |
| `newPasswordConfirmation` | string | obrigatório; igual a `newPassword` (senão `400 VALIDATION_ERROR`) |

**204 No Content**

**Erros**

| Status | `code` | Quando |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Campos ausentes ou confirmação diferente da nova senha |
| 401 | `UNAUTHENTICATED` | Sem Bearer ou token inválido |
| 401 | `INVALID_CREDENTIALS` | Senha atual incorreta ou credencial não encontrada |
| 403 | `ENTERPRISE_INACTIVE` | Empresa inativa |
| 409 | `PASSWORD_NOT_PROVISIONAL` | A senha provisória já foi alterada |
| 422 | `NEW_PASSWORD_MUST_DIFFER` | Nova senha igual à atual |
| 422 | `WEAK_PASSWORD` | Nova senha fora da política |

---

## Fluxo de recuperação de senha

```
forgot-password (cnpj) ──► e-mail com código de 6 dígitos
validate-code (cnpj, code) ──► resetToken
reset-password (resetToken, newPassword, newPasswordConfirmation) ──► senha alterada
```

| Parâmetro (`PasswordReset:*`) | Padrão |
|---|---|
| Validade do código | 15 min |
| Tentativas por código | 5 |
| Intervalo mínimo entre envios para o mesmo CNPJ | 60 s |
| Validade do `resetToken` | 10 min |

## POST /forgot-password

Solicita o envio do código de redefinição para o e-mail cadastrado da empresa.

**Sempre responde 204**, exista ou não o CNPJ, esteja a empresa ativa ou não, e mesmo dentro do intervalo de reenvio (RF04: a resposta não pode revelar se o login existe). Nesses casos nenhum e-mail é enviado.

**Request**

```json
{
  "cnpj": "12.345.678/0001-95"
}
```

| Campo | Tipo | Regras |
|---|---|---|
| `cnpj` | string | obrigatório, 14–18 caracteres |

**204 No Content**

**Erros**: apenas os [comuns](#erros-comuns-a-todas-as-rotas) (`400 VALIDATION_ERROR`, `429`).

---

## POST /validate-code

Troca o código recebido por e-mail por um `resetToken` de uso único. O código é consumido em caso de sucesso.

**Request**

```json
{
  "cnpj": "12.345.678/0001-95",
  "code": "482913"
}
```

| Campo | Tipo | Regras |
|---|---|---|
| `cnpj` | string | obrigatório, 14–18 caracteres |
| `code` | string | obrigatório, exatamente 6 dígitos (`^\d{6}$`) |

**200 OK**

```json
{
  "resetToken": "q8Zk...",
  "expiresInSeconds": 600
}
```

**Erros**

| Status | `code` | Quando |
|---|---|---|
| 400 | `INVALID_CODE` | CNPJ inválido/inexistente, código errado, expirado ou com tentativas esgotadas (mesma resposta para todos) |

---

## POST /reset-password

Define a nova senha usando o `resetToken`. A senha é validada **antes** de consumir o token, então um erro de senha não obriga a pedir outro código.

**Request**

```json
{
  "resetToken": "q8Zk...",
  "newPassword": "NovaSenha@123",
  "newPasswordConfirmation": "NovaSenha@123"
}
```

| Campo | Tipo | Regras |
|---|---|---|
| `resetToken` | string | obrigatório |
| `newPassword` | string | obrigatório; [política de senha](#política-de-senha-weak_password-422) |
| `newPasswordConfirmation` | string | obrigatório; igual a `newPassword` (checado no use case → 422) |

**204 No Content**

**Erros**

| Status | `code` | Quando |
|---|---|---|
| 400 | `INVALID_RESET_TOKEN` | Token inválido, expirado ou já usado → solicitar novo código |
| 403 | `ENTERPRISE_INACTIVE` | Empresa inativa (o token já foi consumido) |
| 404 | `CREDENTIAL_NOT_FOUND` | Empresa sem credencial cadastrada |
| 422 | `PASSWORD_CONFIRMATION_MISMATCH` | Confirmação diferente da nova senha (token **não** consumido) |
| 422 | `WEAK_PASSWORD` | Nova senha fora da política (token **não** consumido) |
