(() => {
 const grid=document.getElementById('news-grid'),status=document.getElementById('news-status'),cfg=window.YUNG_SUPABASE_CONFIG;
 if(!grid||!window.supabase||!cfg?.url||!cfg?.anonKey){if(grid)grid.innerHTML='<p class="edit-note">News non disponibili: controlla la configurazione.</p>';return;}
 const client=window.supabase.createClient(cfg.url,cfg.anonKey);
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const dateLabel=v=>v?new Date(v).toLocaleDateString('it-IT',{day:'2-digit',month:'short',year:'numeric'}):'';
 async function loadNews(){
  const {data,error}=await client.from('news').select('id,title,summary,content,category,image_url,published_at,expires_at').eq('status','published').order('published_at',{ascending:false}).limit(30);
  if(error){grid.innerHTML='<p class="edit-note">Non è stato possibile caricare le news. Verifica la configurazione SQL.</p>';if(status)status.textContent='Feed temporaneamente non disponibile.';return;}
  const now=Date.now(),items=(data||[]).filter(n=>!n.expires_at||new Date(n.expires_at).getTime()>now).slice(0,6);
  if(!items.length){grid.innerHTML='<p class="edit-note">Nessuna news pubblicata al momento. Torna presto!</p>';if(status)status.textContent='';return;}
  grid.innerHTML=items.map((n,i)=>{const image=n.image_url?'<img src="'+esc(n.image_url)+'" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0">':'';return '<article class="news-card reveal visible"><div class="news-visual news-visual-'+['one','two','three'][i%3]+'" style="position:relative;overflow:hidden">'+image+'<span class="news-category">'+esc(n.category||'COMMUNITY')+'</span><span class="visual-glyph" aria-hidden="true">'+['✳','⌖','◉'][i%3]+'</span><span class="visual-code">YUNG NETWORK / NEWS</span></div><div class="news-body"><div class="news-meta"><span>'+esc(n.category||'NEWS')+'</span><span class="news-date">'+esc(dateLabel(n.published_at))+'</span></div><h3>'+esc(n.title)+'</h3><p>'+esc(n.summary||n.content||'')+'</p></div></article>';}).join('');
  if(status)status.textContent='Ultimi aggiornamenti del network.';
 }
 loadNews();
})();