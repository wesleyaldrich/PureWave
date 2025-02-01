import { useState, useEffect } from "react";
import '../App.css';

function AuthButton() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const handleLogout = () => {
        fetch("http://localhost:8080/logout", { method: "POST", credentials: "include" })
            .then(() => {
                localStorage.removeItem("authToken");
                setIsAuthenticated(false);
            })
            .catch(error => console.error("Logout failed:", error));
    };

    useEffect(() => {
        fetch("http://localhost:8080/auth/token", { credentials: "include" }) 
            .then(response => response.json())
            .then(data => {
                console.log("Token fetched:", data.token); // Debugging
                if (data.token) {
                    localStorage.setItem("authToken", data.token);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            })
            .catch(error => console.error("Error fetching token:", error));
    }, []);
    

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
