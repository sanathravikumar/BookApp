import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./OnlineBookstore.css";
import axios from "axios";
import AddToCart from "./AddToCart";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const OnlineBookstore = ({ cart, addToCart }) => {
    const [categories, setCategories] = useState([]);
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get("http://localhost:5135/api/Categories", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setCategories([{ categoryId: null, categoryName: "All Categories" }, ...categoriesResponse.data]);

                const booksResponse = await axios.get("http://localhost:5135/api/Books", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setBooks(booksResponse.data);
                setFilteredBooks(booksResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Failed to fetch data. Please log in again.");
            }
        };

        fetchData();
    }, [accessToken]);

    const filterBooks = (categoryId) => {
        if (categoryId === null) {
            setFilteredBooks(books);
        } else {
            setFilteredBooks(books.filter((book) => book.categoryId === categoryId));
        }
        setSelectedCategory(categoryId);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = books.filter(
            (book) =>
                book.title.toLowerCase().includes(query.toLowerCase()) ||
                book.author.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredBooks(filtered);
    };

    return (
        <div className="online-bookstore">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">BooKart</a>

                    <div className="mx-auto" style={{ width: "50%" }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by title or author"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>

                    <div className="d-flex align-items-center">
                        <button className="cart-button btn btn-light" onClick={() => navigate("/cart")}> 
                            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                            {cart.length > 0 && <span className="cart-badge badge bg-danger">{cart.length}</span>}
                        </button>
                        <ProfileDropdown />
                    </div>
                </div>
            </nav>

            <div className="container text-center my-3">
                <div className="btn-group" role="group">
                    {categories.map((cat) => (
                        <button
                            key={cat.categoryId}
                            className={`btn ${selectedCategory === cat.categoryId ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => filterBooks(cat.categoryId)}
                        >
                            {cat.categoryName}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container book-grid">
                <div className="row">
                    {filteredBooks.map((book) => (
                        <div key={book.bookId} className="col-md-3 mb-4">
                            <div className="card shadow-sm h-100 border-0">
                                <img
                                    src={`/images/${book.coverImageName}`}
                                    className="card-img-top rounded-top"
                                    alt={book.title}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title text-primary">{book.title}</h5>
                                    <p className="card-text text-muted">{book.author}</p>
                                    <p className="card-price text-success fw-bold">₹{book.price.toFixed(2)}</p>
                                    <AddToCart book={book} addToCart={addToCart} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OnlineBookstore;
