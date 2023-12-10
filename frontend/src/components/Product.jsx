import React, { useState } from "react";
import styled from "styled-components";
import {
  FavoriteBorderOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setproductInfo } from "../store/slices/productSlice";

const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
`;

const Container = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 280px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5fbfd;
  position: relative;

  &:hover ${Info} {
    opacity: 1;
  }
`;

const Circle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
`;

const Image = styled.img`
  height: 75%;
  z-index: 2;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;

  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const Product = ({ item, colorFilter, sizeFilter }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearchClick = (id) => {
    const req = { id };
    dispatch(setproductInfo(req));
    navigate("/Product_des");
  };

  const handleCartClick = () => {
    // Add the product to the cart (you'll need to implement your cart logic here)
    // Redirect to the cart page
    navigate("/cart");
  };

  // Check if the product matches the applied filters
  const matchesFilters = () => {
    if (colorFilter !== "All" && !item.color.includes(colorFilter)) {
      return false;
    }
  
    if (sizeFilter !== "All" && !item.size.includes(sizeFilter)) {
      return false;
    }
  
    return true;
  };
  
  // Render the product only if it matches the filters
  return matchesFilters() ? (
    <Container>
      <Circle />
      <Image src={item.image} />
      <Info>
        
        <Icon onClick={() => handleSearchClick(item.id)}>
          <SearchOutlined />
        </Icon>
        
      </Info>
    </Container>
  ) : null;
};

export default Product;
