const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function uploadImage(buffer, filename = 'temp.jpg') {
  const form = new FormData();
  form.append('file', buffer, filename);

  const res = await axios.post('https://telegra.ph/upload', form, {
    headers: form.getHeaders(),
  });

  if (res.data.error) throw new Error(res.data.error);
  return 'https://telegra.ph' + res.data[0].src;
}

module.exports = uploadImage;
