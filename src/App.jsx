import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Sidebar from './Components/Sidebar'
import AuthButton from './Components/AuthButton';
import Community from './Pages/Community'
import Lab from './Pages/Lab'
import History from './Pages/History';
import GetHelp from './Pages/GetHelp';
import Profile from './Components/Profile';
import { useState } from "react";
import BeforeEnhance from './Components/BeforeEnhance'
import EnhanceItem from './Components/EnhanceItem'
import Project from './Pages/Project';

function App() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    return (<>
        <Router>
            <div className="app-container flex-row">
                <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded}/>
                <div className="profile-auth flex-row center-content">
                    <AuthButton />
                    <Profile />
                </div>
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<Community isSidebarExpanded={isSidebarExpanded} />} />
                        <Route path="/lab" element={<Lab />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/gethelp" element={<GetHelp />} />
                        <Route path="/project/:accessId" element={<Project />} />
                        <Route path="/lab/enhanced-menu" element={<EnhanceItem />} />
                        <Route path="/lab/before-enhance" element={<BeforeEnhance />} />
                    </Routes>
                </div>
            </div>
		</Router>
    </>)
}

export default App
