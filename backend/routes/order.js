const pool = require('../config/db');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../routes/verifyToken");
const router = require("express").Router();



// Create Order
router.post('/:userId', async (req, res) => {
  const { userId } = req.params; // Use the userId from the verified token
  const { amount, address, status } = req.body;

  try {
    // Fetch all rows from the user's cart
    const cartRows = await pool.query('SELECT * FROM Cart WHERE userId = $1', [userId]);

    if (cartRows.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found for the user' });
    }

    // Aggregate products from all cart rows
    const allProducts = [];
    cartRows.rows.forEach((cart) => {
      const products = cart.products;
      products.forEach((product) => {
        allProducts.push({
          // Map relevant properties from the product object
          id: product.id,
          name: product.name,
          // Add more properties as needed
        });
      });
    });

    // Create a new order with all products from the cart
    const newOrder = await pool.query(
      'INSERT INTO Orders (userId, products, amount, address, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [userId, allProducts, amount, address, status || 'pending']
    );

    // Optionally, you can clear the user's cart after creating the order
    // await pool.query('DELETE FROM Cart WHERE userId = $1', [userId]);

    res.status(200).json(newOrder.rows[0]);
  } catch (err) {
    console.error('Error creating order', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





// router.post('/:userId',  async (req, res) => {
//   const { userId } = req.params; // Use the userId from the verified token
//   const { products, amount, address, status } = req.body;

//   try {
//     const newOrder = await pool.query(
//       'INSERT INTO Orders (userId, products, amount, address, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
//       [userId, JSON.stringify(products), amount, address, status || 'pending']
//     );

//     res.status(200).json(newOrder.rows[0]);
//   } catch (err) {
//     console.error('Error creating order', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Update Order
router.put('/:id',  async (req, res) => {
  const { id } = req.params;
  const updatedOrderData = req.body;

  try {
    const updatedOrder = await pool.query(
      'UPDATE Orders SET userId=$1, products=$2, amount=$3, address=$4, status=$5, updated_at=NOW() WHERE id=$6 RETURNING *',
      [
        updatedOrderData.userId,
        updatedOrderData.products,
        updatedOrderData.amount,
        updatedOrderData.address,
        updatedOrderData.status || 'pending',
        id,
      ]
    );

    res.status(200).json(updatedOrder.rows[0]);
  } catch (err) {
    console.error('Error updating order', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an Order
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM Orders WHERE id=$1', [id]);
    res.status(200).json('Order has been deleted...');
  } catch (err) {
    console.error('Error deleting order', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { address } = req.body;

  try {
    // Check if the order exists
    const orderExists = await pool.query('SELECT * FROM Orders WHERE id = $1', [orderId]);

    if (orderExists.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the address for the specified order
    const updatedOrder = await pool.query(
      'UPDATE Orders SET address = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [address, orderId]
    );

    res.status(200).json(updatedOrder.rows[0]);
  } catch (err) {
    console.error('Error updating order address', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get User Orders
router.get('/find/:userId',  async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await pool.query('SELECT * FROM Orders WHERE userId=$1', [userId]);
    res.status(200).json(orders.rows);
  } catch (err) {
    console.error('Error fetching user orders', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get All Orders
router.get('/',  async (req, res) => {
  try {
    const orders = await pool.query('SELECT * FROM Orders');
    res.status(200).json(orders.rows);
  } catch (err) {
    console.error('Error fetching orders', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Monthly Income
router.get('/income', async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await pool.query(
      `SELECT EXTRACT(MONTH FROM created_at) AS month, SUM(amount) AS total
       FROM Orders
       WHERE created_at >= $1
       GROUP BY EXTRACT(MONTH FROM created_at)`,
      [previousMonth]
    );

    res.status(200).json(income.rows);
  } catch (err) {
    console.error('Error fetching monthly income', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:orderId/complete', async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Update the order status using PostgreSQL UPDATE statement
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      ['completed', orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // The updated order is returned by the RETURNING clause
    const updatedOrder = result.rows[0];

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error marking order as completed:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
