const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

const filePath = path.join(__dirname, 'datoscalendario.json');

// Ruta para obtener todos los eventos del calendario
app.get('/calendario', (req, res) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo de calendario:', err);
      return res.status(500).send('Error al leer la base de datos.');
    }

    try {
      const db = JSON.parse(data);
      res.json(db.calendario || []);
    } catch (parseErr) {
      console.error('Error al parsear el archivo JSON:', parseErr);
      res.status(500).send('Error al procesar la base de datos.');
    }
  });
});

// Ruta para agregar un nuevo evento al calendario
app.post('/calendario', (req, res) => {
  const { id_usuario, fecha, hora, frecuencia } = req.body;

  if (!id_usuario || !fecha || !hora || !frecuencia) {
    return res.status(400).send('Todos los campos son obligatorios.');
  }

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo de calendario:', err);
      return res.status(500).send('Error al leer la base de datos.');
    }

    try {
      const db = JSON.parse(data);
      const newEvent = {
        id: db.calendario.length + 1, // Generar un ID único para el evento
        id_usuario,
        fecha,
        hora,
        frecuencia,
      };

      db.calendario = db.calendario || []; // Asegurar que "calendario" exista
      db.calendario.push(newEvent);

      fs.writeFile(filePath, JSON.stringify(db, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error al guardar el archivo de calendario:', writeErr);
          return res.status(500).send('Error al guardar los datos.');
        }

        res.status(201).json(newEvent);
      });
    } catch (parseErr) {
      console.error('Error al parsear el archivo JSON:', parseErr);
      res.status(500).send('Error al procesar la base de datos.');
    }
  });
});

// Ruta para eliminar un evento del calendario por ID
app.delete('/calendario/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('ID inválido.');
  }

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo de calendario:', err);
      return res.status(500).send('Error al leer la base de datos.');
    }

    try {
      const db = JSON.parse(data);
      const eventIndex = db.calendario.findIndex((event) => event.id === id);

      if (eventIndex === -1) {
        return res.status(404).send('Evento no encontrado.');
      }

      db.calendario.splice(eventIndex, 1);

      fs.writeFile(filePath, JSON.stringify(db, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error al guardar el archivo de calendario:', writeErr);
          return res.status(500).send('Error al guardar los datos.');
        }

        res.status(200).send('Evento eliminado correctamente.');
      });
    } catch (parseErr) {
      console.error('Error al parsear el archivo JSON:', parseErr);
      res.status(500).send('Error al procesar la base de datos.');
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
