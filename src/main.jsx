import React, { useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { LayoutDashboard, Package, Megaphone, Settings, Search, Plus, ExternalLink, Copy, ShoppingBag, Store, MousePointerClick, Link2, Trash2, Sparkles, Menu, X, Check, Smartphone, Monitor } from 'lucide-react';
import './styles.css';
import { supabase } from './supabase.js';
import { Schedule } from './Schedule.jsx';
import { AuthGate } from './AuthGate.jsx';

const KEY = 'central-afiliados-produtos-v1';
const initial = [
  { id: 1, name: 'Exemplo: Fone Bluetooth', platform: 'Shopee', price: '59,90', url: 'https://', category: 'Eletrônicos', createdAt: new Date().toISOString() },
  { id: 2, name: 'Exemplo: Garrafa térmica', platform: 'Mercado Livre', price: '79,90', url: 'https://', category: 'Casa', createdAt: new Date().toISOString() }
];
function load() { try { return JSON.parse(localStorage.getItem(KEY)) ?? initial; } catch { return initial; } }
function App() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState('Visão geral');
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState('Todas');
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name:'', platform:'Shopee', price:'', url:'', category:'' });
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adText, setAdText] = useState('');
  const [busy,setBusy]=useState(false);
  const mapRow=p=>({id:p.id,name:p.nome,platform:p.plataforma,price:p.preco==null?'':Number(p.preco).toFixed(2).replace('.',','),url:p.link_afiliado,category:p.categoria||'',createdAt:p.criado_em});
  useEffect(()=>{let active=true;supabase.from('produtos').select('*').order('criado_em',{ascending:false}).then(({data,error})=>{if(!active)return;if(error)notify(error.message);else setItems(data.map(mapRow))});return ()=>{active=false}},[]);
  const importLocal=async()=>{if(busy)return;setBusy(true);try{const local=JSON.parse(localStorage.getItem(KEY)||'[]');for(const p of local){if(items.some(x=>x.url===p.url&&x.name===p.name))continue;await insertProduct(p)}notify('Importação concluída. Confira o catálogo.')}catch(e){notify(e.message)}finally{setBusy(false)}};
  async function insertProduct(p){const url=new URL(p.url);if(url.protocol!=='https:')throw Error('Use um link HTTPS válido.');const price=p.price?Number(p.price.includes(',')?p.price.replace(/\\./g,'').replace(',','.'):p.price):null;if(price!==null&&(!Number.isFinite(price)||price<0))throw Error('Preço inválido.');const {data,error}=await supabase.from('produtos').insert({nome:p.name.trim(),plataforma:p.platform,preco:price,link_afiliado:url.href,categoria:p.category}).select().single();if(error)throw error;setItems(old=>[mapRow(data),...old]);}

  const filtered = useMemo(() => items.filter(p => (platform === 'Todas' || p.platform === platform) && (p.name+p.category).toLowerCase().includes(query.toLowerCase())), [items, platform, query]);
  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2400); };
  const add = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim()) return;
    if(busy)return;setBusy(true);try{await insertProduct(form)}catch(e){notify(e.message);return}finally{setBusy(false)}
    setForm({ name:'', platform:'Shopee', price:'', url:'', category:'' }); setModal(false); notify('Produto cadastrado!');
  };
  const remove = async (id) => { const {error}=await supabase.from('produtos').delete().eq('id',id);if(error){notify(error.message);return}setItems(old=>old.filter(p=>p.id!==id)); if(selected?.id===id) setSelected(null); notify('Produto removido.'); };
  const copy = async (value, msg) => { try { await navigator.clipboard.writeText(value); notify(msg); } catch { notify('Não foi possível copiar neste navegador.'); } };
  const makeAd = (p) => { setSelected(p); setAdText('🔥 OLHA ESSA OPORTUNIDADE!\n\n' + p.name + (p.price ? '\nPor apenas R$ ' + p.price : '') + '\n\nConfira aqui: ' + p.url + '\n\n#oferta #achadinhos #promoção #afiliado'); setPage('Criador de anúncios'); };
  const nav = [{name:'Visão geral',icon:LayoutDashboard},{name:'Meus produtos',icon:Package},{name:'Criador de anúncios',icon:Megaphone},{name:'Agendamentos',icon:Megaphone},{name:'Configurações',icon:Settings}];
  const totalShopee = items.filter(p=>p.platform==='Shopee').length;
  const totalML = items.filter(p=>p.platform==='Mercado Livre').length;
  return <div className="app-shell">
    <aside className={menuOpen?'sidebar open':'sidebar'}>
      <div className="brand"><div className="brand-mark"><Megaphone size={22}/></div><div><b>Central de Afiliados</b><small>24H · PAINEL</small></div><button className="close-menu" onClick={()=>setMenuOpen(false)}><X/></button></div>
      <div className="nav-label">MENU PRINCIPAL</div>
      {nav.map(n=><button key={n.name} className={'nav-item '+(page===n.name?'active':'')} onClick={()=>{setPage(n.name);setMenuOpen(false)}}><n.icon size={18}/>{n.name}</button>)}
      <div className="sidebar-bottom"><div className="status-dot"/> Painel em nuvem · versão 0.3.0</div>
    </aside>
    {menuOpen && <div className="scrim" onClick={()=>setMenuOpen(false)}/>}
    <main className="main">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setMenuOpen(true)}><Menu/></button><div><span className="eyebrow">CENTRAL DE CONTROLE</span><h1>{page}</h1></div><div className="top-right"><span className="online"><i/> Sistema em desenvolvimento</span><div className="avatar">VA</div></div></header>
      <div className="content">
        {page==='Visão geral' && <>
          <section className="welcome"><div><span className="eyebrow light">SEU NEGÓCIO DE AFILIADOS, ORGANIZADO</span><h2>Bom trabalho! 👋<br/>Vamos movimentar suas ofertas?</h2><p>Gerencie seus produtos e prepare conteúdos para divulgar seus links.</p><button className="primary light-btn" onClick={()=>setModal(true)}><Plus size={17}/> Cadastrar produto</button></div><div className="welcome-art"><div className="art-circle"><ShoppingBag size={65}/><Sparkles className="spark" size={26}/></div></div></section>
          <div className="stats-grid">
            <Stat icon={Package} label="Produtos cadastrados" value={items.length} color="purple"/>
            <Stat icon={ShoppingBag} label="Shopee" value={totalShopee} color="orange"/>
            <Stat icon={Store} label="Mercado Livre" value={totalML} color="blue"/>
            <Stat icon={Link2} label="Links registrados" value={items.filter(p=>p.url).length} color="green"/>
          </div>
          <section className="section-card"><div className="section-head"><div><h3>Comece por aqui</h3><p>As principais ações para organizar suas campanhas.</p></div></div><div className="quick-grid"><Quick icon={Plus} title="Adicionar produto" desc="Cadastre um link de afiliado." onClick={()=>setModal(true)}/><Quick icon={Sparkles} title="Criar anúncio" desc="Prepare uma legenda promocional." onClick={()=>setPage('Criador de anúncios')}/><Quick icon={Package} title="Ver catálogo" desc="Consulte todos os seus produtos." onClick={()=>setPage('Meus produtos')}/></div></section>
          <section className="section-card"><div className="section-head"><div><h3>Produtos recentes</h3><p>Seus últimos links cadastrados.</p></div><button className="text-btn" onClick={()=>setPage('Meus produtos')}>Ver todos <ExternalLink size={14}/></button></div><ProductList items={items.slice(0,4)} onAd={makeAd} onCopy={copy} onRemove={remove}/></section>
        </>}
        {page==='Meus produtos' && <section className="section-card"><div className="section-head wrap"><div><h3>Seu catálogo de ofertas</h3><p>Organize seus links da Shopee e do Mercado Livre.</p></div><button className="primary" onClick={()=>setModal(true)}><Plus size={17}/> Novo produto</button></div><div className="filters"><div className="search"><Search size={17}/><input placeholder="Buscar produto ou categoria..." value={query} onChange={e=>setQuery(e.target.value)}/></div><select value={platform} onChange={e=>setPlatform(e.target.value)}><option>Todas</option><option>Shopee</option><option>Mercado Livre</option></select></div><ProductList items={filtered} onAd={makeAd} onCopy={copy} onRemove={remove}/>{filtered.length===0&&<div className="empty">Nenhum produto encontrado.</div>}</section>}
        {page==='Criador de anúncios' && <section className="section-card"><div className="section-head"><div><h3><Sparkles size={19}/> Criador de anúncios</h3><p>Monte uma legenda promocional pronta para revisar e copiar.</p></div></div><div className="ad-layout"><div><label>Produto cadastrado</label><select value={selected?.id||''} onChange={e=>{const p=items.find(x=>String(x.id)===e.target.value);if(p)makeAd(p)}}><option value="">Selecione um produto</option>{items.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select>{selected&&<div className="selected-product"><b>{selected.name}</b><span>{selected.platform} {selected.price?'· R$ '+selected.price:''}</span></div>}<p className="hint">A legenda é gerada localmente com um modelo simples. Revise preço, disponibilidade e regras da plataforma antes de publicar.</p></div><div><label>Texto promocional editável</label><textarea rows="12" value={adText} onChange={e=>setAdText(e.target.value)} placeholder="Selecione um produto para gerar uma sugestão de anúncio..."/><button className="primary full" disabled={!adText} onClick={()=>copy(adText,'Texto copiado!') }><Copy size={16}/> Copiar anúncio</button></div></div></section>}
        {page==='Agendamentos' && <Schedule items={items}/>}
        {page==='Configurações' && <section className="section-card"><h3>Configurações do projeto</h3><p className="muted">Os novos produtos são armazenados no Supabase.</p><div className="notice"><Sparkles/><div><b>Automação em nuvem — próxima etapa</b><p>Para executar campanhas 24 horas sem depender do aparelho, será necessário configurar backend, banco de dados, credenciais oficiais e agendador.</p></div></div><div className="notice"><Smartphone/><div><b>Android e Windows</b><p>A interface é responsiva. A instalação como aplicativo será preparada em uma etapa posterior, após validar o painel.</p></div></div><div className="notice warning"><Settings/><div><b>Publicação em redes sociais</b><p>Nenhuma publicação é enviada automaticamente nesta versão. As integrações dependerão das APIs e permissões oficiais de cada canal.</p></div></div><button className="secondary" disabled={busy} onClick={importLocal}>Importar produtos deste navegador</button></section>}
        <footer>Central de Afiliados 24H <span>·</span> MVP 0.3.0 <span>·</span> Feito para organizar suas ofertas</footer>
      </div>
    </main>
    {modal&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><form className="modal" onSubmit={add}><div className="modal-head"><div><span className="eyebrow">CATÁLOGO</span><h2>Cadastrar produto</h2></div><button type="button" className="icon-btn" onClick={()=>setModal(false)}><X/></button></div><label>Nome do produto *</label><input required autoFocus value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ex.: Fone Bluetooth sem fio"/><label>Plataforma</label><select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})}><option>Shopee</option><option>Mercado Livre</option></select><label>Preço (R$)</label><input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Ex.: 59,90"/><label>Categoria</label><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Ex.: Eletrônicos"/><label>Link de afiliado *</label><input required type="url" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://..."/><div className="modal-actions"><button type="button" className="secondary" onClick={()=>setModal(false)}>Cancelar</button><button className="primary" type="submit"><Check size={16}/> Salvar produto</button></div></form></div>}
    {toast&&<div className="toast"><Check size={17}/>{toast}</div>}
  </div>;
}
function Stat({icon:Icon,label,value,color}){return <div className="stat-card"><div className={'stat-icon '+color}><Icon size={20}/></div><div><span>{label}</span><strong>{value}</strong></div></div>}
function Quick({icon:Icon,title,desc,onClick}){return <button className="quick" onClick={onClick}><div className="quick-icon"><Icon size={20}/></div><div><b>{title}</b><span>{desc}</span></div><ExternalLink size={15} className="quick-arrow"/></button>}
function ProductList({items,onAd,onCopy,onRemove}){if(!items.length)return <div className="empty">Seu catálogo está vazio. Cadastre seu primeiro produto para começar.</div>;return <div className="product-list">{items.map(p=><div className="product-row" key={p.id}><div className={'platform-icon '+(p.platform==='Shopee'?'shopee':'ml')}>{p.platform==='Shopee'?<ShoppingBag size={19}/>:<Store size={19}/>}</div><div className="product-info"><b>{p.name}</b><span>{p.platform} {p.category?'· '+p.category:''} {p.price?'· R$ '+p.price:''}</span><small>{p.url}</small></div><div className="product-actions"><button title="Copiar link" onClick={()=>onCopy(p.url,'Link copiado!')}><Copy size={16}/></button><button title="Criar anúncio" onClick={()=>onAd(p)}><Megaphone size={16}/></button><button title="Abrir link" onClick={()=>window.open(p.url,'_blank','noopener,noreferrer')}><ExternalLink size={16}/></button><button title="Excluir" className="remove" onClick={()=>onRemove(p.id)}><Trash2 size={16}/></button></div></div>)}</div>}
createRoot(document.getElementById('root')).render(<AuthGate><App/></AuthGate>);
