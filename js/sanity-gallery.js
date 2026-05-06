import { createClient } from '@sanity/client';

// Configuración del cliente Sanity
const client = createClient({
  projectId: 'xpeoe7sp',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
  // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
});

// Función para cargar eventos desde Sanity
async function loadEventos() {
  try {
    const query = `*[_type == "evento"]{
      titulo,
      categoria,
      "imagenUrl": imagenPrincipal.asset->url
    }`;
    const eventos = await client.fetch(query);

    // Limpiar contenedores
    document.getElementById('dj-container').innerHTML = '';
    document.getElementById('foto-container').innerHTML = '';
    document.getElementById('show-container').innerHTML = '';
    document.getElementById('video-container').innerHTML = '';

    // Poblar contenedores según categoría
    eventos.forEach(evento => {
      const item = document.createElement('div');
      item.className = 'portfolio-item-card';
      item.innerHTML = `
        <img src="${evento.imagenUrl}" alt="${evento.titulo}" style="width:100%; height:100%; object-fit:cover;">
        <div class="portfolio-overlay">
          <div class="portfolio-tag">${evento.categoria.toUpperCase()}</div>
          <div class="portfolio-title">${evento.titulo}</div>
        </div>
      `;
      item.addEventListener('click', () => openImageModal(evento.imagenUrl, evento.titulo));

      // Agregar al contenedor correspondiente
      switch (evento.categoria) {
        case 'dj':
          document.getElementById('dj-container').appendChild(item);
          break;
        case 'fotografia':
          document.getElementById('foto-container').appendChild(item);
          break;
        case 'show':
          document.getElementById('show-container').appendChild(item);
          break;
        case 'video':
          document.getElementById('video-container').appendChild(item);
          break;
      }
    });
  } catch (error) {
    console.error('Error cargando eventos:', error);
  }
}

// Función para abrir modal de imagen (similar a la existente)
function openImageModal(src, title) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.95);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:10000;
    backdrop-filter:blur(8px);
  `;
  modal.innerHTML = `
    <div style="position:relative;max-width:90vw;max-height:90vh;display:flex;flex-direction:column;align-items:center;">
      <img src="${src}" alt="${title}" style="max-width:100%;max-height:85vh;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.6);">
      <p style="color:var(--dorado);margin-top:1rem;text-align:center;font-family:var(--fuente-titulo);letter-spacing:.08em;">${title}</p>
      <button onclick="this.closest('div').parentElement.remove()" style="position:absolute;top:1rem;right:1rem;width:40px;height:40px;border-radius:50%;background:var(--rojo);border:none;color:white;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">×</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Exportar la función para usar en el HTML
window.loadEventos = loadEventos;