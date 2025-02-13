import "./HistoryItem.css";
import React from "react";
import profile from "../assets/icon-profileHistory.png";
import rename from "../assets/icon-rename.png";
import duplicate from "../assets/icon-duplicate.png";
import share from "../assets/icon-share.png";
import deleteIcon from "../assets/icon-delete.png"; 
import { useState } from "react";
import axios from "axios";

function HistoryItem({ project, fetchProjects }) {
    const [notificationSuccess, setNotificationSuccess] = useState(null);
    const [notificationFailed, setNotificationFailed] = useState(null);

    const customAlert = (isGood, message) => {
        if (isGood) {
            setNotificationSuccess(message);
            setTimeout(() => setNotificationSuccess(null), 2500);
        }
        else {
            setNotificationFailed(message);
            setTimeout(() => setNotificationFailed(null), 2500);
        }
    };

    const renameButtonOnClick = () => {
        console.log("Rename button clicked");
    }

    const duplicateButtonOnClick = async () => {
        console.log("Duplicate button clicked");

        const newProject = {
            title: "Untitled project",
            userId: project.userId,
            dryAudio: project.dryAudio,
            wetAudio: project.wetAudio
        };

        try {
            const response = await axios.post('http://localhost:8080/data/projects', newProject);
            console.log("Project duplicated successfully:", response.data);
            customAlert(true, "Project duplicated successfully!");
            fetchProjects();
        } catch (error) {
            console.error("Error duplicating project:", error);

            if (error.response) {
                customAlert(false, `Failed: ${error.response.data.message || "Unhandled error"}`);
            } else if (error.request) {
                customAlert(false, "No response from the server. Please log in and try again.");
            } else {
                customAlert(false, "Unexpected JavaScript error: " + error.message);
            }
        }
    }

    const shareButtonOnClick = () => {
        console.log("Share button clicked");

        navigator.clipboard.writeText(`http://localhost:8080/project/${project.accessId}`)
            .then(() => customAlert(true, "URL copied to clipboard!"))
            .catch(err => console.error("Failed to copy share URL: ", err));
    }

    const deleteButtonOnClick = () => {
        console.log("Delete button clicked");

        try {
            axios.delete(`http://localhost:8080/data/projects/${project.id}`)
                .then(() => {
                    customAlert(true, "Project deleted successfully!");
                    fetchProjects();
                });
        } catch (error) {
            console.error("Error deleting project:", error);

            if (error.response) {
                customAlert(false, `Failed: ${error.response.data.message || "Unhandled error"}`);
            } else if (error.request) {
                customAlert(false, "No response from the server. Please log in and try again.");
            } else {
                customAlert(false, "Unexpected JavaScript error: " + error.message);
            }
        }
    }

    return (
        <div className="history-item">
            <div className="item-left">
                <img src={profile} alt="Profile" className="profile-img"/>
                <div className="item-info">
                    <p className="item-name">{project.title}</p>
                    {/* <p className="item-date">Date Modified {project.date}</p>
                    <p className="item-size">
                        {project.size} | {project.duration}
                    </p> */}
                </div>
            </div>
            <div className="item-right">
                <div className="item-button-container flex-row">
                    <button className="item-button gurajada" onClick={renameButtonOnClick}>
                        <img src={rename} alt="Rename" className="button-icon" />
                        <p>Rename</p>
                    </button>
                    <button className="item-button gurajada" onClick={duplicateButtonOnClick}>
                        <img src={duplicate} alt="Duplicate" className="button-icon" /> Duplicate
                    </button>
                    <button className="item-button gurajada" onClick={shareButtonOnClick}>
                        <img src={share} alt="Share" className="button-icon" /> Share
                    </button>
                    <button className="item-button gurajada" onClick={deleteButtonOnClick}>
                        <img src={deleteIcon} alt="Delete" className="button-icon" /> Delete
                    </button>
                </div>
            </div>

            { notificationSuccess && (
                <div className="notificationSuccess" >
                    {notificationSuccess}
                </div>
            )}

            { notificationFailed && (
                <div className="notificationFailed">
                    {notificationFailed}
                </div>
            )}
        </div>
    );
}

export default HistoryItem;