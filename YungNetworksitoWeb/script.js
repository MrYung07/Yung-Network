const CONFIG={discordUrl:"https://discord.gg/7kPqqpVXeZ"};
document.getElementById('year').textContent=new Date().getFullYear();
document.querySelectorAll('.discord-link').forEach(a=>{a.href=CONFIG.discordUrl;a.target='_blank';a.rel='noopener noreferrer';});
const menuButton=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Chiudi menu':'Apri menu');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}));
const revealItems=document.querySelectorAll('.reveal');
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.12});revealItems.forEach(e=>observer.observe(e));}else revealItems.forEach(e=>e.classList.add('visible'));
const sections=document.querySelectorAll('main section[id]');
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}),{rootMargin:'-25% 0px -60% 0px'});sections.forEach(s=>observer.observe(s));}
(async()=>{
 const cfg=window.YUNG_SUPABASE_CONFIG;if(!window.supabase||!cfg?.url||!cfg?.anonKey)return;
 const db=window.supabase.createClient(cfg.url,cfg.anonKey),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const staffGrid=document.getElementById('staff-grid'),staffStatus=document.getElementById('staff-status');
 try{const {data,error}=await db.from('staff_members').select('id,name,role,bio,initials,avatar_url,active,sort_order').eq('active',true).order('sort_order').order('id');
 if(!error&&data&&data.length&&staffGrid){staffGrid.innerHTML=data.map((m,i)=>'<article class="staff-card reveal visible"><div class="staff-avatar avatar-'+['one','two','three','four'][i%4]+'">'+(m.avatar_url?'<img src="'+esc(m.avatar_url)+'" alt="'+esc(m.name)+'" loading="lazy">':'<span>'+esc(m.initials||m.name.slice(0,2).toUpperCase())+'</span>')+'</div><div class="staff-info"><span class="role">'+esc(m.role)+'</span><h3>'+esc(m.name)+'</h3><p>'+esc(m.bio)+'</p></div><span class="staff-number">'+String(i+1).padStart(2,'0')+'</span></article>').join('');if(staffStatus)staffStatus.textContent='Staff aggiornato dal pannello amministratore.';}
 }catch(e){}
 const socialGrid=document.getElementById('social-grid'),socialStatus=document.getElementById('social-status');
 try{const {data,error}=await db.from('social_links').select('id,label,url,active,sort_order').eq('active',true).order('sort_order').order('id');
 if(!error&&data&&data.length&&socialGrid){const discord='<a class="social-card" href="'+CONFIG.discordUrl+'" target="_blank" rel="noopener noreferrer"><span>◈</span><b>Discord</b><small>Entra nella community ↗</small></a>';socialGrid.innerHTML=discord+data.map(s=>'<a class="social-card" href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer"><span>✦</span><b>'+esc(s.label)+'</b><small>Seguici su '+esc(s.label)+' ↗</small></a>').join('');if(socialStatus)socialStatus.remove();}
 }catch(e){}
})();