import { NavLink } from "react-router-dom";
import './Sidebar.css'
import logo from '../assets/logo.png'
import icon_community from '../assets/icon-community.png'
import icon_lab from '../assets/icon-lab.png'
import icon_history from '../assets/icon-history.png'

function Sidebar(){
    return (<>
        <div className="sidebar gurajada">
            <div className="sidebar-content flex-col">
                <div className="logo center-content">
                    <img src={logo} alt="PureWave Logo" />
                    <p>PUREWAVE</p>
                </div>

                <NavLink to="/" className="icon center-content" activeClassName="active" end>
                    <img src={icon_community} alt="PureWave Logo" />
                    <p>COMMUNITY</p>
                </NavLink>
                <NavLink to="/lab" className="icon center-content" activeClassName="active">
                    <img src={icon_lab} alt="PureWave Logo" />
                    <p>LABORATORY</p>
                </NavLink>
                <NavLink to="/history" className="icon center-content" activeClassName="active">
                    <img src={icon_history} alt="PureWave Logo" />
                    <p>HISTORY</p>
                </NavLink>
            </div>
        </div>
    </>)
}

export default Sidebar