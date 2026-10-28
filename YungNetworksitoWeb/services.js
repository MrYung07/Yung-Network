document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('copy-discord-name');
  const status = document.getElementById('copy-discord-status');
  if (!button || !status) return;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('MrYung07');
      status.textContent = 'Nome copiato! Cercami su Discord: MrYung07';
    } catch {
      status.textContent = 'Cercami su Discord digitando: MrYung07';
    }
  });
});
