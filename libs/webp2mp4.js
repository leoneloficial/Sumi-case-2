const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

async function webp2png(buffer) {
  const form = new FormData();
  form.append('file', buffer, 'image.webp');

  const response = await axios.post('https://api.lolhuman.xyz/api/convert/webp2png', form, {
    headers: {
      ...form.getHeaders()
    }
  });

  if (!response.data.result) throw new Error('No se pudo convertir la imagen.');
  return response.data.result.link || response.data.result;
}

module.exports = { webp2png };
