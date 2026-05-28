# Edge Function — PerfectPay Webhook

Recebe a notificação de venda da **PerfectPay**, cria o usuário no Supabase
Auth e envia automaticamente um **e-mail de convite** com link mágico para
o lead definir senha e entrar na **Vértice Carreiras**.

Apenas o e-mail usado na compra recebe acesso — não há cadastro público.

---

## 1) Deploy

```bash
# autenticar (uma vez)
supabase login
supabase link --project-ref fpwpqfyhukcwckhyudpb

# deploy da função
supabase functions deploy perfectpay-webhook --no-verify-jwt
```

> `--no-verify-jwt` é obrigatório: a PerfectPay não envia JWT do Supabase;
> a autenticação é feita pelo `token` no corpo do POST.

## 2) Secrets

```bash
supabase secrets set PERFECTPAY_WEBHOOK_TOKEN="<token_definido_na_perfectpay>"
supabase secrets set SITE_URL="https://verticecarreiras.com.br"
```

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são injetados automaticamente.

## 3) Configurar na PerfectPay

No painel da PerfectPay → **Integrações → Webhooks (Postback)**:

- **URL:**
  `https://fpwpqfyhukcwckhyudpb.supabase.co/functions/v1/perfectpay-webhook`
- **Token:** o mesmo valor de `PERFECTPAY_WEBHOOK_TOKEN`
- **Eventos:** Venda Aprovada / Venda Completa

## 4) Configurar template do e-mail (Supabase Dashboard)

Em **Authentication → Email Templates → Invite user**, ajuste:

- **Assunto:** `Seu acesso à Vértice Carreiras foi liberado`
- **Corpo:** mensagem premium com o link `{{ .ConfirmationURL }}`,
  reforçando o Selo de Garantia e o prazo de 2 dias úteis.

Em **Authentication → URL Configuration**:

- **Site URL:** `https://verticecarreiras.com.br`
- **Redirect URLs:** adicionar `https://verticecarreiras.com.br/dashboard`

## 5) Acesso restrito ao e-mail da compra

- O formulário de login NÃO tem cadastro público.
- `signInWithOtp` usa `shouldCreateUser: false` → e-mails sem compra
  recebem mensagem clara de "acesso liberado apenas para o e-mail da
  aquisição".
- Em **Authentication → Providers → Email**, desabilite **"Enable Signups"**
  no Supabase Dashboard para reforçar via servidor.

## 6) Testar localmente

```bash
supabase functions serve perfectpay-webhook --no-verify-jwt --env-file .env.local

curl -X POST http://localhost:54321/functions/v1/perfectpay-webhook \
  -H "content-type: application/json" \
  -d '{
    "token": "SEU_TOKEN",
    "sale_status_enum": 2,
    "code": "PP-TESTE-001",
    "customer": {
      "email": "teste@cliente.com",
      "full_name": "Cliente Teste"
    }
  }'
```

## 7) Aposentar o endpoint Next.js antigo

Após o webhook PerfectPay estar apontando para a Edge Function, remova
ou marque como deprecado `src/app/api/webhooks/perfectpay/route.ts`.
