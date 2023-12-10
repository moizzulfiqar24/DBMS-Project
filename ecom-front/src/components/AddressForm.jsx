// AddressForm.js
import React, { useState } from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center; /* Center vertically */
`;

const Form = styled.form`
  max-width: 600px;
  width: 100%;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  margin: 10px 0;
  font-size: 16px;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
`;

const Button = styled.button`
  width: 100%;
  border: none;
  padding: 15px 20px;
  background-color: black;
  color: white;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #333;
  }
`;

const AddressForm = ({ onSubmit }) => {
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(address);
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Label>
          Address:
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Label>
        <Button type="submit">Submit Address</Button>
      </Form>
    </FormContainer>
  );
};

export default AddressForm;
