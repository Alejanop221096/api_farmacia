const { Router } = require('express');
const router = Router();

// Importar los controladores de productos y utilidades
const { 
  getProductos, 
  getCategoriasConSubcategorias, 
  getProductosMasVistos,
  getSubcategorias,
  getBrands,      
  createProduct,      
  createCategory,     
  createSubcategory,
  createBrand,        
  updateProduct,      
  deleteProduct,      
  deleteCategory,     
  deleteSubcategory,  
  deleteBrand,
  getProductoById,
  incrementProductView 
} = require('../controller/productosController');

// Importar los controladores de Sliders
const {
  getSliders,
  createSlider,
  updateSlider,
  deleteSlider
} = require('../controller/sliderController');

// Importar el controlador de login
const { login } = require('../controller/authController');

// Importar multer (middleware de subida de archivos)
const upload = require('../middleware/upload'); 

// 1. PRIMERO LAS RUTAS FIJAS ESPECÍFICAS (GET)
router.get('/productos/mas-vistos', getProductosMasVistos);
router.get('/productos', getProductos);
router.get('/productos/:id', getProductoById);
router.get('/categorias', getCategoriasConSubcategorias);
router.get('/subcategories', getSubcategorias); 
router.get('/brands', getBrands);
router.get('/sliders', getSliders);

// 2. LUEGO LAS RUTAS DE CREACIÓN Y ACCIONES (POST)
router.post('/productos', createProduct);
router.post('/categorias', createCategory);
router.post('/subcategories', createSubcategory);
router.post('/brands', createBrand);
router.post('/login', login);
router.post('/productos/:id/view', incrementProductView);
router.post('/sliders', upload.single('image'), createSlider);

// 3. DESPUÉS LAS DE ACTUALIZACIÓN (PUT)
router.put('/productos/:id', updateProduct);
router.put('/sliders/:id', upload.single('image'), updateSlider);

// 4. Y AL FINAL LAS DE ELIMINACIÓN (DELETE)
router.delete('/productos/:id', deleteProduct);         
router.delete('/categorias/:id', deleteCategory);       
router.delete('/subcategories/:id', deleteSubcategory); 
router.delete('/brands/:id', deleteBrand);              
router.delete('/sliders/:id', deleteSlider);

module.exports = router;