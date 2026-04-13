// Google Calendar Service

// API Key para Google Calendar API - Proyecto Internacional Music
const API_KEY = 'AIzaSyAqZ-t0Pt-_bOiBChD7VR9GGyRliEw5miI';

const CALENDAR_ID = '80f4c17d72eb0d7cbccb2d3019eaf7d4b044555dc18dae53e9a695f3611b7cbe@group.calendar.google.com';

/**
 * Load Google API client
 * @returns {Promise} Resolves when GAPI is loaded
 */
export function loadGapi() {
  return new Promise((resolve, reject) => {
    gapi.load('client', async () => {
      try {
        await initClient();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Initialize Google API client
 * @returns {Promise} Resolves when client is initialized
 */
function initClient() {
  return gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  }).then(() => {
    console.log('GAPI client loaded');
  });
}

/**
 * List upcoming events from Google Calendar
 * @returns {Promise<Array>} Array of formatted events for FullCalendar
 */
export async function listUpcomingEvents() {
  try {
    // Control de flujo: verificar que gapi.client.calendar esté disponible
    if (!gapi || !gapi.client || !gapi.client.calendar) {
      console.warn('Google Calendar API no está disponible. Esperando inicialización...');
      return [];
    }

    const response = await gapi.client.calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime',
    });

    console.log('Estructura de respuesta:', response);

    const events = response?.result?.items ? response.result.items : [];
    console.log('Eventos recibidos:', events);

    // Formato compatible con FullCalendar
    const formatted = events.map(item => ({
      title: '📅 Fecha Reservada',
      start: item.start?.dateTime || item.start?.date || null,
      end: item.end?.dateTime || item.end?.date || null,
      extendedProps: {
        original: item,
      },
    }));

    return formatted;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Legacy global exports for backward compatibility
window.loadGapi = loadGapi;
window.listUpcomingEvents = listUpcomingEvents;