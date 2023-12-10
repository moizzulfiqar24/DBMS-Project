const express = require('express');
const pool = require('../config/db');
const { verifyTokenAndAuthorization } = require('../routes/verifyToken');
const { configureStore } = require('@reduxjs/toolkit');

const router = express.Router();

// CREATE
router.post('/carts', async (req, res) => {
  const { userId, products } = req.body;

  try {
    const newCart = await pool.query(
      'INSERT INTO Cart (userId, products) VALUES ($1, $2) RETURNING *',
      [userId, products]
    );

    res.status(200).json(newCart.rows[0]);
  } catch (err) {
    console.error('Error creating cart', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// READ (GET USER CART)
router.get('/carts/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await pool.query('SELECT * FROM Cart WHERE userId = $1', [userId]);

    // Check if there is any data in the cart
    if (cart.rows.length > 0) {
      // Send the entire array of products in the cart
      res.status(200).json(cart.rows);
    } else {
      // If no data found, send an empty array
      res.status(200).json([]);
    }
  } catch (err) {
    console.error('Error fetching user cart', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// READ (GET ALL)
router.get('/carts', async (req, res) => {
  try {
    const carts = await pool.query('SELECT * FROM Cart');
    res.status(200).json(carts.rows);
  } catch (err) {
    console.error('Error fetching carts', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// UPDATE
router.put('/carts/:id', async (req, res) => {
  const { id } = req.params;
  const updatedCartData = req.body;

  try {
    const updatedCart = await pool.query(
      'UPDATE Cart SET userId=$1, products=$2, updated_at=NOW() WHERE id=$3 RETURNING *',
      [updatedCartData.userId, updatedCartData.products, id]
    );

    res.status(200).json(updatedCart.rows[0]);
  } catch (err) {
    console.error('Error updating cart', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE
router.delete('/carts/:userid', async (req, res) => {
  const { userid } = req.params; // Corrected from 'id' to 'userid'

  try {
    await pool.query('DELETE FROM Cart WHERE userid=$1', [userid]);
    res.status(200).json('Cart has been deleted...');
  } catch (err) {
    console.error('Error deleting cart', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/car/:id', async (req, res) => {
  const { id } = req.params; // Corrected from 'id' to 'userid'
  
  try {
    await pool.query('DELETE FROM Cart WHERE id=$1', [id]);
    res.status(200).json('Cart has been deleted...');
  } catch (err) {
    console.error('Error deleting cart', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
