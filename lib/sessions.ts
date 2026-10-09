export const SESSION_FRESH_MINUTES = Math.max(5, Number(process.env.SESSION_FRESH_MINUTES || 15));
export function bytes(v:any){const n=Number(v||0);if(!n)return '0 B';const u=['B','KB','MB','GB','TB'];const i=Math.min(Math.floor(Math.log(n)/Math.log(1024)),u.length-1);return `${(n/Math.pow(1024,i)).toFixed(i>1?1:0)} ${u[i]}`}
export function friendlyNas(ip:string,shortname?:string|null,description?:string|null){if(shortname)return {name:shortname,detail:ip||description||'—',local:false};if(ip==='127.0.0.1'||ip==='::1')return {name:'Localhost',detail:'127.0.0.1',local:true};return {name:'NAS não identificado',detail:ip||'—',local:false}}
export const SESSION_GROUP_SQL=`COALESCE(NULLIF(r.acctsessionid,''),CONCAT('row-',r.radacctid))`;
