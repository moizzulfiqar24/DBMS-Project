// AddProduct.jsx
import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
`;

const Form = styled.form`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const FormItem = styled.div`
  margin-bottom: 20px;

  label {
    color: gray;
    font-weight: 600;
    margin-bottom: 10px;
    display: block;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
`;

const Button = styled.button`
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
  cursor: pointer;
  border: none;
  border-radius: 5px;
`;

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    image: "",
    sizes: [], // Array for sizes
    colors: [], // Array for colors
    price: "",
    stock: "",
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to your API endpoint
      const response = await axios.post("http://localhost:5001/api/product/products", {
        name: productData.name,
        description: productData.description,
        image: productData.image,
        sizes: productData.sizes,
        colors: productData.colors,
        price: productData.price,
        stock: productData.stock,
      });

      // Handle success, e.g., redirect, show a success message, etc.
      console.log("Product created successfully:", response.data);
    } catch (error) {
      // Handle error, e.g., show an error message, log the error, etc.
      console.error("Error creating product:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  





  return (
    <Container>
      <Form onSubmit={handleFormSubmit}>
        <FormItem>
          <label>Name</label>
          <input
            type="text"
            placeholder="Product Name"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            required
          />
        </FormItem>
        <FormItem>
          <label>Description</label>
          <textarea
            placeholder="Product Description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            required
          />
        </FormItem>
        <FormItem>
          <label>Image URL</label>
          <input
            type="text"
            placeholder="Image URL"
            name="image"
            value={productData.image}
            onChange={handleInputChange}
            required
          />
        </FormItem>
        <FormItem>
          <label>Stock</label>
          <input
            type="number"
            placeholder="Stock"
            name="stock"
            value={productData.stock}
            onChange={handleInputChange}
            required
          />
        </FormItem>
        {/* Add input fields for other product details (sizes, colors, price, etc.) */}
        {/* ... */}

        <Button type="submit">Add Product</Button>
      </Form>
    </Container>
  );



};
export default AddProduct;
