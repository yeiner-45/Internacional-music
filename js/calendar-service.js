// Google Calendar Service

const API_KEY = 'AIzaSyDyaYUjcNuQMnJqUKs8Q2ZQKqG5Aqh2EHE';

const CALENDAR_ID = '80f4c17d72eb0d7cbccb2d3019eaf7d4b044555dc18dae53e9a695f3611b7cbe@group.calendar.google.com';

function loadGapi() {
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

function initClient() {
  return gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  }).then(() => {
    console.log('GAPI client loaded');
  });
}

async function listUpcomingEvents() {
  try {
    const response = await gapi.client.calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 5,
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

window.loadGapi = loadGapi;
window.listUpcomingEvents = listUpcomingEvents;