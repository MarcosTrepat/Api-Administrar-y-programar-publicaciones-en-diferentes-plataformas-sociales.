const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

const app = express();
app.use(bodyParser.json());

// Ruta al archivo datos.json
const dataPath = path.join(__dirname, 'datoscuen.json');

// Función para leer los datos desde el archivo
const leerDatos = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (error) {
    console.error("Error al leer el archivo datoscuen.json:", error.message);
    // Si el archivo no existe o hay un error, devolver datos vacíos
    return { cuentas: [], calendario: [], analisis: [], contenido: [] };
  }
};

// Inicializar los datos cargándolos desde el archivo
let data = leerDatos();

// Función para guardar los datos en el archivo
const guardarDatos = () => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Datos guardados correctamente.');
  } catch (error) {
    console.error('Error al guardar los datos:', error.message);
  }
};

// Función para generar un nuevo ID
const generarId = (coleccion) => {
  return data[coleccion].length > 0
    ? data[coleccion][data[coleccion].length - 1].id + 1
    : 1;
};

//--------------------CUENTAS----------------------------

// Rutas para gestionar las cuentas
app.get('/cuentas', (req, res) => {
  res.json(data.cuentas);
});

app.post('/cuentas', (req, res) => {
  const { usuario, contraseña, nombre, apellido, red_social, publicaciones } = req.body;

  if (!usuario || !contraseña || !nombre || !apellido || !red_social || publicaciones == null) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const nuevacuenta = {
    id: generarId('cuentas'),
    usuario,
    contraseña,
    nombre,
    apellido,
    red_social,
    publicaciones,
  };

  data.cuentas.push(nuevacuenta);
  guardarDatos();
  res.status(201).json(nuevacuenta);
});

app.delete('/cuentas/:id', (req, res) => {
  const cuentasId = parseInt(req.params.id);
  data.cuentas = data.cuentas.filter((p) => p.id !== cuentasId);
  guardarDatos();
  res.json({ message: 'Cuenta eliminada' });
});

//------------------ Calendario ------------------

app.get('/calendario', (req, res) => {
  res.json(data.calendario);
});

app.post('/calendario', (req, res) => {
  const { fecha, hora, frecuencia } = req.body;

  if (!fecha || !hora || !frecuencia) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const nuevocalendario = {
    id: generarId('calendario'),
    fecha,
    hora,
    frecuencia,
  };

  data.calendario.push(nuevocalendario);
  guardarDatos();
  res.status(201).json(nuevocalendario);
});

app.delete('/calendario/:id', (req, res) => {
  const calendarioId = parseInt(req.params.id);
  data.calendario = data.calendario.filter((e) => e.id !== calendarioId);
  guardarDatos();
  res.json({ message: 'Calendario eliminado' });
});

//------------------ Análisis ------------------

app.get('/analisis', (req, res) => {
  res.json(data.analisis);
});

app.post('/analisis', (req, res) => {
  const { id_publicacion, likes, comentarios, compartidos, estado } = req.body;

  if (!id_publicacion || !likes || !comentarios || !compartidos) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const nuevoanalisis = {
    id: generarId('analisis'),
    id_publicacion,
    likes,
    comentarios,
    compartidos,
    estado: estado || 'en curso',
  };

  data.analisis.push(nuevoanalisis);
  guardarDatos();
  res.status(201).json(nuevoanalisis);
});

app.delete('/analisis/:id', (req, res) => {
  const analisisId = parseInt(req.params.id);
  data.analisis = data.analisis.filter((l) => l.id !== analisisId);
  guardarDatos();
  res.json({ message: 'Análisis eliminado' });
});

//------------------ Contenido ------------------

app.get('/contenido', (req, res) => {
  res.json(data.contenido);
});

app.post('/contenido', (req, res) => {
  const { contenidoId, texto, video, estado } = req.body;

  if (!contenidoId || texto == null || video == null) {
    return res.status(400).json({ error: 'El contenidoId, texto y video son obligatorios' });
  }

  const nuevocontenido = {
    id: generarId('contenido'),
    contenidoId,
    texto,
    video,
    estado: estado || 'pendiente',
  };

  data.contenido.push(nuevocontenido);
  guardarDatos();
  res.status(201).json(nuevocontenido);
});

app.delete('/contenido/:id', (req, res) => {
  const ordenId = parseInt(req.params.id);
  data.contenido = data.contenido.filter((o) => o.id !== ordenId);
  guardarDatos();
  res.json({ message: 'contenido eliminada' });
});

// Actualizar estado de contenido
app.patch('/contenido/:id', (req, res) => {
  const linea = data.contenido.find(
    (l) => l.id === parseInt(req.params.id)
  );
  if (!linea) {
    return res.status(404).json({ error: 'Contenido no encontrado' });
  }
  linea.estado = req.body.estado || linea.estado;
  guardarDatos();
  res.json(linea);
});

// Actualizar estado de análisis
app.patch('/analisis/:id', (req, res) => {
  const orden = data.analisis.find(
    (o) => o.id === parseInt(req.params.id)
  );
  if (!orden) {
    return res.status(404).json({ error: 'Análisis no encontrado' });
  }
  orden.estado = req.body.estado || orden.estado;
  guardarDatos();
  res.json(orden);
});

/** Inicio del servidor */
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});