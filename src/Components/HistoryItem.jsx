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

function HistoryItem({ project, renamingId, setRenamingId, deletingId, setDeletingId, fetchProjects}) {
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
        if (renamingId === project.id && isRenameTarget) {
            const cancelBtn = document.getElementById(`cancel-btn-${project.id}`);

            cancelBtn.click();
            return;
        }

        if (renamingId !== null && renamingId !== project.id) {
            customAlert(false, "Another project is currently being renamed.");
            return;
        }

        if(deletingId !== null){
            customAlert(false, "Another project is currently being deleted.");
            return;
        }

        setRenamingId(project.id);
        setIsRenameTarget(true);
    
        const projectName = document.getElementById(`project-name-${project.id}`);
        const renameBtn = document.getElementById(`rename-btn-${project.id}`);
    
        if (!projectName || !renameBtn) return;
    
        // Buat input
        const input = document.createElement("input");
        input.type = "text";
        input.value = projectName.textContent;
        input.id = `rename-input-${project.id}`;
        input.className = "rename-input";
    
        // Buat tombol Cancel
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.id = `cancel-btn-${project.id}`;
        cancelBtn.className = "cancel-btn";
    
        // Ganti teks dengan input
        const container = projectName.parentElement;
        container.replaceChild(input, projectName);
        container.appendChild(cancelBtn);

        // Event listener untuk menyimpan perubahan saat tekan Enter
        input.addEventListener("keydown", async function (e) {
            if (e.key === "Enter") {
                const newName = input.value.trim() || "Untitled Project";
                projectName.textContent = newName;
    
                // Simpan ke database
                try {
                    await axios.put(`http://localhost:8080/data/projects/${project.id}`, {
                        title: newName
                    });
    
                    customAlert(true, "Project renamed successfully!");
                    fetchProjects();
                } catch (error) {
                    console.error("Error renaming project:", error);
                    customAlert(false, "Failed to rename project.");
                }
    
                // Kembalikan teks asli
                container.replaceChild(projectName, input);
                container.removeChild(cancelBtn);
                setIsRenameTarget(false);
                setRenamingId(null);
            }
        });
    
        // Event listener untuk membatalkan perubahan
        cancelBtn.addEventListener("click", function () {
            container.replaceChild(projectName, input);
            container.removeChild(cancelBtn);
            setIsRenameTarget(false);
            setRenamingId(null);
        });
    
        // Auto fokus pada input
        input.focus();
    };

    useEffect(() => {
        const container = document.getElementById(`container-${project.id}`);

        if (container) {
            if (isRenameTarget) {
                container.style.backgroundColor = '#133E87';
            } else {
                container.style.backgroundColor = ''; 
            }
        }
    }, [isRenameTarget]);

    useEffect(() => {
        const projectName = document.getElementById(`project-name-${project.id}`);
        const container = document.getElementById(`container-${project.id}`);

        if (container) {
            if (isWarningPopupOpen) {
                container.style.backgroundColor = '#133E87';
                projectName.style.color = '#CBDCEB'

            } else {
                projectName.style.color = ''; 
                container.style.backgroundColor = ''; 
            }
        }
    }, [isWarningPopupOpen]);

    const duplicateButtonOnClick = async () => {
        console.log("Duplicate button clicked");

        const newProject = {
            title: project.title,
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

    const copyText = (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(() => customAlert(true, "URL copied to clipboard!"))
                .catch(err => console.error("Failed to copy share URL: ", err));
        } else {
            // Fallback for non-secure contexts (HTTP)
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
                customAlert(true, "URL copied to clipboard!");
            } catch (err) {
                console.error("Fallback copy failed: ", err);
                customAlert(false, "Copy failed.");
            }
            document.body.removeChild(textArea);
        }
    };
    
    const shareButtonOnClick = () => {
        console.log("Share button clicked");
        copyText(`http://localhost:8080/project/${project.accessId}`);
    };

    const deleteButtonOnClick = () => {
        console.log("Delete button clicked");
        if(deletingId !== null && deletingId === project.id){
            cancelDelete()
            return;
        }
        
        if(deletingId !== null){
            customAlert(false, "Another project is currently being deleted.");
            return;
        }

        if(renamingId !== null){
            customAlert(false, "Another project is currently being renamed.");
            return; 
        }


        setDeletingId(project.id);
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

        setDeletingId(null);
        setIsWarningPopupOpen(false);
    }

    const cancelDelete = () => {
        setDeletingId(null);
        setIsWarningPopupOpen(false);
    };

    // useEffect(() => {
    //     // Ambil elemen yang dibutuhkan
    //     const projectName = document.getElementById("project-name");
    //     const renameBtn = document.getElementById("rename-btn");

    //     // Event ketika tombol "Rename" ditekan
    //     renameBtn.addEventListener("click", function() {
    //         // Buat elemen input
    //         const input = document.createElement("input");
    //         input.type = "text";
    //         input.value = projectName.textContent; // Isi input dengan nama lama
    //         input.id = "rename-input";

    //         // Buat tombol "Save"
    //         const saveBtn = document.createElement("button");
    //         saveBtn.textContent = "Save";
    //         saveBtn.id = "save-btn";
            
    //         // Hapus teks "Dummy Project" dan tambahkan input serta tombol Save
    //         const container = projectName.parentElement;
    //         container.replaceChild(input, projectName);
    //         container.appendChild(saveBtn);

    //         // Event ketika tombol "Save" ditekan
    //         saveBtn.addEventListener("click", function() {
    //             const newName = input.value.trim() || "Untitled Project";

    //             projectName.textContent = newName;

    //             container.replaceChild(projectName, input);
    //             container.removeChild(saveBtn);

    //             setIsRenameTarget(false);
    //         });
    //     });
    // }, [])

    return (
        <div id={`container-${project.id}`} className={`history-item ${isWarningPopupOpen || isRenameTarget? '' : 'cursor'}`}>
            <div className={`accessProject ${isWarningPopupOpen || isRenameTarget ? 'deactive' : ''}`} onClick={() => window.location.href = `/project/${project.accessId}`}></div>

            <div className="item-left">
                <img src={profile} alt="Profile" className="profile-img"/>
                <div className="item-info">
                    <p id={`project-name-${project.id}`} className="item-name">{project.title}</p>
                    {/* <p className="item-date">Date Modified {project.date}</p>
                    <p className="item-size">
                        {project.size} | {project.duration} 
                    </p> */}
                </div>
            </div>
            <div className="item-right">
                <div className="item-button-container flex-row">
                    <button id={`rename-btn-${project.id}`} className="item-button gurajada" onClick={renameButtonOnClick}>
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
                    message="Are you sure want to delete this selected?"
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