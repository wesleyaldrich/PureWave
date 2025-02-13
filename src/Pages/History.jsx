import './History.css'
import HistoryItem from '../Components/HistoryItem'
import addEnhance from "../assets/icon-addEnhance.png";
import { NavLink } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function History() {
	const [projects, setProjects] = useState([]);

	const API_BASE_URL = 'http://localhost:8080'

	const fetchProjects = () => {
		try {
			axios.get(`${API_BASE_URL}/data/projects`)
				.then((response) => {
					console.log("Projects received:", response.data);
					setProjects(response.data);
				});
		} catch (error) {
			console.error("Error loading project:", error);
		}
	}

	// on mount, fetch all projects
	useEffect(() => {
		fetchProjects();
	}, []);

	const staticHistory = {
		id: "dummyId",
		title: "Dummy Project",
		userId: "dummyUserId",
		dryAudio: "dummyDryAudio",
		wetAudio: "dummyWetAudio",
		accessId: "dummyAccessId",
	}

	return (
		<div className="history-page container-fluid">
		<h1 className="title firacode">HISTORY</h1>
		<div className="buttons flex-row justify-content-between gurajada">
			<NavLink to="/lab" className="button col-4" end>
				<img src={addEnhance} alt="Icon Add Enhance" className="ebutton-icon" />
				<a>ENHANCE YOUR AUDIO</a>
			</NavLink>
		</div>

		<div className="history-list container-fluid">

			{/* FOR STATIC DEMO, DELETE SOON! */}
			<HistoryItem project={staticHistory} />

			{projects.length > 0 ? (
				projects.map(
					(project, index) => (
						<HistoryItem
							key={index}
							project={project}
							fetchProjects={fetchProjects}
						/>
					)
				)
			) : (<p>No project available.</p>)
			}
		</div>
			<p className='copyright cambria'>copyrights©2024 Reserved by PureWave</p>
		</div>
	);
}

export default History;
