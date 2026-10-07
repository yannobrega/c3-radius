# C3 RADIUS v3
Painel SaaS para administração de FreeRADIUS + MariaDB, compatível com o schema padrão.

## Recursos
- Dashboard, usuários, perfis/grupos, Sites/NAS, sessões e auditoria
- CRUD de usuários, NAS e perfis
- Redirecionamentos relativos compatíveis com reverse proxy/EasyPanel
- Logo em `public/c3-logo.png` com fallback C3
- UI responsiva e Docker standalone otimizado

## Environment
`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `ADMIN_USER`, `ADMIN_PASSWORD`, `AUTH_SECRET`.

## V5 — sessões reais
- Dashboard e Sessões contam como online apenas registros sem `Acct-Stop` com `acctupdatetime`/`acctstarttime` recente.
- Janela padrão: 15 minutos; altere com `SESSION_FRESH_MINUTES=15`.
- Sessões stale continuam visíveis para auditoria, mas não contam como online.
- O nome amigável do NAS é resolvido pela tabela `nas`; localhost aparece como "Teste local".
- "Encerrar registro" preenche `acctstoptime` e `acctterminatecause=Admin-Reset`. Não envia CoA/Disconnect ao NAS.
