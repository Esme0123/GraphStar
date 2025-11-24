const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = express();
app.use(express.json({ limit: '15mb' }));

const MATLAB_CMD = process.env.MATLAB_CMD || 'matlab';

const buildLaunchCommand = (extraArgs = '') => {
  const args = extraArgs.trim();
  if (process.platform === 'win32') {
    return args ? `start "" ${MATLAB_CMD} ${args}` : `start "" ${MATLAB_CMD}`;
  }
  return args ? `${MATLAB_CMD} ${args} &` : `${MATLAB_CMD} &`;
};

const launchMatlab = (extraArgs, res) => {
  const command = buildLaunchCommand(extraArgs);
  exec(command, (error) => {
    if (error) {
      console.error('No se pudo ejecutar MATLAB:', error);
      res.status(500).json({ message: 'No se pudo abrir MATLAB', detail: error.message });
      return;
    }
    res.json({ message: 'MATLAB iniciado' });
  });
};

app.post('/api/matlab/open', (_req, res) => {
  launchMatlab('', res);
});

app.get('/abrir-matlab', (_req, res) => {
  launchMatlab('', res);
});

app.post('/api/matlab/open-fuzzy', (_req, res) => {
  launchMatlab('-r "fuzzy"', res);
});

app.get('/abrir-matlab-fuzzy', (_req, res) => {
  launchMatlab('-r "fuzzy"', res);
});

app.get('/abrir-fuzzy', (req, res) => {
  const nombreArchivo = req.query.nombre || 'controlador.fis';
  console.log(`Abriendo Fuzzy Designer con: ${nombreArchivo}`);

  const rutaCompleta = path.join(__dirname, nombreArchivo);
  const rutaNormalizada = rutaCompleta.replace(/\\/g, '/').replace(/'/g, "''");
  const args = `-r "fuzzy('${rutaNormalizada}');"`;

  launchMatlab(args, res);
});

app.post('/api/matlab/open-fis', (req, res) => {
  const { name, data } = req.body || {};

  if (!data) {
    res.status(400).json({ message: 'Archivo .fis faltante' });
    return;
  }

  const buffer = Buffer.from(data, 'base64');
  const safeName = (name && name.endsWith('.fis') ? name : `fuzzy-${Date.now()}.fis`).replace(/[^a-zA-Z0-9_.-]/g, '');
  const tmpPath = path.join(os.tmpdir(), safeName || `fuzzy-${Date.now()}.fis`);

  fs.writeFile(tmpPath, buffer, (err) => {
    if (err) {
      console.error('No se pudo guardar el archivo .fis:', err);
      res.status(500).json({ message: 'No se pudo guardar el archivo .fis' });
      return;
    }

    const escapedPath = tmpPath.replace(/\\/g, '\\\\').replace(/'/g, "''");
    const args = `-r "fuzzy('${escapedPath}')"`;
    launchMatlab(args, res);
  });
});

// Se mantiene como POST para recibir el contenido del .fis
app.post('/abrir-fis', (req, res) => {
  const { name, data } = req.body || {};

  if (!data) {
    res.status(400).json({ message: 'Archivo .fis faltante' });
    return;
  }

  const buffer = Buffer.from(data, 'base64');
  const safeName = (name && name.endsWith('.fis') ? name : `fuzzy-${Date.now()}.fis`).replace(/[^a-zA-Z0-9_.-]/g, '');
  const tmpPath = path.join(os.tmpdir(), safeName || `fuzzy-${Date.now()}.fis`);

  fs.writeFile(tmpPath, buffer, (err) => {
    if (err) {
      console.error('No se pudo guardar el archivo .fis:', err);
      res.status(500).json({ message: 'No se pudo guardar el archivo .fis' });
      return;
    }

    const escapedPath = tmpPath.replace(/\\/g, '\\\\').replace(/'/g, "''");
    const args = `-r "fuzzy('${escapedPath}')"`;
    launchMatlab(args, res);
  });
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor MATLAB escuchando en http://localhost:${PORT}`);
});
