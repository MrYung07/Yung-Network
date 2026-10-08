// Yung Network — personalizza i link e i profili qui sotto.
const CONFIG = {
  discordUrl: "https://discord.gg/7kPqqpVXeZ",
  // Facoltativo: aggiungi i link reali dei tuoi social.
};

document.getElementById('year').textContent = new Date().getFullYear();

// Applica l'invito Discord a tutti i pulsanti e i link dedicati.
document.querySelectorAll('.discord-link').forEach((link) => {
  link.href = CONFIG.discordUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.addEventListener('click', (event) => {
    if (CONFIG.discordUrl.includes('INSERISCI-IL-TUO-INVITO')) {
      event.preventDefault();
      const toast = document.querySelector('.toast');
      toast.textContent = 'Aggiungi il tuo link Discord in script.js per attivare questo pulsante.';
      toast.classList.add('show');
      window.setTimeout(() => toast.classList.remove('show'), 3600);
    }
  });
});

// Menu mobile accessibile.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

// Animazioni d'ingresso quando le sezioni diventano visibili.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

// Evidenzia nel menu la sezione che si sta visitando.
const sections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-25% 0px -60% 0px' });
  sections.forEach((section) => sectionObserver.observe(section));
}
