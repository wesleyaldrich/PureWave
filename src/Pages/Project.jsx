import EnhanceItem from "../Components/EnhanceItem";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Project() {
    const [notificationSuccess, setNotificationSuccess] = useState(false);
    const [notificationFailed, setNotificationFailed] = useState(false);
    let { accessId } = useParams();
    const [project, setProject] = useState({});
    const [fileName, setFileName] = useState('');

    const fetchProject = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/data/projects/${accessId}`);
            setProject(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (accessId){
            fetchProject();

            console.log("Access Id: " + accessId);
            console.log("Fetched project:", project);
        }
    }, [accessId]);

    useEffect(() => {
        if (project.dryAudio) {
            var splitText = project.dryAudio.substring(project.dryAudio.indexOf('_') + 1)
            console.log(splitText)
            setFileName(splitText);
        } else {
            setFileName('');
        }
    }, [project.dryAudio, fileName]);

    return (
        <div className="lab-page container-fluid flex-col">
            <EnhanceItem
                dryAudio={project.dryAudio}
                wetAudio={project.wetAudio}
                uploadedFileName={fileName}
            />

            { notificationSuccess && (
                <div className="notificationSuccess" >
                    {notificationSuccess}
                </div>
            )}

            {notificationFailed && (
                <div className="notificationFailed">
                    {notificationFailed}
                </div>
            )}
        </div>
    );
}

export default Project;