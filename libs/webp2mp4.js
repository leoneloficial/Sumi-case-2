const fetch = require('node-fetch');
const { FormData, Blob } = require('formdata-node');
const { JSDOM } = require('jsdom');

/**
 * Convierte un archivo .webp en un video .mp4 usando ezgif.com
 * @param {Buffer|string} source Buffer o URL de imagen .webp
 * @returns {Promise<string>} URL del .mp4 convertido
 */
const webpToMp4 = async (source) => {
  try {
    const isUrl = typeof source === 'string' && /^https?:\/\//.test(source);
    const form = new FormData();
    const blob = !isUrl && new Blob([source.toArrayBuffer()]);
    form.append('new-image-url', isUrl ? source : '');
    form.append('new-image', isUrl ? '' : blob, 'image.webp');

    const res = await fetch('https://ezgif.com/webp-to-mp4', {
      method: 'POST',
      body: form
    });

    const html = await res.text();
    const { document } = new JSDOM(html).window;

    const form2 = new FormData();
    for (const input of document.querySelectorAll('form input[name]')) {
      form2.append(input.name, input.value);
    }

    const file = document.querySelector('form input[name="file"]')?.value;
    const res2 = await fetch(`https://ezgif.com/webp-to-mp4/${file}`, {
      method: 'POST',
      body: form2
    });

    const html2 = await res2.text();
    const { document: document2 } = new JSDOM(html2).window;

    const videoSrc = document2.querySelector('div#output > p.outfile > video > source')?.src;
    if (!videoSrc) throw new Error('No se encontró el video convertido');

    return new URL(videoSrc, res2.url).toString();
  } catch (err) {
    throw new Error(`❌ Error al convertir webp a mp4: ${err.message}`);
  }
};

/**
 * Convierte un archivo .webp en una imagen .png usando ezgif.com
 * @param {Buffer|string} source Buffer o URL de imagen .webp
 * @returns {Promise<string>} URL de la imagen .png convertida
 */
const webpToPng = async (source) => {
  try {
    const isUrl = typeof source === 'string' && /^https?:\/\//.test(source);
    const form = new FormData();
    const blob = !isUrl && new Blob([source.toArrayBuffer()]);
    form.append('new-image-url', isUrl ? source : '');
    form.append('new-image', isUrl ? '' : blob, 'image.webp');

    const res = await fetch('https://ezgif.com/webp-to-png', {
      method: 'POST',
      body: form
    });

    const html = await res.text();
    const { document } = new JSDOM(html).window;

    const form2 = new FormData();
    for (const input of document.querySelectorAll('form input[name]')) {
      form2.append(input.name, input.value);
    }

    const file = document.querySelector('form input[name="file"]')?.value;
    const res2 = await fetch(`https://ezgif.com/webp-to-png/${file}`, {
      method: 'POST',
      body: form2
    });

    const html2 = await res2.text();
    const { document: document2 } = new JSDOM(html2).window;

    const imgSrc = document2.querySelector('div#output > p.outfile > img')?.src;
    if (!imgSrc) throw new Error('No se encontró la imagen convertida');

    return new URL(imgSrc, res2.url).toString();
  } catch (err) {
    throw new Error(`❌ Error al convertir webp a png: ${err.message}`);
  }
};

module.exports = {
  webpToMp4,
  webpToPng
};
