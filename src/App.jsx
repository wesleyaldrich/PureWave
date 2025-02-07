import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Sidebar from './Components/Sidebar'
import AuthButton from './Components/AuthButton';
import Community from './Pages/Community'
import Lab from './Pages/Lab'
import History from './Pages/History';
import GetHelp from './Pages/GetHelp';
import Enhance from './Pages/enhance';
import Profile from './Components/Profile';
import { useState } from "react";

function App() {
    return (<>
        <Router>
            <div className="app-container flex-row">
                <Sidebar />
                <div className="profile-auth flex-row center-content">
                    <AuthButton />
                    <Profile />
                </div>
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<Community />} />
                        <Route path="/lab" element={<Lab />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/gethelp" element={<GetHelp />} />
                        <Route path="/enhance" element={<Enhance />} />
                    </Routes>
                </div>
            </div>
		</Router>
    </>)
}

export default App
