import React from "react";

const AddToCart = ({ book, addToCart }) => {
    return (
        <button
            className="btn btn-primary"
            onClick={() => addToCart(book)} // Trigger the addToCart function
        >
            Add to Cart
        </button>
    );
};

export default AddToCart;