# OpenSource Launchpad

Catálogo moderno, responsivo e open source para apresentar aplicações públicas, divulgar código e direcionar utilizadores para alojamento.

[![Executar na Hostinger](https://img.shields.io/badge/Executar%20na-Hostinger-673DE6?style=for-the-badge&logo=hostinger&logoColor=white)](https://www.hostinger.com/)

> **Importante:** este botão abre o site da Hostinger e **não executa uma instalação automática nem garante comissões**. Substitui o link pelo teu URL de afiliado oficial e utiliza um mecanismo aprovado para verdadeira instalação num clique.

## Funcionalidades
- Catálogo responsivo em português, com pesquisa e filtros.
- Projetos definidos em `assets/projects.js`.
- URL comercial configurável em `assets/config.js`.
- Nginx e Docker Compose para implantação em VPS.
- Validação automatizada e licença MIT para este repositório.

## Executar localmente

```bash
python3 -m http.server 8080
```

Visita http://localhost:8080.

## Executar com Docker

```bash
docker compose up --build -d
```

Abre http://localhost:8080. Em produção configura HTTPS, domínio e firewall.

## Adicionar projetos

Edita `assets/projects.js` e adiciona aplicações ao array `window.LAUNCHPAD_PROJECTS`:

```js
window.LAUNCHPAD_PROJECTS = [
  {
    name: 'Minha aplicação',
    description: 'Aplicação de exemplo',
    category: 'Web',
    stack: ['React', 'TypeScript'],
    url: 'https://github.com/UTILIZADOR/REPOSITORIO',
    license: 'MIT',
    icon: '◈',
    color: 'purple'
  }
];
```

Confirma que cada repositório é público e tem uma licença de software livre válida antes de o anunciar como open source.

## Programa de afiliados Hostinger

1. Obtém o link oficial no teu painel de afiliado/parceiro Hostinger.
2. Preenche `hostingerAffiliateUrl` em `assets/config.js`.
3. Substitui o link do badge neste README pelo teu link de afiliado.
4. Divulga claramente: **Este projeto pode conter links de afiliado. Posso receber uma comissão por compras qualificadas.**
5. Consulta as condições da Hostinger antes de afirmar que um botão implementa instalação automática.

A atribuição de comissões depende do programa e não é garantida.

## Transparência e licença

Projeto independente; não é produto oficial da Hostinger. As marcas pertencem aos respetivos titulares. MIT para este repositório; cada aplicação listada tem a sua própria licença. Consulte [LICENSE](LICENSE).
