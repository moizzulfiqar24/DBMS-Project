
const CryptoJS = require("crypto-js");
const router = require("express").Router();
const pool = require('../config/db');
const { verifyTokenAndAuthorization } = require("./verifyToken");

router.get('/',async(req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM Users');
      client.release();
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
});

// Update User Details
// Update User Information
// @desc    Update user details
// @route   PUT /api/user/update
// @access  Private (or Public depending on your authentication setup)
router.put('/update/:id', async (req, res) => {
  const userId = req.params.id; // Assuming you are getting the user's id from the request
  const { name, email, password } = req.body;

  try {
      // Fetch user from the database
      const userQueryResult = await pool.query('SELECT * FROM Users WHERE id = $1', [userId]);

      if (userQueryResult.rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      let user = userQueryResult.rows[0];

      // Prepare values for the update
      const updatedName = name || user.username;
      const updatedEmail = email || user.email;
      let updatedPassword = user.password;

      if (password) {
          // Hash new password
          const salt = await bcrypt.genSalt(10);
          updatedPassword = await bcrypt.hash(password, salt);
      }

      // Update the user in the database
      const updateQuery = 'UPDATE Users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, username, email';
      const updatedUser = await pool.query(updateQuery, [updatedName, updatedEmail, updatedPassword, userId]);

      res.json({
          id: updatedUser.rows[0].id,
          name: updatedUser.rows[0].username,
          email: updatedUser.rows[0].email,
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
  }
});
  
  // Delete User
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      await pool.query("DELETE FROM Users WHERE id = $1", [id]);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error");
    }
  });
  
  router.get("/find/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      const user = result.rows[0];
      const { password, ...others } = user;
  
      res.status(200).json(others);
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error");
    }
  });
  
  
  




module.exports = router;