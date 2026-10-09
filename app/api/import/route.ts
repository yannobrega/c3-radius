import{db}from'../../../lib/db';import{seeOther}from'../../../lib/http';import * as XLSX from'xlsx';import {validGroups,groupError} from '../../../lib/groups';
function radiusDate(v:any){if(!v)return'';const d=new Date(v);if(Number.isNaN(+d))return String(v);const m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];return`${String(d.getDate()).padStart(2,'0')} ${m[d.getMonth()]} ${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:00`}
const pick=(r:any,...keys:string[])=>{for(const k of keys)if(r[k]!=null&&String(r[k]).trim()!=='')return String(r[k]).trim();return''};
export async function POST(req:Request){
 const f=await req.formData(),file=f.get('file');
 if(!(file instanceof File))return new Response('Arquivo inválido',{status:400});
 if(file.size>8*1024*1024)return new Response('Arquivo acima do limite de 8 MB',{status:413});
 let rows:any[];
 try {const buf=Buffer.from(await file.arrayBuffer());const wb=XLSX.read(buf,{type:'buffer',cellDates:true});const ws=wb.Sheets[wb.SheetNames[0]];rows=XLSX.utils.sheet_to_json<any>(ws,{defval:''});}
 catch{return new Response('Planilha inválida ou corrompida',{status:400})}
 if(!rows.length)return new Response('Planilha vazia',{status:400});
 if(rows.length>2000)return new Response('Limite de 2000 linhas por importação',{status:400});
 const c=await db.getConnection();
 try {
  const groups=await validGroups(c);
  const normalized=rows.map((raw,index)=>{const r:any={};for(const [k,v] of Object.entries(raw))r[k.toLowerCase().trim()]=v;
   return {line:index+2,username:pick(r,'username','usuario','usuário'),password:pick(r,'password','senha'),group:pick(r,'group','perfil','grupo'),simultaneous:pick(r,'simultaneous','simultaneos','simultâneos')||'1',expiration:pick(r,'expiration','expiracao','expiração')};});
  const errors:string[]=[];const seen=new Set<string>();
  for(const row of normalized){
   if(!row.username||!row.password)errors.push(`Linha ${row.line}: usuário e senha obrigatórios.`);
   if(row.username && seen.has(row.username.toLowerCase()))errors.push(`Linha ${row.line}: usuário duplicado na planilha (${row.username}).`);
   seen.add(row.username.toLowerCase());
   const e=groupError(row.group,groups);if(e)errors.push(`Linha ${row.line}: ${e}`);
   if(!Number.isInteger(Number(row.simultaneous))||Number(row.simultaneous)<1)errors.push(`Linha ${row.line}: conexões simultâneas inválidas.`);
   if(row.expiration && Number.isNaN(Date.parse(row.expiration)))errors.push(`Linha ${row.line}: expiração inválida.`);
  }
  if(errors.length)return new Response(`Importação cancelada. Nenhum usuário foi criado.\n\n${errors.join('\n')}\n\nGrupos disponíveis: ${groups.length?groups.join(', '):'nenhum grupo cadastrado'}`,{status:422,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  await c.beginTransaction();
  try {
   const usernames=normalized.map(r=>r.username);
   const [existing]=await c.query<any[]>(`SELECT DISTINCT username FROM radcheck WHERE username IN (${usernames.map(()=>'?').join(',')})`,usernames);
   if(existing.length)throw new Error(`Usuários já cadastrados: ${existing.map((x:any)=>x.username).join(', ')}`);
   for(const r of normalized){
    await c.query(`INSERT INTO radcheck(username,attribute,op,value) VALUES (?,'Cleartext-Password',':=',?),(?,'Simultaneous-Use',':=',?)`,[r.username,r.password,r.username,r.simultaneous]);
    if(r.expiration)await c.query(`INSERT INTO radcheck(username,attribute,op,value) VALUES (?,'Expiration',':=',?)`,[r.username,radiusDate(r.expiration)]);
    if(r.group)await c.query(`INSERT INTO radusergroup(username,groupname,priority) VALUES (?,?,1)`,[r.username,r.group]);
   }
   await c.commit();
  }catch(e){await c.rollback();throw e}
  return seeOther(`/import?ok=${normalized.length}`);
 }catch(e){return new Response(`Importação cancelada. Nenhum usuário foi criado.\n${e instanceof Error?e.message:'Erro inesperado'}`,{status:422,headers:{'Content-Type':'text/plain; charset=utf-8'}})}finally{c.release()}
}
