import "./HistoryItem.css";
import React from "react";
import profile from "../assets/icon-profileHistory.png";
import rename from "../assets/icon-rename.png";
import duplicate from "../assets/icon-duplicate.png";
import share from "../assets/icon-share.png";
import deleteIcon from "../assets/icon-delete.png"; 
import { useState } from "react";
import axios from "axios";
import WarningPopup from "./WarningPopup";
import { useEffect } from "react";

function HistoryItem({ project, fetchProjects }) {
    const [notificationSuccess, setNotificationSuccess] = useState(null);
    const [notificationFailed, setNotificationFailed] = useState(null);
    const [isWarningPopupOpen, setIsWarningPopupOpen] = useState(false);
    const [isRenameTarget, setIsRenameTarget] = useState(false);

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

        setIsRenameTarget(true);
    }

    useEffect(() => {
        const container = document.getElementById('container');
        if (isRenameTarget){
            container.style.backgroundColor = '#133E87';
        }
        else {
            container.style.backgroundColor = '';
        }
    }, [isRenameTarget])

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

        setIsWarningPopupOpen(true);
    }

    const deleteHistory = () => {
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

        setIsWarningPopupOpen(false);
    }

    const cancelDelete = () => {
        setIsWarningPopupOpen(false);
    };

    useEffect(() => {
        // Ambil elemen yang dibutuhkan
        const projectName = document.getElementById("project-name");
        const renameBtn = document.getElementById("rename-btn");

        // Event ketika tombol "Rename" ditekan
        renameBtn.addEventListener("click", function() {
            // Buat elemen input
            const input = document.createElement("input");
            input.type = "text";
            input.value = projectName.textContent; // Isi input dengan nama lama
            input.id = "rename-input";

            // Buat tombol "Save"
            const saveBtn = document.createElement("button");
            saveBtn.textContent = "Save";
            saveBtn.id = "save-btn";
            
            // Hapus teks "Dummy Project" dan tambahkan input serta tombol Save
            const container = projectName.parentElement;
            container.replaceChild(input, projectName);
            container.appendChild(saveBtn);

            // Event ketika tombol "Save" ditekan
            saveBtn.addEventListener("click", function() {
                const newName = input.value.trim() || "Untitled Project";

                projectName.textContent = newName;

                container.replaceChild(projectName, input);
                container.removeChild(saveBtn);

                setIsRenameTarget(false);
            });
        });
    }, [])

    return (
        <div id="container" className="history-item">
            <div className="item-left">
                <img src={profile} alt="Profile" className="profile-img"/>
                <div className="item-info">
                    <p id="project-name" className="item-name">{project.title}</p>
                    {/* <p className="item-date">Date Modified {project.date}</p>
                    <p className="item-size">
                        {project.size} | {project.duration} 
                    </p> */}

                </div>
            </div>
            <div className="item-right">
                <div className="item-button-container flex-row">
                    <button id="rename-btn" className="item-button gurajada" onClick={renameButtonOnClick}>
                        <img src={rename} alt="Rename" className="button-icon" /> Rename
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

            {isWarningPopupOpen && (
                <WarningPopup
                    message="Are you sure you want to delete this post?"
                    onConfirm={() => {
                        deleteHistory();
                    }}
                    onCancel={() => {
                        cancelDelete();
                    }}
                />
            )}
        </div>
    );
}

export default HistoryItem;