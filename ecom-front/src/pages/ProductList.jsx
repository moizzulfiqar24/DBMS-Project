import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import Products from "../components/Products";

import Footer from "../components/Footer";
import { mobile } from "../responsive";

const Container = styled.div``;

const Title = styled.h1`
  margin: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Filter = styled.div`
  margin: 20px;
  ${mobile({ width: "0px 20px", display: "flex", flexDirection: "column" })}
`;

const FilterText = styled.span`
  font-size: 20px;
  font-weight: 600;
  margin-right: 20px;
  ${mobile({ marginRight: "0px" })}
`;

const Select = styled.select`
  padding: 10px;
  margin-right: 20px;
  ${mobile({ margin: "10px 0px" })}
`;
const Option = styled.option``;

const ProductList = () => {
  const [colorFilter, setColorFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("Newest");

  const handleColorChange = (e) => {
    setColorFilter(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSizeFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortFilter(e.target.value);
  };

  return (
    <Container>
      <Announcement />
      <Navbar />
      
      <Title>Dresses</Title>
      <FilterContainer>
        <Filter>
          <FilterText>Filter Products:</FilterText>
          <Select value={colorFilter} onChange={handleColorChange}>
            <Option value="All">Color</Option>
            <Option value="White">White</Option>
            <Option value="Black">Black</Option>
            <Option value="Brown">Brown</Option>
            <Option value="Blue">Blue</Option>
            
            <Option value="Green">Green</Option>
          </Select>
          <Select value={sizeFilter} onChange={handleSizeChange}>
            <Option value="All">Size</Option>
            <Option value="XS">XS</Option>
            <Option value="S">S</Option>
            <Option value="M">M</Option>
            <Option value="L">L</Option>
            <Option value="XL">XL</Option>
          </Select>
        </Filter>
        <Filter>
          <FilterText>Sort Products:</FilterText>
          <Select value={sortFilter} onChange={handleSortChange}>
            <Option value="Newest">Newest</Option>
            <Option value="PriceAsc">Price (asc)</Option>
            <Option value="PriceDesc">Price (desc)</Option>
          </Select>
        </Filter>
      </FilterContainer>
      <Products colorFilter={colorFilter} sizeFilter={sizeFilter} sortFilter={sortFilter} />
    
      <Footer />
    </Container>
  );
};

export default ProductList;
