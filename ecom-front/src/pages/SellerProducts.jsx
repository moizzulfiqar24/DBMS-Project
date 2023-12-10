import React, { useState, useEffect } from 'react';
import './ProductTable.css';
import SellerNavbar from './SellerNavbar';
import Axios from 'axios';

const ProductTable = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Axios.get('http://localhost:5001/api/product/products');
        const data = response.data;
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    // Call fetchProducts when the component mounts
    fetchProducts();
  }, []);

  return (
    <div>
      <SellerNavbar />
      <div className="product-table-container">
        <h1 className='product-table-header'>Products</h1>
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Image</th>
              <th>Sizes</th>
              <th>Colors</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.description}</td>
                <td>
                  <img src={product.image} alt={product.title} className="product-image" />
                </td>
                <td>{product.size.join(', ')}</td>
                <td>{product.color.join(', ')}</td>
                <td>{ product.price }</td>
                <td>{product.in_stock}</td>
                <td>{product.created_at}</td>
                <td>{product.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;
