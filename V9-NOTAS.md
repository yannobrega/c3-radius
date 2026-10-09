# C3 RADIUS V9 — Toasts e Modais

- Intercepta formulários POST para /api/* no navegador, sem navegação para páginas de erro.
- Modal de erro para respostas HTTP não-2xx (incluindo erros de validação de importação).
- Modal de confirmação para exclusão, encerramento e CoA.
- Toast de sucesso, com atualização dos componentes server-side via router.refresh().
- Preserva endpoints e esquema MariaDB existentes.
- Login/logout mantêm o fluxo nativo de autenticação.

## Atenção

Esta entrega não passou pelo `next build` neste ambiente porque a instalação npm excedeu o tempo disponível. Execute `npm install && npm run build` antes de implantar em produção.

O frontend atual trata formulários convencionais existentes. Novas ações programáticas que não usem um formulário devem integrar-se ao FeedbackCenter separadamente.
