import React, { useEffect } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import { mobile } from "../responsive";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchCartInfo } from "../store/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { setaddressInfo } from "../store/slices/addressSlice";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
`;

const TopTexts = styled.div`
  ${mobile({ display: "none" })}
`;
const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductId = styled.span``;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

const Cart = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { cartInfo, status, error } = useSelector((state) => state.cart);
  const addressInfo = useSelector((state) => state.address.addressInfo);
  const userId = useSelector((state) => state.auth.userInfo?.id);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartInfo(userId));
    }
  }, [dispatch, userId]);

  

  const deletefromcart = async () => {
    
  
      const { id } = cartInfo.id[0];
      
      // Ensure that 'id' exists before making the request
      try {
        const response = await axios.delete(`http://localhost:5001/api/cart/car/${id}`);
        console.log("Cart cleared successfully:", response.data);
        window.location.reload();
        // Add any further actions or navigation logic if needed
    
      } catch (error) {
        console.error("Error clearing cart:", error.message);
        // Handle the error as needed
      }
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    // Dispatch the action to update the address in the Redux store
    dispatch(setaddressInfo(newAddress));
    console.log(newAddress);
  };

  const gotoaddress = async () => {
    const addressFromStore = addressInfo;

    const orderData = {
      userId: userId,
      // products: cartInfo.products.map((product) => ({
      //   productId: product.products[0].id,
      //   quantity: product.products[0].quantity,
      // })),
      amount: calculateSubtotal(cartInfo.products),
      address: addressFromStore,
      status: 'pending',
    };
    try {
      const response = await axios.post(`http://localhost:5001/api/orders/${userId}`, orderData);
      console.log('Order placed successfully:', response.data);
      Navigate('/address');
    } catch (error) {
      console.error('Error placing order:', error);
      console.log(orderData);

    }
  };
  

  return (
    <Container>
      <Announcement />
      <Navbar />

      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <Link to="/">
            <TopButton type="filled">CONTINUE SHOPPING</TopButton>
          </Link>
          <TopTexts>
            <TopText>Shopping Bag({cartInfo.products.length})</TopText>
            {/* {console.log(cartInfo.products)} */}
            {/* You can display other details like wishlist count here */}
          </TopTexts>
          <TopButton type="filled">CHECKOUT NOW</TopButton>
        </Top>
        <Bottom>
          <Info>
            {/* {status === "loading" && <p>Loading...</p>} */}
            {/* {status === "failed" && <p>Error: {error}</p>} */}

            {/* {status === 'succeeded' && */}

            {console.log("yo")}
           { console.log(cartInfo.products)}

            {Array.isArray(cartInfo.products) &&
              cartInfo.products.map((product) => (
                <Product key={product.id}>

                  <ProductDetail>
                    <Image src={product.products[0].image} />
                    <Details>
                      <ProductName>
                        <b>Product:</b> {product.products[0].name}
                      </ProductName>
                      <ProductId>
                        <b>ID:</b> {product.products[0].id}
                      </ProductId>
                      {/* <ProductColor color={product.products[0].color} /> */}
                      <ProductSize>
                        <b>Size:</b> {product.products[0].size[0]}
                        {/* <b>Size:</b> {'yosh'} */}
                      </ProductSize>
                    </Details>
                  </ProductDetail>
                  <PriceDetail>
                    <ProductAmountContainer>
                      {/* You can add logic to increase/decrease the quantity here */}
                      <ProductAmount>
                        <b>Quantity: </b>
                        {product.products[0].quantity}
                      </ProductAmount>
                    </ProductAmountContainer>
                    <ProductPrice>${product.products[0].price}</ProductPrice>
                    <DeleteIcon onClick={deletefromcart} /> 
                  </PriceDetail>
                </Product>
              ))}
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>
                $ {calculateSubtotal(cartInfo.products)}
              </SummaryItemPrice>
            </SummaryItem>

            {calculateSubtotal(cartInfo.products) > 50 && (
              <SummaryItem>
                <SummaryItemText>Shipping Cost</SummaryItemText>
                <SummaryItemPrice>$ 0.00</SummaryItemPrice>
              </SummaryItem>
            )}

            {calculateSubtotal(cartInfo.products) < 50 && (
              <SummaryItem>
                <SummaryItemText>Shipping Cost</SummaryItemText>
                <SummaryItemPrice>$ 5.90</SummaryItemPrice>
              </SummaryItem>
            )}
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>
                $ {calculateTotal(cartInfo.products)}
              </SummaryItemPrice>
            </SummaryItem>

            <div style={{ marginTop: '20px' }}>
  <label style={{ marginBottom: '10px', display: 'block' }}>Enter Your Address:</label>
  <input
    type="text"
    value={addressInfo || ''}
    onChange={handleAddressChange}
    placeholder="Enter your address"
    style={{
      padding: '10px',
      width: '100%',
      borderRadius: '5px',
      border: '1px solid #ccc',
      marginBottom: '10px',
    }}
  />
  <button
    onClick={gotoaddress}
    style={{
      padding: '10px',
      width: '100%',
      backgroundColor: 'black',
      color: 'white',
      fontWeight: '600',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
  >
    Place Order
  </button>
</div>
          </Summary>
        </Bottom>
      </Wrapper>
      <Footer />
    </Container>
  );
};

// You can add helper functions to calculate subtotal and total
const calculateSubtotal = (products) => {
  // Ensure that products is an array before using reduce
  const validProducts = Array.isArray(products) ? products : [];

  return validProducts.reduce(
    (total, product) =>
      total + product.products[0].price * product.products[0].quantity,
    0
  );
};

const calculateTotal = (products) => {
  const subtotal = calculateSubtotal(products);

  // Check if subtotal is above $50 for shipping discount
  const shippingCost = subtotal > 50 ? 0 : 5.9;
  const totalcost = subtotal + shippingCost;

  // Add the shipping cost to the subtotal
  return totalcost;
};

export default Cart;
