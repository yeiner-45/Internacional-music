import { createClient } from 'https://esm.sh/@sanity/client@6.15.11';

const client = createClient({
  projectId: 'mdx23ztw', // <--- USAMOS TU ID CORRECTO
  dataset: 'production',
  useCdn: true, 
  apiVersion: '2024-05-06', // Fecha de hoy
});

// Mapping de categorías a IDs de contenedores
const CATEGORY_CONTAINERS = {
  'dj': 'dj-container',
  'fotografia': 'foto-container',
  'show': 'show-container',
  'video': 'video-container'
};

// Función para cargar eventos desde Sanity - ÚNICA FUENTE DE DATOS
async function loadEventos() {
  try {
    console.log('[Sanity] Iniciando carga de eventos...');
    
    // GROQ Query mejorada con validaciones
    const query = `*[_type == "evento"]{
      titulo,
      categoria,
      "imagenUrl": imagenPrincipal.asset->url,
      "videoUrl": video.asset->url,
      descripcion
    }`;
    
    const eventos = await client.fetch(query);
    console.log('[Sanity] Eventos cargados:', eventos.length);

    // Limpiar todos los contenedores
    Object.values(CATEGORY_CONTAINERS).forEach(containerId => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      } else {
        console.warn(`[Sanity] Contenedor no encontrado: ${containerId}`);
      }
    });

    // Poblar contenedores según categoría
    eventos.forEach((evento, index) => {
      try {
        if (!evento.categoria || !CATEGORY_CONTAINERS[evento.categoria]) {
          console.warn(`[Sanity] Evento sin categoría válida (índice ${index}):`, evento);
          return;
        }

        const containerId = CATEGORY_CONTAINERS[evento.categoria];
        const container = document.getElementById(containerId);
        
        if (!container) {
          console.warn(`[Sanity] Contenedor no existe para categoría: ${evento.categoria}`);
          return;
        }

        // Determinar si es video o imagen
        const isVideo = evento.categoria === 'video' && evento.videoUrl;
        const mediaUrl = isVideo ? evento.videoUrl : evento.imagenUrl;

        if (!mediaUrl) {
          console.warn(`[Sanity] Evento sin URL de media (índice ${index}):`, evento.titulo);
          return;
        }

        const item = createPortfolioItem(evento, isVideo, mediaUrl);
        container.appendChild(item);
      } catch (error) {
        console.error(`[Sanity] Error procesando evento (índice ${index}):`, error);
      }
    });

    console.log('[Sanity] Carga completada exitosamente');
  } catch (error) {
    console.error('[Sanity] Error cargando eventos:', error);
  }
}

// Función para crear item del portafolio
function createPortfolioItem(evento, isVideo, mediaUrl) {
  const item = document.createElement('div');
  item.className = 'portfolio-item-card';
  item.style.cursor = 'pointer';

  // Crear elemento media
  let mediaElement = '';
  if (isVideo) {
    mediaElement = `
      <video class="portfolio-item-content" style="width:100%; height:100%; object-fit:cover;">
        <source src="${mediaUrl}" type="video/mp4">
      </video>
      <div style="position:absolute;display:flex;align-items:center;justify-content:center;font-size:2.5rem;color:var(--dorado);z-index:1;inset:0;">
        <i class="fas fa-play"></i>
      </div>
    `;
  } else {
    mediaElement = `<img class="portfolio-item-content" src="${mediaUrl}" alt="${evento.titulo}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">`;
  }

  item.innerHTML = `
    ${mediaElement}
    <div class="portfolio-item-info" style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(10,10,10,.88) 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.2rem;opacity:0;transition:opacity .35s ease;z-index:2;">
      <div class="portfolio-item-title" style="font-family:var(--fuente-titulo);font-size:1.1rem;color:var(--blanco);margin-bottom:.3rem;letter-spacing:.06em;">${evento.titulo || 'Sin título'}</div>
      <div class="portfolio-item-meta" style="font-size:.7rem;color:var(--texto-apagado);letter-spacing:.08em;">${evento.categoria.toUpperCase()}</div>
    </div>
  `;

  // Agregar evento de clic para abrir modal
  item.addEventListener('click', () => {
    if (isVideo) {
      openVideoModal(mediaUrl, evento.titulo);
    } else {
      openImageModal(mediaUrl, evento.titulo);
    }
  });

  // Agregar efecto hover
  item.addEventListener('mouseenter', () => {
    const info = item.querySelector('.portfolio-item-info');
    if (info) info.style.opacity = '1';
  });

  item.addEventListener('mouseleave', () => {
    const info = item.querySelector('.portfolio-item-info');
    if (info) info.style.opacity = '0';
  });

  return item;
}


// Función para abrir modal de imagen
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

// Función para abrir modal de video
function openVideoModal(src, title) {
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
    <div style="position:relative;width:90vw;max-width:1200px;display:flex;flex-direction:column;align-items:center;">
      <video controls style="width:100%;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.6);">
        <source src="${src}" type="video/mp4">
      </video>
      <p style="color:var(--dorado);margin-top:1rem;text-align:center;font-family:var(--fuente-titulo);letter-spacing:.08em;">${title}</p>
      <button onclick="this.closest('div').parentElement.remove()" style="position:absolute;top:1rem;right:1rem;width:40px;height:40px;border-radius:50%;background:var(--rojo);border:none;color:white;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">×</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Exportar funciones globalmente
window.loadEventos = loadEventos;
window.openImageModal = openImageModal;
window.openVideoModal = openVideoModal;