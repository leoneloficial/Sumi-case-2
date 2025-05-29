const fetch = require('node-fetch');
const { FormData, Blob } = require('formdata-node');
const { fileTypeFromBuffer } = require('file-type');

/**
 * Sube un archivo a file.io (expira en 1 día, máx 100MB)
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
const uploadToFileIO = async (buffer) => {
  const { ext, mime } = await fileTypeFromBuffer(buffer) || {};
  const form = new FormData();
  const blob = new Blob([buffer.toArrayBuffer()], { type: mime });
  form.append('file', blob, 'tmp.' + ext);

  const res = await fetch('https://file.io/?expires=1d', {
    method: 'POST',
    body: form,
  });

  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Error al subir a file.io');
  return json.link;
};

/**
 * Sube uno o varios archivos a storage.restfulapi.my.id
 * @param {Buffer|Buffer[]} input
 * @returns {Promise<string|string[]>}
 */
const uploadToRESTfulAPI = async (input) => {
  const form = new FormData();
  const buffers = Array.isArray(input) ? input : [input];

  for (const buffer of buffers) {
    const blob = new Blob([buffer.toArrayBuffer()]);
    form.append('file', blob);
  }

  const res = await fetch('https://storage.restfulapi.my.id/upload', {
    method: 'POST',
    body: form,
  });

  let text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    throw new Error('Respuesta inválida de RESTfulAPI');
  }

  if (!json?.files?.length) throw new Error('No se recibieron archivos subidos');
  return Array.isArray(input) ? json.files.map(f => f.url) : json.files[0].url;
};

/**
 * Intenta subir un archivo a múltiples servicios en orden
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
const uploadFile = async (buffer) => {
  let lastError;
  for (const method of [uploadToRESTfulAPI, uploadToFileIO]) {
    try {
      return await method(buffer);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
};

module.exports = {
  uploadToFileIO,
  uploadToRESTfulAPI,
  uploadFile
};
