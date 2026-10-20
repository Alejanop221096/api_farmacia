// controller/authController.js
const conectarDB = require('../CONFIG/db'); // Ajusta según la ubicación real de tu db
const jwt = require('jsonwebtoken'); // <--- 1. Importar jsonwebtoken
require('dotenv').config();

// ¡IMPORTANTE! En un entorno real, guarda esto en un archivo .env (ej. process.env.JWT_SECRET)
const SECRET_KEY = process.env.PALABRA;

const login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ 
      mensaje: 'El usuario y la contraseña son obligatorios.' 
    });
  }

  let conexion;
  try {
    conexion = await conectarDB();

    const query = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';
    const [rows] = await conexion.execute(query, [usuario, contrasena]);

    await conexion.end();

    if (rows.length === 0) {
      return res.status(401).json({ 
        mensaje: 'Usuario o contraseña incorrectos' 
      });
    }

    const user = rows[0];

    // --- 2. GENERAR EL TOKEN JWT ---
    const payload = {
      id: user.id,
      usuario: user.usuario
    };

    // El token expira en 1 hora (puedes cambiarlo a '2h', '7d', etc.)
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    // --- 3. RESPONDER CON EL TOKEN ---
    return res.status(200).json({
      mensaje: 'Autenticación exitosa',
      usuario: {
        id: user.id,
        usuario: user.usuario
      },
      token: token // <--- Aquí enviamos el token real generado
    });

  } catch (error) {
    if (conexion) {
      try { await conexion.end(); } catch (e) {}
    }

    console.error('Error en el servidor:', error);
    return res.status(500).json({ 
      mensaje: 'Error interno del servidor' 
    });
  }
};

module.exports = {
  login
};