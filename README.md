# Portfólio · Marcos Moschetti

![Deploy](https://github.com/moschettimarcos/moschettimarcos.github.io/actions/workflows/static.yml/badge.svg)

Portfólio pessoal de **Analista de QA**, com experiência, projetos de automação e formação.

🔗 **Acesse:** [moschettimarcos.github.io](https://moschettimarcos.github.io/)

## ✨ Funcionalidades

- **Português e inglês**, com troca de idioma sem recarregar a página
- **Tema claro e escuro**
- **Projetos com filtro por ferramenta** e resumo de cada um em janela modal
- **Botões para copiar e-mail, falar no WhatsApp e compartilhar a página**
- **Acessibilidade:** navegação por teclado, textos alternativos e respeito à preferência de menos animação
- **Versão para impressão** do currículo direto pelo navegador
- **SEO:** descrição, Open Graph para compartilhamento em redes sociais, dados estruturados, `sitemap.xml` e `robots.txt`
- **Leve:** um único HTML sem framework, foto em WebP e e-mail protegido contra robôs de spam

## 🧰 Tecnologias

- HTML, CSS e JavaScript puros, sem framework e sem etapa de build
- GitHub Pages, com deploy automático pelo GitHub Actions a cada push na `main`
- GoatCounter para contagem de visitas, sem cookies

## 📁 Estrutura

```
.
├── .github/workflows/static.yml   deploy automático no GitHub Pages
├── assets/
│   ├── docs/                      currículo em PDF
│   └── img/                       foto de perfil (WebP)
├── index.html                     página principal (HTML, CSS e JS)
├── 404.html                       página de erro
├── favicon.svg, apple-touch-icon.png, og-image.jpg
├── robots.txt
└── sitemap.xml
```

## ▶️ Como rodar localmente

Como é um site estático, basta abrir o `index.html` no navegador. Para simular um servidor de verdade:

```bash
npx serve .
```

## 🚀 Deploy

Todo push na branch `main` dispara o workflow `static.yml`, que publica o site no GitHub Pages em cerca de um minuto.

## 📬 Contato

- [LinkedIn](https://www.linkedin.com/in/marcos-moschetti/)
- [GitHub](https://github.com/moschettimarcos)
