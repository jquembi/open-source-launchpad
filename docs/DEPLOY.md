# Publicação da Ponte Solidária no Cloudflare

## Pré-requisitos
- Conta Cloudflare com Workers e D1.
- Node.js 20+.
- Wrangler instalado via npx.
- Permissões para configurar segredos e DNS.

## Passos
1. Execute `npx wrangler login`.
2. Execute `npx wrangler d1 create ponte-solidaria-db`.
3. Copie o `database_id` devolvido para `wrangler.toml`, substituindo `REPLACE_WITH_D1_DATABASE_ID`.
4. Execute `npx wrangler d1 execute ponte-solidaria-db --remote --file=worker/schema.sql`.
5. Defina um segredo forte: `npx wrangler secret put ADMIN_TOKEN`. **Nunca inclua este token no repositório.**
6. Execute `npx wrangler deploy`.
7. Abra o endereço público indicado pelo Wrangler. Para moderar, visite `/admin.html` e introduza o token.

## Segurança e operação
- Os contactos são armazenados em D1 e visíveis **apenas a administradores autenticados pelo token**; nunca são incluídos no catálogo público.
- Pedidos e ofertas permanecem pendentes de moderação.
- A interface pública não permite mensagens diretas. O administrador deve fazer a ligação entre as partes fora da plataforma, respeitando o consentimento recolhido.
- Antes de divulgar ao público, configure rate limiting, proteção contra bots, backups, retenção/eliminação de dados e uma política de privacidade adaptada à legislação aplicável.
- O MVP não possui autenticação individual, histórico de conversas, verificação de identidade nem mecanismo automático de contacto.
- Não trate o painel por token como IAM de múltiplos moderadores.
- O Docker disponibiliza **apenas a interface estática**. Para criar e moderar publicações, use o Worker com D1.

## Afiliados
Pode usar o URL oficial de afiliado Hostinger em `assets/config.js` e no README, sujeito aos termos comerciais da Hostinger. Esse botão não representa instalação automática.
