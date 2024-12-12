const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

// Ruta para obtener todas las cuentas
app.get('/cuentas', (req, res) => {
  const filePath = path.join(__dirname, 'datoscuen.json');

  fs.readFile(filePath, 'utf-8', (err, datacuen) => {
    if (err) {
      return res.status(500).send('Error al leer la base de datos.');
    }
    try {
      const db = JSON.parse(datacuen);
      res.json(db.cuentas || []);
    } catch (parseErr) {
      console.error('Error al parsear el archivo JSON:', parseErr);
      res.status(500).send('Error al procesar la base de datos.');
    }
  });
});

// Ruta para agregar una nueva cuenta
app.post('/cuentas', (req, res) => {
  const { usuario, contraseña, nombre, apellido, red_social } = req.body;

  if (!usuario || !contraseña || !nombre || !apellido || !red_social) {
    return res.status(400).send('Todos los campos son obligatorios.');
  }

  const filePath = path.join(__dirname, 'datoscuen.json');

  fs.readFile(filePath, 'utf-8', (err, datacuen) => {
    if (err) {
      return res.status(500).send('Error al leer la base de datos.');
    }

    try {
      const db = JSON.parse(datacuen);
      // Asignar un nuevo id basado en el tamaño actual del array
      const newAccount = {
        id: db.cuentas.length + 1,  // Se genera un ID único
        usuario,
        contraseña,
        nombre,
        apellido,
        red_social,
        publicaciones: [],
      };

      db.cuentas.push(newAccount);

      fs.writeFile(filePath, JSON.stringify(db, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).send('Error al guardar los datos.');
        }
        res.status(201).json(newAccount);
      });
    } catch (parseErr) {
      console.error('Error al parsear el archivo JSON:', parseErr);
      res.status(500).send('Error al procesar la base de datos.');
    }
  });
});

// Ruta para eliminar una cuenta (usando el parámetro id en la URL)
app.delete('/cuentas/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('ID inválido.');
  }

  const filePath = path.join(__dirname, 'datoscuen.json');

  fs.readFile(filePath, 'utf-8', (err, datacuen) => {
    if (err) {
      return res.status(500).send('Error al leer la base de datos.');
    }

    try {
      const db = JSON.parse(datacuen);
      const index = db.cuentas.findIndex((account) => account.id === id);

      if (index === -1) {
        return res.status(404).send('Cuenta no encontrada.');
      }

      db.cuentas.splice(index, 1);

      fs.writeFile(filePath, JSON.stringify(db, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).send('Error al guardar los datos.');
        }
        res.status(200).send('Cuenta eliminada correctamente.');
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
