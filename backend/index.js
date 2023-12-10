const express = require("express");
const cors = require('cors');
const cookieParse = require("cookie-parser")
const app = express();
// Allow requests from any origin
// Enable CORS with specific origin
const corsOptions = {
    origin: 'http://localhost:3000', // replace with your React app's URL
    credentials: true,
  };
app.use(cors(corsOptions));

const dotenv = require("dotenv");
dotenv.config();
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const categoriesRoutes = require("./routes/categories")

const {protect, checkAdmin} = require("./routes/verifyToken");


app.use(express.json());
app.use(cookieParse());


app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoriesRoutes)



app.use(errorHandler);
app.use(notFound);
app.use(protect);
app.use(checkAdmin);

app.listen(5001, ()=>{
    console.log(`backend server is running`)
});