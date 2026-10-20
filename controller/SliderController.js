const conectarDB = require('../CONFIG/db');
const fs = require('fs');
const path = require('path');

// Obtener todos los sliders/banners
const getSliders = async (req, res) => {
    try {
        const conexion = await conectarDB();
        const [rows] = await conexion.query('SELECT * FROM sliders');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los sliders:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un nuevo slider/banner
const createSlider = async (req, res) => {
    try {
        const { title, subtitle, buttonText, link, badge } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl || '');

        const query = `
            INSERT INTO sliders (title, subtitle, buttonText, link, imageUrl, badge) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const conexion = await conectarDB();
        const [result] = await conexion.query(query, [
            title, 
            subtitle, 
            buttonText, 
            link, 
            imageUrl, 
            badge || ''
        ]);

        res.status(201).json({ 
            message: 'Slider creado con éxito', 
            id: result.insertId,
            imageUrl 
        });
    } catch (error) {
        console.error('Error al crear el slider:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un slider/banner existente
const updateSlider = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, buttonText, link, badge } = req.body;

        const conexion = await conectarDB();
        const [existing] = await conexion.query('SELECT * FROM sliders WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Slider no encontrado' });
        }

        let imageUrl = existing[0].imageUrl;

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
            
            // CORRECCIÓN DE RUTA: Remover la barra inicial con .replace(/^\//, '')
            if (existing[0].imageUrl) {
                const cleanPath = existing[0].imageUrl.replace(/^\//, '');
                const oldPath = path.join(__dirname, '../public', cleanPath);
                
                if (fs.existsSync(oldPath)) {
                    try { 
                        fs.unlinkSync(oldPath); 
                    } catch (e) { 
                        console.error('No se pudo borrar archivo antiguo', e); 
                    }
                }
            }
        }

        const query = `
            UPDATE sliders 
            SET title = ?, subtitle = ?, buttonText = ?, link = ?, imageUrl = ?, badge = ? 
            WHERE id = ?
        `;

        await conexion.query(query, [
            title, 
            subtitle, 
            buttonText, 
            link, 
            imageUrl, 
            badge || '', 
            id
        ]);

        res.json({ message: 'Slider actualizado con éxito', imageUrl });
    } catch (error) {
        console.error('Error al actualizar el slider:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un slider/banner
const deleteSlider = async (req, res) => {
    try {
        const { id } = req.params;

        const conexion = await conectarDB();
        const [existing] = await conexion.query('SELECT * FROM sliders WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Slider no encontrado' });
        }

        const [result] = await conexion.query('DELETE FROM sliders WHERE id = ?', [id]);

        // CORRECCIÓN DE RUTA AL ELIMINAR
        if (existing[0].imageUrl) {
            const cleanPath = existing[0].imageUrl.replace(/^\//, '');
            const filePath = path.join(__dirname, '../public', cleanPath);
            
            if (fs.existsSync(filePath)) {
                try { 
                    fs.unlinkSync(filePath); 
                } catch (e) { 
                    console.error('No se pudo borrar el archivo físico', e); 
                }
            }
        }

        res.json({ message: 'Slider eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el slider:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getSliders,
    createSlider,
    updateSlider,
    deleteSlider
};