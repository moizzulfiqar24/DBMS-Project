import React from "react";
import styled from "styled-components";
import Announcement from "../components/Announcement";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import Products from "../components/Products";
import Slider from "../components/Slider";

const Container = styled.div`
  margin-bottom: 20px; /* Adjust the margin as needed */
`;

const Home = () => {
  return (
    <Container>
      <Announcement />
      <Navbar />
      <Container></Container>
      <Slider />
      <Categories />
     
      <Footer/>
    </Container>
  );
};

export default Home;
