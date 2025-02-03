import icon_profile from "../assets/icon-profile.png";
import "./Profile.css";
import { useState, useEffect } from "react";

function Profile() {
    const [email, setEmail] = useState(null);
    const [authToken, setAuthToken] = useState(null);

    const onLogout = () => {
        setEmail(null);
        setAuthToken(null);
    };

    useEffect(() => {
        const checkAuth = () => {
            fetch("http://localhost:8080/auth/token", { credentials: "include" }) 
                .then(response => response.json())
                .then(data => {
                    if (data.token) {
                        setAuthToken(data.token);
                    } else {
                        // console.log("Auth token missing. Logging out...");
                        onLogout();
                    }
                })
            .catch(error => console.error("Error fetching token:", error));
        };

        checkAuth();
        const interval = setInterval(checkAuth, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (!authToken) return; // Don't fetch if not authenticated

        fetch("http://localhost:8080/auth/email", { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error("Not authenticated");
                return res.json();
            })
            .then((data) => {
                if (data.email) setEmail(data.email);
            })
            .catch(() => {
                onLogout(); // Logout if request fails
            });
    }, [authToken]);

    const profileImageUrl = email
        ? `http://localhost:8080/user-profile-images/${encodeURIComponent(email)}/profile.jpg`
        : icon_profile;

    return (
        <div className="profile flex-row">
            <img 
                src={profileImageUrl} 
                className="profile-img" 
                alt="Profile" 
                onError={(e) => e.target.src = icon_profile} // Fallback to default icon if image not found
            />
        </div>
    );
}

export default Profile;
