import React from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

const ProfileDropdown = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken"); // Clear the access token
        localStorage.removeItem("userId"); // Clear the user ID
        navigate("/"); // Redirect to the root path where LoginAndSignUp is rendered
    };

    return (
        <Dropdown className="ms-3">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                <i className="bi bi-person-circle"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => navigate("/order-history")}>Order History</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfileDropdown;