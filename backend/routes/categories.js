const pool = require('../config/db');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../routes/verifyToken");
const router = require("express").Router();

router.get('/categories', async (req, res) => {
    try {
      const categories = await pool.query('SELECT * FROM categories');
      res.status(200).json(categories.rows);
    } catch (err) {
      console.error('Error fetching categories', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  
  module.exports = router;