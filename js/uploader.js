export function setupAlbumUploader() {
  const statusMessage = document.getElementById('statusMessage');
  if (!statusMessage) return;

  statusMessage.style.display = 'block';
  statusMessage.textContent = 'La carga de albumes ahora se gestiona desde Sanity Studio.';
}
