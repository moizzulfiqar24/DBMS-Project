import Product from "./pages/Product";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import AddressPage from "./pages/AddressPage";
import SellerDashboard from "./pages/SellerDashboard"; 
import ProductTable from "./pages/SellerProducts";
import SellerOrders from "./pages/SellerOrders";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Product_des" element={<Product />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller-orders" element={<SellerOrders />} />
        <Route path="/seller-products" element={<ProductTable />} />

      </Routes> 
    </Router>
  );
};

export default App;
