// AddressPage.js
import React from "react";
import styled from "styled-components";
import AddressForm from "../components/AddressForm";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
const PageContainer = styled.div`
 
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  padding: 20px;
  margin-top: 20px;
  max-width: 800px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OrderSummaryContainer = styled.div`
  margin-bottom: 20px;
`;

const OrderSummary = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const Product = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px;
  text-align: left;

  &:last-child {
    border-bottom: none;
  }
`;

const ConfirmationContainer = styled.div``;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const ContinueShoppingButton = styled(Link)`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  border-radius: 5px;
  margin: 20px;
  cursor: pointer;
`;




const ProductName = styled.span`
  font-weight: bold;
`;

const AddressPage = () => {
  const { cartInfo } = useSelector((state) => state.cart);
  const userId = useSelector((state) => state.auth.userInfo?.id);



  const handleAddressSubmit = async () => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/cart/carts/${userId}`);
      console.log("Cart cleared successfully:", response.data);
  
      // Add any further actions or navigation logic if needed
  
    } catch (error) {
      console.error("Error clearing cart:", error.message);
      // Handle the error as needed
    }
  };
  

  return (
    <PageContainer>
      <ContentContainer>
        <OrderSummaryContainer>
          <Title>ORDER SUMMARY</Title>
          {/* Display items from the cart */}
          <OrderSummary>
            {Array.isArray(cartInfo.products) &&
              cartInfo.products.map((product) => (
                <Product key={product.id}>
                  <ProductName>{product.products[0].name}</ProductName>
                  <div>Quantity: {product.products[0].quantity}</div>
                  <div>Price: ${product.products[0].price}</div>
                </Product>
              ))}
          </OrderSummary>
        </OrderSummaryContainer>
        <ConfirmationContainer>
          <Title>YOUR ORDER HAS BEEN PLACED</Title>
          {/* You can add additional information or components here */}
          
          <ContinueShoppingButton to="/" onClick={handleAddressSubmit}>CONTINUE SHOPPING</ContinueShoppingButton>
        </ConfirmationContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default AddressPage;
