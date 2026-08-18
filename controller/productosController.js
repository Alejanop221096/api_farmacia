const conectarDB = require('../CONFIG/db');

// --- READ (GET) ---

const getProductos = async (req, res) => {
  try {
    const conexion = await conectarDB();
    const query = `
      SELECT p.id, p.name, s.name AS category, b.name AS brand, p.price, p.discountPercentage, p.imageUrl
      FROM products p
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      LEFT JOIN brands b ON p.brand_id = b.id;
    `;
    const [rows] = await conexion.execute(query);
    await conexion.end();
    res.json({ success: true, mensaje: 'Lista de productos obtenida con éxito', data: rows });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ success: false, mensaje: 'Error al consultar productos', error: error.message });
  }
};

const getCategoriasConSubcategorias = async (req, res) => {
  let conexion;
  try {
    conexion = await conectarDB();
    const [categorias] = await conexion.execute('SELECT id, name, icon FROM categories');
    const [subcategorias] = await conexion.execute('SELECT id, category_id, name FROM subcategories');
    await conexion.end();

    const categoriasFormateadas = categorias.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon || '💊',
      isOpen: false,
      subcategories: subcategorias.filter(sub => sub.category_id === cat.id)
    }));
    res.json(categoriasFormateadas);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    if (conexion) await conexion.end();
    res.status(500).json([]);
  }
};

const getProductosMasVistos = async (req, res) => {
  let conexion;
  try {
    conexion = await conectarDB();
    const query = `
      SELECT p.id, p.name, s.name AS category, b.name AS brand, p.price, p.discountPercentage, p.imageUrl, p.visitas
      FROM products p
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      LEFT JOIN brands b ON p.brand_id = b.id
      ORDER BY p.visitas DESC LIMIT 10;
    `;
    const [rows] = await conexion.execute(query);
    await conexion.end();
    res.json({ success: true, mensaje: 'Productos más vistos obtenidos', data: rows });
  } catch (error) {
    console.error('Error al obtener productos más vistos:', error);
    if (conexion) await conexion.end();
    res.status(500).json({ success: false, mensaje: 'Error al consultar', error: error.message });
  }
};

const getSubcategorias = async (req, res) => {
  let conexion;
  try {
    conexion = await conectarDB();
    const [rows] = await conexion.execute('SELECT id, category_id, name FROM subcategories');
    await conexion.end();
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener subcategorías:', error);
    if (conexion) await conexion.end();
    res.status(500).json({ success: false, mensaje: 'Error al consultar subcategorías', error: error.message });
  }
};

const getBrands = async (req, res) => {
  let conexion;
  try {
    conexion = await conectarDB();
    const [rows] = await conexion.execute('SELECT id, name FROM brands');
    await conexion.end();
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    if (conexion) await conexion.end();
    res.status(500).json({ success: false, mensaje: 'Error al consultar marcas', error: error.message });
  }
};

// --- CREATE (POST) ---

const createProduct = async (req, res) => {
  let conexion;
  try {
    const { name, subcategory_id, brand_id, price, discountPercentage, imageUrl } = req.body;
    conexion = await conectarDB();
    const [result] = await conexion.execute(
      'INSERT INTO products (name, subcategory_id, brand_id, price, discountPercentage, imageUrl, created_at, visitas) VALUES (?, ?, ?, ?, ?, ?, NOW(), 0)',
      [name, subcategory_id || null, brand_id || null, price, discountPercentage || 0, imageUrl || '']
    );
    await conexion.end();
    res.status(201).json({ success: true, mensaje: 'Producto creado', productId: result.insertId });
  } catch (error) {
    if (conexion) await conexion.end();
    res.status(500).json({ success: false, mensaje: 'Error al registrar producto', error: error.message });
  }
};

const createCategory = async (req, res) => {
  let conexion;
  try {
    const { icon, name } = req.body;
    conexion = await conectarDB();
    const [result] = await conexion.execute('INSERT INTO categories (icon, name) VALUES (?, ?)', [icon || '💊', name]);
    await conexion.end();
    res.status(201).json({ success: true, mensaje: 'Categoría creada', categoryId: result.insertId });
  } catch (error) {
    if (conexion) await conexion.end();
    res.status(500).json({ success: false, mensaje: 'Error al registrar categoría', error: error.message });
  }
};

const createSubcategory = async (req, res) => {
  let conexion;
  try {
    const { category_id, name } = req.body;
    conexion = await conectarDB();
    const [result] = await conexion.execute('INSERT INTO subcategories (category_id, name) VALUES (?, ?)', [category_id, name]);
    await conexion.end();
    res.status(201).json({ success: true, mensaje: 'Subcategoría creada', subcategoryId: result.insertId });
  } catch (error) {
    if (conexion) await conexion.end();
    res.status(500).json({ success: false, mensaje: 'Error al registrar subcategoría', error: error.message });
  }
};

const createBrand = async (req, res) => {
  let conexion;
  try {
    const { name } = req.body;
    conexion = await conectarDB();
    const [result] = await conexion.execute('INSERT INTO brands (name) VALUES (?)', [name]);
    await conexion.end();
    res.status(201).json({ success: true, mensaje: 'Marca creada', brandId: result.insertId });
  } catch (error) {
    if (conexion) await conexion.end();
    res.status(500).json({ success: false, mensaje: 'Error al registrar marca', error: error.message });
  }
};

// --- UPDATE (PUT) ---

const updateProduct = async (req, res) => {
  let conexion;
  try {
    const { id } = req.params;
    const { name, subcategory_id, brand_id, price, discountPercentage, imageUrl } = req.body;
    conexion = await conectarDB();
    await conexion.execute(
      'UPDATE products SET name = ?, subcategory_id = ?, brand_id = ?, price = ?, discountPercentage = ?, imageUrl = ? WHERE id = ?',
      [name, subcategory_id || null, brand_id || null, price, discountPercentage || 0, imageUrl || '', id]
    );
    await conexion.end();
    res.json({ success: true, mensaje: 'Producto actualizado' });
  } catch (error) {
    if (conexion) await conexion.end();
    res.status(500).json({ success: false, mensaje: 'Error al actualizar producto', error: error.message });
  }
};

// --- DELETE ---

const deleteProduct = async (req, res) => {
  let conexion;
  try {
    const { id } = req.params;
    conexion = await conectarDB();
    await conexion.execute('DELETE FROM products WHERE id = ?', [id]);
    await conexion.end();
    res.json({ success: true, mensaje: 'Producto eliminado' });
  } catch (error) {
    if (conexion) await conexion.end();
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  let conexion;
  try {
    const { id } = req.params;
    conexion = await conectarDB();
    await conexion.execute('DELETE FROM categories WHERE id = ?', [id]);
    await conexion.end();
    res.json({ success: true, mensaje: 'Categoría eliminada' });
  } catch (error) {
    if (conexion) await conexion.end();
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteSubcategory = async (req, res) => {
  let conexion;
  try {
    const { id } = req.params;
    conexion = await conectarDB();
    await conexion.execute('DELETE FROM subcategories WHERE id = ?', [id]);
    await conexion.end();
    res.json({ success: true, mensaje: 'Subcategoría eliminada' });
  } catch (error) {
    if (conexion) await conexion.end();
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteBrand = async (req, res) => {
  let conexion;
  try {
    const { id } = req.params;
    conexion = await conectarDB();
    await conexion.execute('DELETE FROM brands WHERE id = ?', [id]);
    await conexion.end();
    res.json({ success: true, mensaje: 'Marca eliminada' });
  } catch (error) {
    if (conexion) await conexion.end();
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
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
};