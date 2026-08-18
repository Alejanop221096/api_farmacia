const express = require('express');
const cors = require('cors'); // <-- 1. Importa cors
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const rutasPrincipales = require('./routes/routes');

// 2. Configura e implementa CORS para permitir peticiones desde Angular (puerto 4200)
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());
app.use('/api', rutasPrincipales);

app.get('/', (req, res) => {
  res.send('servidor corriendo');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});