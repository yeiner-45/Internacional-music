import { db, storage } from './firebase-config.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';

export function setupAlbumUploader() {
  const albumForm = document.getElementById('albumForm');
  const fileInput = document.getElementById('fileInput');
  const dragDropArea = document.getElementById('dragDropArea');
  const thumbnails = document.getElementById('thumbnails');
  const progressBar = document.getElementById('progressBar');
  const statusMessage = document.getElementById('statusMessage');

  let files = [];

  const updateThumbnailView = () => {
    thumbnails.innerHTML = '';
    files.forEach((file, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'thumb-item';
      thumb.innerHTML = `
        <img src="${URL.createObjectURL(file)}" alt="${file.name}">
        <div class="thumb-name">${file.name}</div>
        <button type="button" style="background:transparent;border:none;color:var(--rojo);cursor:pointer;font-size:.68rem;">Quitar</button>
      `;
      thumb.querySelector('button').addEventListener('click', () => {
        files.splice(index, 1);
        updateThumbnailView();
      });
      thumbnails.appendChild(thumb);
    });
  };

  const setProgress = (value) => {
    progressBar.style.width = `${value}%`;    
  };

  const showStatus = (message, isError = false) => {
    statusMessage.style.display = 'block';
    statusMessage.textContent = message;
    statusMessage.style.color = 'var(--rojo)';
    statusMessage.style.background = 'rgba(255,0,0,.08)';
    statusMessage.style.borderColor = 'rgba(255,0,0,.35)';
  };

  const clearStatus = () => {
    statusMessage.style.display = 'none';
    statusMessage.textContent = '';
  };

  const addFiles = (newFiles) => {
    files = [...files, ...newFiles];
    updateThumbnailView();
  };

  dragDropArea.addEventListener('click', () => fileInput.click());

  dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.classList.add('dragover');
  });

  dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.classList.remove('dragover');
  });

  dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('dragover');
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    addFiles(droppedFiles);
  });

  fileInput.addEventListener('change', (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    addFiles(selectedFiles);
  });

  albumForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!files.length) {
      showStatus('Seleccione al menos una imagen para continuar.', true);
      return;
    }

    clearStatus();
    setProgress(0);

    const eventName = document.getElementById('eventName').value.trim();
    const category = document.getElementById('category').value;
    const eventDate = document.getElementById('eventDate').value;

    if (!eventName || !category || !eventDate) {
      showStatus('Complete todos los campos antes de guardar.', true);
      return;
    }

    const safeEventName = eventName.replace(/[^a-zA-Z0-9\-\_ ]/g, '').replace(/\s+/g, '_');

    let uploadedUrls = [];
    let totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    let transferredBytes = 0;

    for (const file of files) {
      const fileRef = ref(storage, `albums/${safeEventName}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on('state_changed', (snapshot) => {
          transferredBytes = totalBytes - files.slice(files.indexOf(file)+1).reduce((sum, f) => sum + f.size, 0) - (snapshot.totalBytes - snapshot.bytesTransferred);
          const totalProgress = Math.floor(((transferredBytes + snapshot.bytesTransferred) / totalBytes) * 100);
          setProgress(totalProgress);
        }, (error) => {
          reject(error);
        }, async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          uploadedUrls.push(url);
          resolve();
        });
      });
    }

    try {
      await addDoc(collection(db, 'albumes'), {
        title: eventName,
        date: eventDate,
        category,
        photos: uploadedUrls,
        createdAt: new Date()
      });

      showStatus('Álbum guardado exitosamente.', false);
      albumForm.reset();
      files = [];
      updateThumbnailView();
      setProgress(0);
    } catch (error) {
      console.error(error);
      showStatus('Error al guardar álbum en Firestore. Intenta nuevamente.', true);
    }
  });
}
