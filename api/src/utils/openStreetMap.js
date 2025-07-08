const axios = require("axios");

async function geocodeAddress(address) {
    const url = 'https://nominatim.openstreetmap.org/search';
    const params = {
        q: address,
        format: 'json',
        limit: 1
    };

    const res = await axios.get(url, { params });
    const data = res.data;

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`Indirizzo non trovato: ${address}`);
    }

    return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
    };
}

async function getRouteDistance(from, to, profile = 'driving') {
    const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
    const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}`;
    const params = { overview: 'false' };

    const res = await axios.get(url, { params });
    const body = res.data;

    if (body.code !== 'Ok' || !Array.isArray(body.routes) || body.routes.length === 0) {
        throw new Error(`Routing fallito: ${body.message || 'nessun percorso trovato'}`);
    }

    // ritorna il tempo di percorrenza in secondi
    return body.routes[0].duration;
}

module.exports = {
    geocodeAddress,
    getRouteDistance
};