const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
app.use(express.json());

app.get('/cuentas', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer la base de datos.');
    }
    const db = JSON.parse(data);
    res.json(db.cuentas);
  });
});

app.post('/cuentas', (req, res) => {
  const { usuario, contraseña, nombre, apellido, red_social } = req.body;
  
  fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer la base de datos.');
    }
    
    const db = JSON.parse(data);
    const newAccount = {
      id: db.cuentas.length + 1,
      usuario,
      contraseña,
      nombre,
      apellido,
      red_social,
      publicaciones: []
    };
    
    db.cuentas.push(newAccount);
    
    fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error al guardar los datos.');
      }
      res.status(201).json(newAccount);
    });
  });
});

app.get('/publicaciones/:usuarioId', (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId);
  
  fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer la base de datos.');
    }
    
    const db = JSON.parse(data);
    const publicaciones = db.publicaciones.filter(p => p.id === usuarioId);
    
    res.json(publicaciones);
  });
});

app.get('/calendario', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer la base de datos.');
    }
    const db = JSON.parse(data);
    res.json(db.calendario);
  });
});

app.post('/publicaciones', (req, res) => {
  const { contenido, fecha_publicacion, frecuencia, contenido_multimedia, analisis_rendimiento } = req.body;
  
  fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer la base de datos.');
    }

    const db = JSON.parse(data);
    const newPublication = {
      id: db.publicaciones.length + 1,
      contenido,
      fecha_publicacion,
      frecuencia,
      contenido_multimedia,
      analisis_rendimiento
    };
    
    db.publicaciones.push(newPublication);
    
    fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error al guardar la publicación.');
      }
      res.status(201).json(newPublication);
    });
  });
});


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
