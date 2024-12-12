const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
app.use(express.json());


app.get('/publicaciones', (req, res) => {
    const usuarioId = parseInt(req.params.usuarioId);

    fs.readFile(path.join(__dirname, 'datapublicaciones.json'), 'utf-8', (err, datapublicaciones) => {
      if (err) {
        return res.status(500).send('Error al leer la base de datos.');
      }

      const db = JSON.parse(datapublicaciones);
      const publicaciones = db.publicaciones.filter(p => p.id === usuarioId);

      if (publicaciones.length === 0) {
        return res.status(404).send('Publicaciones no encontradas.');
      }
      
      res.json(publicaciones);
    });
});


app.post('/publicaciones', (req, res) => {
    const { contenido, fecha_publicacion, frecuencia, contenido_multimedia, analisis_rendimiento } = req.body;

    fs.readFile(path.join(__dirname, 'datapublicaciones.json'), 'utf-8', (err, datapublicaciones) => {
      if (err) {
        return res.status(500).send('Error al leer la base de datos.');
      }

      const db = JSON.parse(datapublicaciones);
      const newPublication = {
        id: db.publicaciones,  
        contenido,
        fecha_publicacion,
        frecuencia,
        contenido_multimedia,
        analisis_rendimiento
      };

      db.publicaciones.push(newPublication);

      // Guardar los cambios en el archivo 'datapublicaciones.json'
      fs.writeFile(path.join(__dirname, 'datapublicaciones.json'), JSON.stringify(db, null, 2), (err) => {
        if (err) {
          return res.status(500).send('Error al guardar la publicación.');
        }
        res.status(201).json(newPublication); // Devolver la nueva publicación con código 201
      });
    });
});

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});