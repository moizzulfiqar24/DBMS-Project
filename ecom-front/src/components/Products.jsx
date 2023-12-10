import styled from "styled-components";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import Product from "./Product";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Products = ({ colorFilter, sizeFilter, sortFilter }) => {
  const { categoryInfo } = useSelector((state) => state.category);
  const { id } = categoryInfo;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/product/category/${id}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the async function
  }, [id]);

  // Filtering logic based on color and size
  const filteredProducts = products.filter((product) => {
    if (colorFilter !== "All" && !product.color.includes(colorFilter)) {
      return false;
    }
  
    if (sizeFilter !== "All" && !product.size.includes(sizeFilter)) {
      return false;
    }
  
    return true;
  });

  // Sorting logic based on sortFilter
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortFilter === "Newest") {
      return b.id - a.id; // Sorting by id (assumes higher id means newer)
    } else if (sortFilter === "PriceAsc") {
      return a.price - b.price;
    } else if (sortFilter === "PriceDesc") {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <Container>
      {sortedProducts.map((item) => (
        <Product item={item} key={item.id} colorFilter={colorFilter} sizeFilter={sizeFilter} />
      ))}
    </Container>
  );
};


export default Products;
