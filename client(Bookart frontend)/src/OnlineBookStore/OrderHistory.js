import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const decodedToken = JSON.parse(atob(accessToken.split("." )[1]));
                const userId = decodedToken.UserID;

                if (!userId) {
                    alert("UserID is missing. Please log in again.");
                    navigate("/");
                    return;
                }

                const ordersResponse = await axios.get(`http://localhost:5135/api/Orders?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const ordersWithDetails = await Promise.all(
                    ordersResponse.data.map(async (order) => {
                        const detailsResponse = await axios.get(`http://localhost:5135/api/OrderDetails?orderId=${order.orderId}`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        });

                        const detailsWithTitles = await Promise.all(
                            detailsResponse.data.map(async (detail) => {
                                const bookResponse = await axios.get(`http://localhost:5135/api/Books/${detail.bookId}`, {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                });
                                return { ...detail, title: bookResponse.data.title };
                            })
                        );

                        return { ...order, details: detailsWithTitles };
                    })
                );

                setOrders(ordersWithDetails);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching order history:", error);
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [accessToken, navigate]);

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (orders.length === 0) {
        return (
            <Container className="mt-4 text-center">
                <p className="text-muted">No orders found.</p>
                <Button variant="primary" onClick={() => navigate("/store")}>Back to Home</Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2 className="text-center text-primary">Order History</h2>
            <Table striped bordered hover variant="light" className="shadow-sm rounded">
                <thead className="bg-primary text-white">
                    <tr>
                        <th>Order ID</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Books</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderId} className="text-center">
                            <td className="fw-bold text-primary">{order.orderId}</td>
                            <td className="text-secondary">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td className="fw-bold text-success">₹{order.totalAmount.toFixed(2)}</td>
                            <td>
                                {order.details.map((detail, index) => (
                                    <span key={index} className="text-dark">
                                        {detail.title} <span className="badge bg-info text-white">Qty: {detail.quantity}</span>{index < order.details.length - 1 ? ", " : ""}
                                    </span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="text-center mt-4">
                <Button variant="outline-primary" onClick={() => navigate("/store")}>Back to Home</Button>
            </div>
        </Container>
    );
};

export default OrderHistory;
