const express = require('express');
const app = express();

const port = 3000;

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.post("/subir" , (req, res) =>{
    const data = req.body.data;
    res.send(data);
});
