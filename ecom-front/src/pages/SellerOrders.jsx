// OrderTable.js
import React from 'react';
import './SellerOrders.css';
import SellerNavbar from './SellerNavbar';
import Axios from 'axios';
import  { useState, useEffect } from 'react';

// ... (other imports)

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await Axios.get('http://localhost:5001/api/orders/');
      const data = response.data;
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    try {
      await Axios.put(`http://localhost:5001/api/orders/${orderId}/complete`);
      fetchOrders();
    } catch (error) {
      console.error('Error completing order', error);
    }
  };

  return (
    <div>
      <SellerNavbar />
      <div className="order-table-container">
        <h1 className='order-table-header'>Orders</h1>
        <table className="order-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer ID</th>
              <th>Total Amount</th>
              <th>Shipping Address</th>
              <th>Status</th>
              <th>Products</th> {/* Change this header */}
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userid}</td>
                <td>{order.amount}</td>
                <td>{order.address}</td>
                <td>{order.status}</td>
                <td>
                  <ul>
                    {order.products?.map((product) => (
                      <li key={product.id}>
                        {product.name} - {product.quantity || 1} {product.size && `(${product.size})`}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{order.created_at}</td>
                <td>{order.updated_at}</td>
                <td>
                  {order.status !== 'completed' && (
                    <button onClick={() => handleCompleteOrder(order.id)}>
                      Mark as Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerOrders;
