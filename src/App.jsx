import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Sidebar from './Components/Sidebar'
import Community from './Pages/Community'

function App() {
    return (<>
        <Router>
            <div className="app-container flex-row">
                <Sidebar />
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<Community />} />
                        {/* <Route path="/projects" element={<Projects />} />
                        <Route path="/about-me" element={<AboutMe />} />
                        <Route path="/music" element={<Music />} /> */}
                    </Routes>
                </div>
            </div>
		</Router>
    </>)
}

export default App
