import React, { useState } from "react"; // Import React and useState once
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginAndSignUp from "./components/LoginAndSignUp";
import PageNotFound from "./components/PageNotFound";
import OnlineBookstore from "./OnlineBookStore/OnlineBookstore";
import CartPage from "./OnlineBookStore/CartPage";
import PaymentPage from "./OnlineBookStore/PaymentPage";
import OrderHistory from "./OnlineBookStore/OrderHistory";
function App() {
    const [cart, setCart] = useState([]); // Cart state

    // Function to add a book to the cart
    const addToCart = (book) => {
        const existingItem = cart.find((item) => item.bookId === book.bookId);
        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.bookId === book.bookId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([...cart, { ...book, quantity: 1 }]);
        }
        alert(`${book.title} added to cart!`);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginAndSignUp />} />
                <Route
                    path="/store"
                    element={<OnlineBookstore cart={cart} addToCart={addToCart} />} // Pass cart and addToCart as props
                />
                <Route
                    path="/cart"
                    element={<CartPage cart={cart} setCart={setCart} />} // Pass cart to CartPage
                />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/order-history" element={<OrderHistory />} /> {/* Order History Route */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Router>
    );
}

export default App;

