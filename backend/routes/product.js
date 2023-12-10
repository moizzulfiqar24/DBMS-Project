const pool = require('../config/db');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../routes/verifyToken");
const router = require("express").Router();

// Create Product
router.post('/products', async (req, res) => {
  const {
    title,
    description,
    image,
    category_id,
    size,
    color,
    price,
    in_stock,
  } = req.body;

  try {
    const newProduct = await pool.query(
      'INSERT INTO products (title, description, image, category_id, size, color, price, in_stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, image, category_id, size, color, price, in_stock]
    );

    res.status(200).json(newProduct.rows[0]);
  } catch (err) {
    console.error('Error creating product', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Product
router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const updatedProductData = req.body;

  try {
    const updatedProduct = await pool.query(
      'UPDATE products SET title=$1, description=$2, image=$3, category_id=$4, size=$5, color=$6, price=$7, in_stock=$8, updated_at=NOW() WHERE id=$9 RETURNING *',
      [
        updatedProductData.title,
        updatedProductData.description,
        updatedProductData.image,
        updatedProductData.category_id,
        updatedProductData.size,
        updatedProductData.color,
        updatedProductData.price,
        updatedProductData.in_stock,
        id,
      ]
    );

    res.status(200).json(updatedProduct.rows[0]);
  } catch (err) {
    console.error('Error updating product', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a Product
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    res.status(200).json('Product has been deleted...');
  } catch (err) {
    console.error('Error deleting product', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get All Products
router.get('/products', async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;

    if (qNew) {
      products = await pool.query('SELECT * FROM products ORDER BY created_at DESC LIMIT 1');
    } else if (qCategory) {
      products = await pool.query('SELECT * FROM products WHERE $1 = ANY(category_id)', [qCategory]);
    } else {
      products = await pool.query('SELECT * FROM products');
    }

    res.status(200).json(products.rows);
  } catch (err) {
    console.error('Error fetching products', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/category/:category_id', async (req, res) => {
  const { category_id } = req.params;

  try {
    const products = await pool.query(
      'SELECT * FROM products where category_id = $1',
      [category_id]
    );
    res.status(200).json(products.rows);
  } catch (err) {
    console.error('Error fetching products by category_id', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});
// Assume your products have an 'id' field in the database

router.get('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);

    if (product.rows.length === 0) {
      // If no product is found with the given ID
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product.rows[0]);
  } catch (err) {
    console.error('Error fetching product details', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
