import { createClient } from 'https://esm.sh/@sanity/client@6.15.11';

const client = createClient({
  projectId: 'xpeoe7sp',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2026-05-21',
});

const CATEGORY_CONTAINERS = {
  dj: 'dj-container',
  fotografia: 'foto-container',
  show: 'show-container',
  video: 'video-container',
};

let galleryLoaded = false;

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

function clearContainers() {
  Object.values(CATEGORY_CONTAINERS).forEach((containerId) => {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '';
  });

  const clientesContainer = document.getElementById('clientes-folders');
  if (clientesContainer) clientesContainer.innerHTML = '';
}

function appendEmptyState(container, message) {
  if (!container) return;
  const empty = document.createElement('div');
  empty.className = 'portfolio-empty-state';
  empty.textContent = message;
  container.appendChild(empty);
}

async function loadEventos() {
  if (galleryLoaded) return;
  galleryLoaded = true;

  try {
    clearContainers();

    const [eventos, albumes] = await Promise.all([
      client.fetch(`*[_type == "evento"] | order(fechaEvento desc){
        titulo,
        categoria,
        "imagenUrl": imagenPrincipal.asset->url,
        "videoUrl": videoPrincipal.asset->url,
        fechaEvento
      }`),
      client.fetch(`*[_type == "albumCliente" && publicado != false] | order(fechaEvento desc){
        titulo,
        cliente,
        categoria,
        fechaEvento,
        "portadaUrl": portada.asset->url,
        medios[]{
          _type,
          "url": asset->url
        }
      }`),
    ]);

    renderEventos(eventos);
    renderAlbumes(albumes);
    window.showPortfolioView?.('todos');

    console.log(`[Sanity Gallery] ${eventos.length} trabajos y ${albumes.length} carpetas cargadas`);
  } catch (error) {
    galleryLoaded = false;
    console.error('[Sanity Gallery] Error cargando contenido:', error);
  }
}

function renderEventos(eventos) {
  const categoryCounts = {};

  eventos.forEach((evento) => {
    const containerId = CATEGORY_CONTAINERS[evento.categoria];
    const container = containerId ? document.getElementById(containerId) : null;
    if (!container) return;

    const isVideo = evento.categoria === 'video' && evento.videoUrl;
    const mediaUrl = isVideo ? evento.videoUrl : evento.imagenUrl;
    if (!mediaUrl) return;

    container.appendChild(createPortfolioItem(evento, isVideo, mediaUrl));
    categoryCounts[evento.categoria] = (categoryCounts[evento.categoria] || 0) + 1;
  });

  Object.entries(CATEGORY_CONTAINERS).forEach(([category, containerId]) => {
    const container = document.getElementById(containerId);
    if (container && !categoryCounts[category]) {
      appendEmptyState(container, 'Contenido en preparacion.');
    }
  });
}

function renderAlbumes(albumes) {
  const container = document.getElementById('clientes-folders');
  if (!container) return;

  if (!albumes.length) {
    appendEmptyState(container, 'Carpetas de clientes en preparacion.');
    return;
  }

  albumes.forEach((album) => {
    if (!album.portadaUrl) return;
    container.appendChild(createAlbumCard(album));
  });
}

function createPortfolioItem(evento, isVideo, mediaUrl) {
  const item = document.createElement('div');
  item.className = 'portfolio-item-card';

  const title = evento.titulo || 'Sin titulo';
  const safeTitle = escapeHtml(title);
  const meta = [evento.categoria?.toUpperCase(), formatDate(evento.fechaEvento)].filter(Boolean).join(' / ');

  item.innerHTML = `
    ${isVideo ? createVideoPreview(mediaUrl) : `<img class="portfolio-item-content" src="${escapeHtml(mediaUrl)}" alt="${safeTitle}" loading="lazy">`}
    <div class="portfolio-item-info">
      <div class="portfolio-item-title">${safeTitle}</div>
      <div class="portfolio-item-meta">${escapeHtml(meta)}</div>
    </div>
  `;

  item.addEventListener('click', () => {
    if (isVideo) openVideoModal(mediaUrl, title);
    else openImageModal(mediaUrl, title);
  });

  return item;
}

function createAlbumCard(album) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'portfolio-item-card album-folder-card';

  const title = album.titulo || 'Carpeta sin titulo';
  const safeTitle = escapeHtml(title);
  const count = Array.isArray(album.medios) ? album.medios.filter((item) => item?.url).length : 0;
  const meta = [album.cliente, formatDate(album.fechaEvento), `${count} archivo${count === 1 ? '' : 's'}`]
    .filter(Boolean)
    .join(' / ');

  card.innerHTML = `
    <img class="portfolio-item-content" src="${escapeHtml(album.portadaUrl)}" alt="${safeTitle}" loading="lazy">
    <div class="portfolio-item-info">
      <div class="portfolio-item-title">${safeTitle}</div>
      <div class="portfolio-item-meta">${escapeHtml(meta)}</div>
    </div>
  `;

  card.addEventListener('click', () => openAlbumModal(album));
  return card;
}

function createVideoPreview(src) {
  return `
    <video class="portfolio-item-content" muted playsinline preload="metadata">
      <source src="${escapeHtml(src)}">
    </video>
    <div class="portfolio-play-icon"><i class="fas fa-play"></i></div>
  `;
}

function createModal(title, content) {
  const modal = document.createElement('div');
  modal.className = 'media-modal';
  modal.innerHTML = `
    <div class="media-modal-inner">
      ${content}
      <p class="media-modal-title">${escapeHtml(title || '')}</p>
      <button type="button" class="media-modal-close" aria-label="Cerrar">x</button>
    </div>
  `;

  modal.querySelector('.media-modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.remove();
  });
  document.body.appendChild(modal);
}

function openImageModal(src, title) {
  createModal(title, `<img src="${escapeHtml(src)}" alt="${escapeHtml(title || '')}" class="media-modal-image">`);
}

function openVideoModal(src, title) {
  createModal(title, `
    <video controls autoplay class="media-modal-video">
      <source src="${escapeHtml(src)}">
    </video>
  `);
}

function openAlbumModal(album) {
  const media = Array.isArray(album.medios) ? album.medios.filter((item) => item?.url) : [];
  const content = media.length
    ? `<div class="album-modal-grid">
        ${media.map((item) => {
          const isVideo = item._type === 'file' || item._type === 'video' || /\.(mp4|webm|mov|m4v)$/i.test(item.url);
          return `
            <button type="button" class="album-modal-item" data-url="${escapeHtml(item.url)}" data-type="${isVideo ? 'video' : 'image'}">
              ${isVideo ? createVideoPreview(item.url) : `<img src="${escapeHtml(item.url)}" alt="${escapeHtml(album.titulo || '')}" loading="lazy">`}
            </button>
          `;
        }).join('')}
      </div>`
    : '<div class="portfolio-empty-state">Esta carpeta aun no tiene archivos publicados.</div>';

  createModal(album.titulo, content);

  const modal = document.querySelector('.media-modal:last-child');
  modal?.querySelectorAll('.album-modal-item').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const url = button.getAttribute('data-url');
      const type = button.getAttribute('data-type');
      modal.remove();
      if (type === 'video') openVideoModal(url, album.titulo);
      else openImageModal(url, album.titulo);
    });
  });
}

window.loadEventos = loadEventos;
window.openImageModal = openImageModal;
window.openVideoModal = openVideoModal;

document.addEventListener('DOMContentLoaded', loadEventos);
