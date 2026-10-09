import{q}from'./db';
export async function rejectReason(username:string){
 const checks=await q<any[]>(`SELECT attribute,value FROM radcheck WHERE LOWER(username)=LOWER(?)`,[username]);
 if(!checks.length)return{reason:'Usuário não encontrado',detail:'Não existe credencial ativa em radcheck para este usuário.',confidence:'confirmado'};
 const sim=checks.find(x=>String(x.attribute).toLowerCase()==='simultaneous-use');
 if(sim){const max=Number(sim.value||0);const [row]=await q<any[]>(`SELECT COUNT(DISTINCT COALESCE(NULLIF(acctsessionid,''),CONCAT('row-',radacctid))) c FROM radacct WHERE LOWER(username)=LOWER(?) AND acctstoptime IS NULL`,[username]);if(max>0&&Number(row?.c||0)>=max)return{reason:`Limite de sessões atingido (${max})`,detail:'Há sessão de accounting aberta para este usuário. Verifique Sessões antes de liberar novo acesso.',confidence:'confirmado'};}
 const exp=checks.find(x=>String(x.attribute).toLowerCase()==='expiration');if(exp&&new Date(exp.value).getTime()<Date.now())return{reason:'Usuário expirado',detail:`A validade configurada terminou em ${exp.value}.`,confidence:'confirmado'};
 const pw=checks.find(x=>String(x.attribute).toLowerCase().includes('password'));
 if(pw)return{reason:'Credenciais ou política de autenticação',detail:'O usuário existe e não há bloqueio simples detectável. Em CHAP, a causa mais comum é senha incorreta; o FreeRADIUS pode também rejeitar por outra política.',confidence:'diagnóstico'};
 return{reason:'Política RADIUS recusou o acesso',detail:'O usuário existe, mas não foi possível determinar a regra exata apenas pelo radpostauth.',confidence:'diagnóstico'};
}
