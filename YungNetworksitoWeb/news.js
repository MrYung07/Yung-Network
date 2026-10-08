(() => {
  const grid = document.getElementById('news-grid');
  const status = document.getElementById('news-status');
  const cfg = window.YUNG_SUPABASE_CONFIG;
  if (!grid || !window.supabase || !cfg || !cfg.url || cfg.url.startsWith('INSERISCI_') || !cfg.anonKey || cfg.anonKey.startsWith('INSERISCI_')) {
    if (grid) grid.innerHTML = '<p class="edit-note">Le news online saranno disponibili dopo la configurazione di Supabase.</p>';
    return;
  }
  const client = window.supabase.createClient(cfg.url, cfg.anonKey);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const dateLabel = value => value ? new Date(value).toLocaleDateString('it-IT',{day:'2-digit',month:'short',year:'numeric'}) : '';
  async function loadNews() {
    const { data, error } = await client.from('news').select('id,title,summary,content,category,image_url,published_at').eq('status','published').order('published_at',{ascending:false}).limit(6);
    if (error) { grid.innerHTML = '<p class="edit-note">Non è stato possibile caricare le news. Riprova più tardi.</p>'; if(status) status.textContent='Feed temporaneamente non disponibile.'; return; }
    if (!data || !data.length) { grid.innerHTML = '<p class="edit-note">Nessuna news pubblicata al momento. Torna presto!</p>'; return; }
    grid.innerHTML = data.map((item, i) => {
      const image = item.image_url ? `<img src="${escapeHtml(item.image_url)}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0">` : '';
      return `<article class="news-card ${i===0?'news-featured':''} reveal visible"><div class="news-visual news-visual-${['one','two','three'][i%3]}" style="position:relative;overflow:hidden">${image}<span class="news-category">${escapeHtml(item.category || 'COMMUNITY')}</span><span class="visual-glyph" aria-hidden="true">${['✳','⌖','◉'][i%3]}</span><span class="visual-code">YUNG NETWORK / NEWS</span></div><div class="news-body"><div class="news-meta"><span>${escapeHtml(item.category || 'NEWS')}</span><span class="news-date">${escapeHtml(dateLabel(item.published_at))}</span></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary || item.content || '')}</p></div></article>`;
    }).join('');
    if(status) status.textContent='Ultimi aggiornamenti del network.';
  }
  loadNews();
})();
