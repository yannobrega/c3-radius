# C3 RADIUS V10 — Eventos e vouchers

- Configurar `VOUCHER_ENCRYPTION_KEY` com chave aleatória estável (por exemplo, `openssl rand -hex 32`). Não alterar após criar vouchers; senhas existentes ficariam ilegíveis.
- O usuário do banco MariaDB precisa de CREATE TABLE na primeira utilização (ou executar DDL antes, com usuário privilegiado).
- Geração transacional: 1–500 vouchers por evento; aborta se o prefixo já tiver credenciais no banco.
- Senhas criptografadas em repouso na tabela c3_vouchers; o `Cleartext-Password` continua exigido no radcheck para CHAP. Proteger backups.
- `Expiration` usa horário UTC do servidor; verifique o timezone e a configuração de expiração do FreeRADIUS antes de usar em produção.
- `WISPr-Bandwidth-Max-Down/Up` é enviado em bits/s; a aplicação efetiva depende do NAS.
- `Simultaneous-Use` depende de accounting íntegro e configuração de verificação de sessões do FreeRADIUS.
- Validade é fixa a partir da geração; primeiro uso não implementado.
- Reimpressão do PDF revela credenciais; restringir acesso administrativo.
- O PDF é gerado sob demanda pelo endpoint autenticado e tem 8 cartões por A4.
