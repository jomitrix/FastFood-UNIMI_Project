async function getRouteDistance(from, to, profile = 'driving') {
  // OSRM si aspetta “lon,lat;lon,lat”
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const baseUrl = `https://router.project-osrm.org/route/v1/${profile}/${coords}`;
  const url = new URL(baseUrl);
  url.searchParams.set('overview', 'false');

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Routing fallito: HTTP ${res.status}`);
  }

  const body = await res.json();
  if (body.code !== 'Ok' || !Array.isArray(body.routes) || body.routes.length === 0) {
    throw new Error(`Routing fallito: ${body.message || 'nessun percorso trovato'}`);
  }

  // ritorna il tempo di percorrenza in secondi
  return body.routes[0].duration;

  // per distanza (in metri) invece di durata:
  // return body.routes[0].distance;
}

module.exports = {
  getRouteDistance
};