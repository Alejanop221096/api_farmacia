const { Router } = require('express');
const router = Router();

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
  deleteBrand         
} = require('../controller/productosController');

// 1. PRIMERO LAS RUTAS FIJAS (GET)
router.get('/productos', getProductos);
router.get('/categorias', getCategoriasConSubcategorias);
router.get('/productos/mas-vistos', getProductosMasVistos);
router.get('/subcategories', getSubcategorias); // <-- Asegúrate de que esté aquí
router.get('/brands', getBrands);

// 2. LUEGO LAS RUTAS DE CREACIÓN (POST)
router.post('/productos', createProduct);
router.post('/categorias', createCategory);
router.post('/subcategories', createSubcategory);
router.post('/brands', createBrand);

// 3. DESPUÉS LAS DE ACTUALIZACIÓN (PUT)
router.put('/productos/:id', updateProduct);

// 4. Y AL FINAL LAS DE ELIMINACIÓN (DELETE)
router.delete('/productos/:id', deleteProduct);         
router.delete('/categorias/:id', deleteCategory);       
router.delete('/subcategories/:id', deleteSubcategory); 
router.delete('/brands/:id', deleteBrand);              

module.exports = router;