import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Row, Col, Image } from "react-bootstrap";

const CartPage = ({ cart, setCart }) => {
    const navigate = useNavigate();

    const updateQuantity = (bookId, change) => {
        const updatedCart = cart.map(item =>
            item.bookId === bookId ? { ...item, quantity: item.quantity + change } : item
        ).filter(item => item.quantity > 0);
        setCart(updatedCart);
    };

    const clearCart = () => {
        setCart([]);
    };

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <Container className="mt-4 pb-5">
            <h2 className="text-center mb-4">🛒 Shopping Cart</h2>
            {cart.length === 0 ? (
                <div className="text-center">
                    <p>Your cart is empty.</p>
                    <Button variant="primary" onClick={() => navigate("/store")}>🏠 Back to Home</Button>
                </div>
            ) : (
                <>
                    {cart.map((item) => (
                        <Card key={item.bookId} className="mb-3 p-3 shadow-sm border-0">
                            <Row className="align-items-center">
                                <Col xs={2} className="text-center">
                                    <Image
                                        src={`/images/${item.coverImageName}`}
                                        alt={item.title}
                                        style={{ width: "80px", height: "100px", objectFit: "contain" }}
                                        className="rounded shadow-sm"
                                    />
                                </Col>
                                <Col>
                                    <h5 className="fw-bold">{item.title}</h5>
                                    <p className="text-muted"><strong>Author:</strong> {item.author}</p>
                                    <p className="mb-1"><strong>Price:</strong> ₹{item.price.toFixed(2)}</p>
                                    <p className="mb-1"><strong>Quantity:</strong> {item.quantity}</p>
                                    <p className="fw-bold">Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                                </Col>
                                <Col xs="auto" className="d-flex align-items-center">
                                    <Button variant="outline-danger" onClick={() => updateQuantity(item.bookId, -1)}>-</Button>
                                    <span className="mx-3 fw-bold">{item.quantity}</span>
                                    <Button variant="outline-success" onClick={() => updateQuantity(item.bookId, 1)}>+</Button>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </>
            )}

            {cart.length > 0 && (
                <div className="w-100 position-fixed bottom-0 start-0 end-0 bg-white border-top shadow p-3">
                    <div className="text-center pb-2">
                        <h4 className="fw-bold">Subtotal: ₹{subtotal.toFixed(2)}</h4>
                    </div>
                    <div className="d-flex justify-content-center gap-3">
                        <Button variant="outline-danger" onClick={clearCart}>Clear Cart</Button>
                        <Button variant="outline-primary" onClick={() => navigate("/store")}>Back to Home</Button>
                        <Button variant="success" onClick={() => navigate("/payment", { state: { cart, grandTotal: subtotal } })}>Proceed to Payment</Button>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default CartPage;
