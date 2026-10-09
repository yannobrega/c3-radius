# C3 RADIUS v6

Painel Next.js para administração do FreeRADIUS / MariaDB.

## V6
- Consolida registros duplicados que compartilham o mesmo `Acct-Session-Id`.
- Dashboard conta sessões lógicas, não linhas cruas de `radacct`.
- Sessões usam atividade recente (`Acct-Update-Time`) para status online.
- Site/NAS mostra nome cadastrado e IP do NAS separadamente.
- IP do dispositivo continua vindo de `Framed-IP-Address`.
- Ao "Marcar encerrada", todos os registros abertos do mesmo `Acct-Session-Id` são fechados no histórico.
- Mantém aviso explícito: encerrar accounting não envia CoA/Disconnect ao dispositivo.

Configure `SESSION_FRESH_MINUTES=15` (ou outro valor >=5). Com Interim-Update de 300s no UniFi, 15 min é uma margem segura.

## V7
- Session IP is consolidated field-by-field; loopback IPs are never preferred over a real Framed-IP-Address.
- `/history` provides session audit filters for user, date, IP, MAC and NAS.
- `/logs` adds Access-Reject diagnostics. `radpostauth` does not store FreeRADIUS textual reject causes by default, so the UI explicitly labels confirmed DB-state causes vs probable diagnostics.
- Sessions expose Disconnect-Request (CoA/DM) using `radclient`. Configure UniFi Dynamic Authorization and UDP 3799. Optional `COA_PORT=3799`.
- CoA uses the NAS shared secret already stored in the `nas` table; never expose it in UI/logs.
