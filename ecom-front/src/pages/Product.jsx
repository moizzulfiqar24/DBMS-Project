import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Add, Remove, Timer } from "@mui/icons-material";
import styled from "styled-components";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import { mobile } from "../responsive";
import { useSelector } from "react-redux";
import axios from "axios";
import { setcartInfo } from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  ${mobile({ padding: "10px", flexDirection: "column" })}
`;

const ImgContainer = styled.div`
  flex: 1;
`;

const Image = styled.img`
  width: 100%;
  height: 90vh;
  object-fit: cover;
  ${mobile({ height: "40vh" })}
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 50px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 200;
`;

const Desc = styled.p`
  margin: 20px 0px;
`;

const Price = styled.span`
  font-weight: 100;
  font-size: 40px;
`;

const FilterContainer = styled.div`
  width: 50%;
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const FilterTitle = styled.span`
  font-size: 20px;
  font-weight: 200;
`;

const FilterColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin: 0px 5px;
  cursor: pointer;
`;

const FilterSize = styled.select`
  margin-left: 10px;
  padding: 5px;
`;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Amount = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`;

const Button = styled.button`
  padding: 15px;
  border: 2px solid teal;
  background-color: black;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #f8f4f4;
  }
`;

const Product = () => {
  const { productInfo } = useSelector((state) => state.product);
  const { id } = productInfo;
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("S");
  const dispatch = useDispatch(); // Define dispatch here
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleRemove = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/product/products/${id}`
        );
        setProduct(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleSizeChange = (event) => {
    const selectedSize = event.target.value;
    console.log("Selected Size:", selectedSize);
    setSelectedSize(selectedSize);
  };

  // Get user ID from Redux store
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = userInfo ? userInfo.id : null;

  const handlecart = () => {
    // if (!selectedSize) {
    //   // Handle the case where size is not selected
    // console.log("Please select a size");
    //   return;
    // }

    const productInfo = {
      id: product.id,
      image: product.image,
      name: product.title,
      price: product.price,
      size: selectedSize,
      quantity: quantity,
      //  "color": product.color,
    };

    // ... (rest of the component code)

    // Check if the user is logged in
    const createCartUrl = "http://localhost:5001/api/cart/carts";

    // Check if the user is logged in
    if (userId) {
      // If the user is logged in, proceed with adding to cart logic
      // Use the URL for creating a new cart
      const requestUrl = createCartUrl;

      // Your logic to add the product to the cart
      // You need to modify this based on your API and data structure
      axios({
        method: "POST",
        url: requestUrl,
        data: {
          userId: userId,
          products: [productInfo], // Modify this based on your product structure
        },
      })
        .then((cartResponse) => {
          // Handle the cart response if needed
          console.log("Product added to cart:", cartResponse.data);
          // Dispatch an action to update the cart state in Redux
          dispatch(setcartInfo(cartResponse.data));
          // set timer
          setTimeout(() => {
            navigate("/cart");
          }, 3000);
        })
        .catch((error) => {
          console.error("Error adding product to cart:", error);
        });
    } else {
      // Handle the case where the user is not logged in
      console.log("User is not logged in. Please log in to add to cart.");
      // Redirect or show a login prompt
    }

    const cartInfo = [productInfo]; // Wrap the product info in an array
    dispatch(setcartInfo(cartInfo));
    setTimeout(() => {
      navigate("/cart");
    }, 3000);
  };

  return (
    <Container>
      <Announcement />
      <Navbar />

      <Wrapper>
        <ImgContainer>
          {product && product.image && (
            <Image src={product.image} alt={product.title} />
          )}{" "}
          {/* Display product image if available */}
        </ImgContainer>
        <InfoContainer>
          {product && (
            <>
              <Title>{product.title}</Title>
              <Desc>{product.description}</Desc>
              <Price>${product.price}</Price>
              <FilterContainer>
                <Filter>
                  <FilterTitle>Color</FilterTitle>
                  {product.color &&
                    product.color.map &&
                    product.color.map((color) => (
                      <FilterColor key={color} color={color} />
                    ))}
                </Filter>
                <Filter>
                  <FilterTitle>Size</FilterTitle>
                  {product.size && product.size.map && (
                    <FilterSize
                      value={selectedSize}
                      onChange={handleSizeChange}
                    >
                      {product.size.map((size) => (
                        <FilterSizeOption key={size}>{size}</FilterSizeOption>
                      ))}
                      {/* {console.log('yolo')} */}
                    </FilterSize>
                  )}
                </Filter>
              </FilterContainer>
              <AddContainer>
                {/* Your add to cart logic can go here */}
                <AmountContainer>
                  <Remove onClick={handleRemove} />
                  <Amount>{quantity}</Amount>
                  <Add onClick={handleAdd} />
                </AmountContainer>
                <Button onClick={() => handlecart(product.id)}>
                  ADD TO CART
                </Button>
              </AddContainer>
            </>
          )}
        </InfoContainer>
      </Wrapper>
     
      <Footer />
    </Container>
  );
};
export default Product;
