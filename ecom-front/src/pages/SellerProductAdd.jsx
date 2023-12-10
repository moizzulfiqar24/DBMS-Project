// ProductForm.js

import React, { useState } from 'react';
import './ProductForm.css';
import Axios from 'axios'; // Import Axios
//import toast from 'react-toastify'; // Import toast

const ProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    image: '',
    category_id:0,
    size: [],
    color: [],
    price: 0,
    in_stock: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'size' || name === 'color'
        ? value.split(',').map(item => item.trim())
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send a POST request to your server using Axios
      const response = await Axios.post('http://localhost:5001/api/product/products', newProduct);
      //  toast.success('Product created successfully');
      
      // Reset the form
      setNewProduct({
        title: '',
        description: '',
        image: '',
        category_id:0,
        size: [],
        color: [],
        price: 0,
        in_stock: 0,
      });
    } catch (error) {
      console.error('Error creating product', error);
    }
  };

  return (
    <div className="product-form-container">
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="title" value={newProduct.title} onChange={handleChange} required />

        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" value={newProduct.description} onChange={handleChange} required />

        <label htmlFor="image">Image URL:</label>
        <input type="text" id="image" name="image" value={newProduct.image} onChange={handleChange} required />

        <label htmlFor="colors">Category id:</label>
        <input type="text" id="colors" name="category_id" value={newProduct.category_id} onChange={handleChange} required />

        <label htmlFor="sizes">Sizes (comma-separated):</label>
        <input type="text" id="sizes" name="size" value={newProduct.size.join(', ')} onChange={handleChange} required />

        <label htmlFor="colors">Colors (comma-separated):</label>
        <input type="text" id="colors" name="color" value={newProduct.color.join(', ')} onChange={handleChange} required />
        

        <label htmlFor="price">Price:</label>
        <input type="number" id="price" name="price" value={newProduct.price} onChange={handleChange} required />

        <label htmlFor="stock">Stock:</label>
        <input type="number" id="stock" name="in_stock" value={newProduct.in_stock} onChange={handleChange} required />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default ProductForm;
