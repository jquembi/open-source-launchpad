# 🤝 Ponte Solidária

**Uma ajuda pode mudar tudo.** Plataforma open source comunitária que liga pessoas que precisam de apoio a voluntários, doadores e organizações dispostos a ajudar.

[![Licença MIT](https://img.shields.io/badge/licença-MIT-21866c)](LICENSE)
[![Alojar na Hostinger](https://img.shields.io/badge/Alojar%20na-Hostinger-673DE6?style=for-the-badge)](https://www.hostinger.com/)

> **Transparência comercial:** o botão Hostinger acima é um link genérico e não permite instalação automática. Para usar afiliados, substitua-o pelo URL oficial atribuído ao titular. Poderão ser recebidas comissões por compras elegíveis, conforme os termos do programa.

## Problema social

Muitas pessoas têm dificuldades em encontrar apoio próximo, enquanto outras estão disponíveis para ajudar, mas não sabem onde existem necessidades.

A Ponte Solidária permite publicar **pedidos de ajuda** e **ofertas de apoio**, classificados por categoria, província e município. Todos os anúncios passam por moderação antes de serem divulgados.

## Funcionalidades do MVP

- Criar um pedido ou uma oferta de ajuda, com localização aproximada.
- Explorar publicações aprovadas por texto, categoria e tipo.
- Validar campos obrigatórios e consentimento para contacto.
- Guardar dados numa base Cloudflare D1.
- Administrador revê pedidos em `/admin.html`, podendo aprovar, rejeitar ou encerrar.
- Os contactos **não aparecem na página pública**. Um responsável autorizado faz a ligação entre as partes fora da aplicação.
- Frontend responsivo em português.

## Stack

Frontend: HTML, CSS, JavaScript. API: Cloudflare Workers. Base de dados: Cloudflare D1 (SQLite).

## Configurar e executar

Este repositório contém a aplicação e os serviços necessários, mas **não está automaticamente publicado**. Para criar, moderar e consultar publicações reais, é necessário configurar o Cloudflare D1 e publicar o Worker.

Consulte o [guia de implantação](docs/DEPLOY.md).

```bash
npm install
npx wrangler login
npx wrangler d1 create ponte-solidaria-db
# Coloca o database_id em wrangler.toml
npx wrangler d1 execute ponte-solidaria-db --remote --file=worker/schema.sql
npx wrangler secret put ADMIN_TOKEN
npx wrangler deploy
```

Também se pode abrir `index.html` num servidor estático para examinar a interface, mas as operações de publicação não funcionarão sem a API e a base de dados.

## Segurança e privacidade

O MVP requer reforços antes de receber tráfego público: proteção anti-spam e contra abuso, limitação de pedidos, políticas de retenção e eliminação de dados, procedimento de incidentes, política de privacidade, supervisão de moderação e procedimentos de salvaguarda de utilizadores vulneráveis. Não publicar moradas exatas, dados médicos, documentos ou dados de menores.

O painel atual usa **um segredo administrativo partilhado**, destinado a uma equipa pequena e ambiente controlado; não substitui autenticação de moderadores individualizada.

## Contribuir

Contribuições de acessibilidade, testes, traduções, segurança e integração com organizações sociais são bem-vindas. Abra um issue ou pull request.

## Hostinger

O projeto mantém um botão de alojamento no rodapé, configurável em `assets/config.js`, e neste README. Não o confunda com instalação automática: a versão funcional com API precisa de Cloudflare Workers/D1 ou de uma adaptação do backend para outro fornecedor.

## Licença

MIT — [LICENSE](LICENSE). Projeto independente; não é uma organização de emergência nem um serviço oficial da Hostinger.
