import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Button, Row, Col, Form, Image } from "react-bootstrap";
import axios from "axios";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, grandTotal } = location.state || { cart: [], grandTotal: 0 };

    // Payment State
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validate cart and grandTotal
            if (!cart || cart.length === 0 || !grandTotal) {
                alert("Invalid cart or total amount. Please try again.");
                return;
            }

            // Get UserID from the accessToken
            const accessToken = localStorage.getItem("accessToken");
            const decodedToken = JSON.parse(atob(accessToken.split(".")[1])); // Decode the JWT token
            const userId = decodedToken.UserID;

            if (!userId) {
                alert("UserID is missing. Please log in again.");
                return;
            }

            // Create order
            const orderResponse = await axios.post(
                "http://localhost:5135/api/Orders",
                {
                    UserID: userId, // Include UserID in the request
                    orderDate: new Date().toISOString(), // Ensure the date is in the correct format
                    totalAmount: grandTotal, // Ensure this is a valid number
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const orderId = orderResponse.data.orderId;

            // Create order details
            await Promise.all(
                cart.map((item) =>
                    axios.post(
                        "http://localhost:5135/api/OrderDetails",
                        {
                            orderId,
                            bookId: item.bookId,
                            quantity: item.quantity,
                            price: item.price,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    )
                )
            );

            alert("Payment Successful!");
            navigate("/store"); // Redirect to the home page after successful payment
        } catch (error) {
            console.error("Error during payment:", error);

            // Display a user-friendly error message
            if (error.response) {
                // Server responded with a status code outside the 2xx range
                alert(`Payment failed: ${error.response.data.message || "Please try again."}`);
            } else if (error.request) {
                // No response received from the server
                alert("Payment failed: No response from the server. Please check your connection.");
            } else {
                // Something went wrong in setting up the request
                alert("Payment failed: An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <Container className="mt-4 d-flex flex-column justify-content-between" style={{ minHeight: "100vh" }}>
            {/* Payment Page Title */}
            <h2 className="text-center">
                <i className="bi bi-credit-card"></i> Payment Page
            </h2>

            {/* Purchase Items */}
            {cart.length === 0 ? (
                <p className="text-center">No items to purchase.</p>
            ) : (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {cart.map((item) => (
                        <Card key={item.bookId} className="mb-3 p-3 shadow-sm">
                            <Row className="align-items-center">
                                <Col>
                                    <h5>{item.title}</h5>
                                    <p><strong>Price:</strong> ₹{item.price.toFixed(2)}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <p><strong>Total:</strong> ₹{(item.price * item.quantity).toFixed(2)}</p>
                                </Col>
                                {/* Book Cover Image at Right End */}
                                <Col xs="auto">
                                    <Image
                                        src={process.env.PUBLIC_URL + "/images/" + item.coverImageName}
                                        alt={item.title}
                                        style={{ width: "80px", height: "100px", objectFit: "contain" }}
                                        className="shadow-sm"
                                    />
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            )}

            {/* Payment Form */}
            {cart.length > 0 && (
                <Card className="p-4 my-3 shadow-sm">
                    <h4 className="text-center mb-4">Enter Payment Details</h4>
                    <Form onSubmit={handleSubmit}>
                        {/* Card Number */}
                        <Row className="mb-3 align-items-center">
                            <Col xs={9}>
                                <Form.Control
                                    type="text"
                                    placeholder="Card Number"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    maxLength="19"
                                    autoComplete="off"
                                    inputMode="numeric"
                                    required
                                />
                            </Col>
                            <Col xs={3} className="text-end">
                                <img
                                    src="https://img.icons8.com/color/48/000000/visa.png"
                                    alt="visa"
                                    width="48"
                                />
                            </Col>
                        </Row>

                        {/* Cardholder Name */}
                        <Row className="mb-3">
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Cardholder's Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="off"
                                    required
                                />
                            </Col>
                        </Row>

                        {/* Expiry Date & CVV */}
                        <Row className="mb-3">
                            <Col xs={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="MM/YYYY"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    maxLength="7"
                                    autoComplete="off"
                                    inputMode="numeric"
                                    required
                                />
                            </Col>
                            <Col xs={6}>
                                <Form.Control
                                    type="password"
                                    placeholder="CVV"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    maxLength="3"
                                    autoComplete="new-password"
                                    inputMode="numeric"
                                    required
                                />
                            </Col>
                        </Row>

                        {/* Confirm Payment Button */}
                        <Button variant="success" type="submit" className="w-100">
                            ✅ Confirm Payment
                        </Button>
                    </Form>
                </Card>
            )}

            {/* Grand Total */}
            {cart.length > 0 && (
                <div className="w-100 text-center p-3 bg-light rounded">
                    <h4><strong>Total Amount:</strong> ₹{grandTotal.toFixed(2)}</h4>
                </div>
            )}

            {/* Fixed Bottom Buttons */}
            <div className="w-100 d-flex justify-content-center gap-3 p-3 position-fixed bottom-0 start-0 end-0 bg-white border-top shadow">
                <Button variant="secondary" className="px-4" onClick={() => navigate("/cart")}>
                    🔙 Back to Cart
                </Button>
            </div>
        </Container>
    );
};

export default PaymentPage;