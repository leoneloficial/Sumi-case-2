const fetch = require('node-fetch');
const { FormData, Blob } = require('formdata-node');
const { fileTypeFromBuffer } = require('file-type');

/**
 * Sube un archivo a qu.ax
 * Mimetypes soportados:
 * - image/jpeg, image/jpg, image/png
 * - video/mp4, video/webm
 * - audio/mpeg, audio/wav
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
const uploadToQuax = async (buffer) => {
  try {
    const { ext, mime } = await fileTypeFromBuffer(buffer);
    if (!ext || !mime) throw new Error('Tipo de archivo no soportado');

    const form = new FormData();
    const blob = new Blob([buffer.toArrayBuffer()], { type: mime });
    form.append('files[]', blob, `tmp.${ext}`);

    const res = await fetch('https://qu.ax/upload.php', {
      method: 'POST',
      body: form,
    });

    const result = await res.json();

    if (result && result.success) {
      return result.files[0].url;
    } else {
      throw new Error(result?.error || 'Falló la subida a qu.ax');
    }
  } catch (err) {
    throw new Error(`❌ Error al subir a qu.ax: ${err.message}`);
  }
};

module.exports = uploadToQuax;
