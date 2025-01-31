import { useState, useEffect } from "react";
import '../App.css';

function AuthButton() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);  // Use state setter

        window.location.href = "http://localhost:8080/logout";
    };

    function getAuthTokenFromCookies() {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [name, value] = cookie.split("=");
            if (name === "authToken") {
                return value;
            }
        }
        return null;
    }

    useEffect(() => {
        const token = getAuthTokenFromCookies();
        if (token) {
            localStorage.setItem("authToken", token);
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []); // Run once on component mount

    return (
        <div className="auth-button gurajada center-content">
            {isAuthenticated ? (
                <a className="center-content" onClick={handleLogout}>LOG OUT</a>
            ) : (
                <a className="center-content" onClick={handleLogin}>LOG IN</a>
            )}
        </div>
    );
}

export default AuthButton;
