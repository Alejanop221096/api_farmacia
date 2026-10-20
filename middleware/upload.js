const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Definir la ruta de la carpeta de subidas
const uploadDir = path.join(__dirname, '../public/uploads');

// Crear la carpeta automáticamente si no existe (recursivo por si 'public' tampoco existe)
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento para las imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generar un nombre único para evitar que se sobrescriban archivos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;