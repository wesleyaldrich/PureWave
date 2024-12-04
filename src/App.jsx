import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Sidebar from './Components/Sidebar'
import Community from './Pages/Community'
import Lab from './Pages/Lab'
import History from './Pages/History';
import Create from './Components/Create';

function App() {
    return (<>
        <Router>
            <div className="app-container flex-row">
                <Sidebar />
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<Community />} />
                        <Route path="/lab" element={<Lab />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/create" element={<Create />} />
                    </Routes>
                </div>
            </div>
		</Router>
    </>)
}

export default App
