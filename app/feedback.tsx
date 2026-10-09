'use client';
import {useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {AlertCircle,CheckCircle2,Info,TriangleAlert,X} from 'lucide-react';

type Notice={kind:'success'|'error'|'info',title:string,message:string};
type Pending={form:HTMLFormElement,submitter:HTMLElement|null,action:string,label:string};
const destructive=(s:string)=>/excluir|apagar|remover|encerrar|desconectar|delete|coa/i.test(s);
const getAction=(f:HTMLFormElement,button:HTMLElement|null)=>{
 const v=(button as HTMLButtonElement|null)?.value||'';
 return [v,String(new FormData(f).get('_action')||''),(button?.textContent||'')].join(' ');
};
export default function FeedbackCenter(){
 const router=useRouter();const [notice,setNotice]=useState<Notice|null>(null),[toast,setToast]=useState<Notice|null>(null),[pending,setPending]=useState<Pending|null>(null),[busy,setBusy]=useState(false);
 const state=useRef({busy:false});
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(null),5000);return()=>clearTimeout(t)},[toast]);
 useEffect(()=>{const onSubmit=(event:SubmitEvent)=>{
  const form=event.target as HTMLFormElement;
  if(!(form instanceof HTMLFormElement)||form.dataset.nativeSubmit==='true')return;
  const url=new URL(form.action,window.location.href);
  if(!url.pathname.startsWith('/api/')||url.pathname.startsWith('/api/auth/'))return;
  event.preventDefault();if(state.current.busy)return;
  const submitter=event.submitter as HTMLElement|null;
  const action=getAction(form,submitter);
  if(destructive(action)){
   setPending({form,submitter,action,label:(submitter?.textContent||'Confirmar ação').trim()});return;
  }
  void execute(form,submitter,action);
 };
 const execute=async(form:HTMLFormElement,submitter:HTMLElement|null,action:string)=>{
  state.current.busy=true;setBusy(true);
  try{
   const data=submitter instanceof HTMLButtonElement?new FormData(form,submitter):new FormData(form);
   const response=await fetch(form.action,{method:(form.method||'POST').toUpperCase(),body:data,credentials:'same-origin',redirect:'follow',headers:{'Accept':'application/json, text/plain;q=0.9'}});
   const contentType=response.headers.get('content-type')||'';
   let message='';let redirect='';
   if(contentType.includes('application/json')){
    const payload=await response.json();message=String(payload.message||payload.error||'');redirect=String(payload.redirect||'');
   }else if(contentType.includes('text/plain'))message=await response.text();
   if(!response.ok){setNotice({kind:'error',title:'Não foi possível concluir',message:message||`Erro HTTP ${response.status}. Nenhuma confirmação de sucesso foi recebida.`});return;}
   const verb=/import/i.test(form.action)?'Importação concluída':/delete|excluir/i.test(action)?'Exclusão concluída':/coa|desconectar/i.test(action)?'Solicitação de desconexão enviada':/encerrar/i.test(action)?'Registro encerrado':/update|salvar/i.test(action)?'Alterações salvas':'Operação concluída';
   setToast({kind:'success',title:verb,message:message||'As alterações foram processadas.'});
   form.reset();
   // Legacy API handlers redirect with 303; fetch follows the redirect without navigating away.
   // The page is refreshed so server-rendered data updates in place.
   if(redirect&&redirect.startsWith('/')&&!redirect.startsWith('//'))router.push(redirect);
   router.refresh();
  }catch(e){setNotice({kind:'error',title:'Falha de comunicação',message:e instanceof Error?e.message:'Não foi possível contactar o servidor.'})}
  finally{state.current.busy=false;setBusy(false);setPending(null)}
 };
 document.addEventListener('submit',onSubmit,true);return()=>document.removeEventListener('submit',onSubmit,true);
 },[router]);
 useEffect(()=>{const listener=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!busy){setNotice(null);setPending(null)}};document.addEventListener('keydown',listener);return()=>document.removeEventListener('keydown',listener)},[busy]);
 return <>
  {toast&&<div className={`c3-toast ${toast.kind}`} role="status"><CheckCircle2 size={21}/><div><b>{toast.title}</b><span>{toast.message}</span></div><button aria-label="Fechar aviso" onClick={()=>setToast(null)}><X size={17}/></button></div>}
  {(notice||pending)&&<div className="c3-dialog-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget&&!busy){setNotice(null);setPending(null)}}}><section className="c3-dialog" role="alertdialog" aria-modal="true" aria-labelledby="c3-dialog-title"><div className={`c3-dialog-icon ${pending?'warning':notice?.kind}`}>{pending?<TriangleAlert size={25}/>:notice?.kind==='error'?<AlertCircle size={25}/>:<Info size={25}/>}</div><button className="c3-dialog-close" aria-label="Fechar" disabled={busy} onClick={()=>{setNotice(null);setPending(null)}}><X size={20}/></button><h2 id="c3-dialog-title">{pending?'Confirmar operação':notice?.title}</h2><p className="c3-dialog-description">{pending?`Deseja realmente ${pending.label.toLowerCase()}? Confira a operação antes de continuar.`:'O servidor retornou a seguinte informação:'}</p>{notice&&<div className="c3-dialog-detail">{notice.message}</div>}<div className="c3-dialog-actions"><button type="button" className="c3-btn-secondary" disabled={busy} onClick={()=>{setNotice(null);setPending(null)}}>{pending?'Cancelar':'Fechar'}</button>{pending&&<button type="button" className="c3-btn-danger" disabled={busy} onClick={()=>void execute(pending.form,pending.submitter,pending.action)}>{busy?'Processando...':pending.label}</button>}</div></section></div>}
 </>
}
