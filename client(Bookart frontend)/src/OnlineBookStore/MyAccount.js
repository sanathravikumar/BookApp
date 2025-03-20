import React, { useEffect, useState } from "react";
import { Container, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyAccount = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!accessToken) {
                // Redirect to login if no token is found
                navigate("/");
                return;
            }

            try {
                const response = await axios.get("http://localhost:5135/api/Users", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUser(response.data); // Assuming the API returns user details
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user details:", error);
                if (error.response && error.response.status === 401) {
                    // Token is invalid or expired, redirect to login
                    localStorage.removeItem("accessToken"); // Clear invalid token
                    navigate("/");
                }
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [accessToken, navigate]);

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container className="mt-4 text-center">
                <p>No user data found.</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2 className="text-center">My Account</h2>
            <Card className="p-4 shadow-sm">
                <Card.Body>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Cell Number:</strong> {user.cellNumber}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default MyAccount;