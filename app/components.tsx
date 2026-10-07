'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Activity, Gauge, Users, Server, Wifi, FileText, LogOut, Settings, UserRoundCog, Menu, X} from 'lucide-react';
import {useState} from 'react';

const items=[
  ['/', 'Dashboard', Gauge],
  ['/users','Usuários',Users],
  ['/profiles','Perfis / Grupos',UserRoundCog],
  ['/sites','Sites / NAS',Server],
  ['/sessions','Sessões',Wifi],
  ['/logs','Logs',FileText],
] as const;

export function Logo({compact=false}:{compact?:boolean}){
  const [failed,setFailed]=useState(false);
  return <div className={`logo-wrap ${compact?'compact':''}`}>
    {!failed && <img src="/c3-logo.png" alt="C3 Support" className="brand-logo" onError={()=>setFailed(true)}/>}
    {failed && <div className="logo-fallback"><b>C3</b><span>SUPPORT</span></div>}
    {!compact && <div className="brand-copy"><strong>C3 RADIUS</strong><span>Gerenciamento FreeRADIUS</span></div>}
  </div>
}

export function Shell({children,title,subtitle}:{children:React.ReactNode,title:string,subtitle?:string}){
  const path=usePathname(); const [open,setOpen]=useState(false);
  return <div className="shell">
    <aside className={`side ${open?'open':''}`}>
      <div className="side-head"><Logo/><button className="icon-btn mobile-only" onClick={()=>setOpen(false)} aria-label="Fechar menu"><X size={20}/></button></div>
      <nav className="nav">{items.map(([href,label,Icon])=><Link key={href} href={href} className={path===href?'active':''} onClick={()=>setOpen(false)}><Icon size={19}/><span>{label}</span></Link>)}</nav>
      <div className="side-bottom"><div className="radius-status"><span className="status-dot"/><div><b>FreeRADIUS</b><small>Backend conectado</small></div></div><div className="version">C3 RADIUS v2.0 • Suporte que conecta</div></div>
    </aside>
    {open&&<button className="overlay" onClick={()=>setOpen(false)} aria-label="Fechar menu"/>}
    <main className="main">
      <header className="topbar"><button className="icon-btn mobile-only" onClick={()=>setOpen(true)} aria-label="Abrir menu"><Menu size={21}/></button><div className="page-title"><h1>{title}</h1><p>{subtitle||'Gerenciamento de acessos • FreeRADIUS'}</p></div><div className="top-actions"><div className="admin-pill"><span className="avatar">C3</span><div><b>Administrador</b><small>C3 Support</small></div></div><form action="/api/auth/logout" method="post"><button className="icon-btn" title="Sair"><LogOut size={19}/></button></form></div></header>
      <div className="content">{children}</div>
    </main>
  </div>
}

export function Empty({text='Nenhum registro encontrado.'}:{text?:string}){return <div className="empty"><Activity size={20}/>{text}</div>}
