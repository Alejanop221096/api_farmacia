const express = require('express');
const path = require('path');
const cors = require('cors'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares globales (CORS y lectura de JSON/formularios)
app.use(cors({
    origin: 'http://69.6.203.183',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Carpeta pública para las imágenes
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 3. Rutas principales
const rutasPrincipales = require('./routes/routes');
app.use('/api', rutasPrincipales);

app.get('/', (req, res) => {
    res.send('Servidor corriendo');
});

// 4. Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});