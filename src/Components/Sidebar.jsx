import { NavLink } from "react-router-dom";
import './Sidebar.css'
import logo from '../assets/logo.png'
import icon_community from '../assets/icon-community.png'
import icon_lab from '../assets/icon-lab.png'
import icon_history from '../assets/icon-history.png'
import icon_help from '../assets/icon-help.png'

function Sidebar(){
    return (<>
        <div className="sidebar gurajada">
            <div className="sidebar-content flex-col">
                <div className="logo center-content">
                    <img src={logo} alt="PureWave Logo" />
                    <p>PUREWAVE</p>
                </div>
                
                <NavLink to="/"  id="community" className="icon center-content" activeClassName="active" end>
                    <img src={icon_community} alt="Icon Community" />
                    <p>COMMUNITY</p>
                </NavLink>
                <NavLink to="/lab" id="lab" className="icon center-content" activeClassName="active">
                    <img src={icon_lab} alt="Icon Laboratory" />
                    <p>LABORATORY</p>
                </NavLink>
                <NavLink to="/history" id="history" className="icon center-content" activeClassName="active">
                    <img src={icon_history} alt="Icon History" />
                    <p>HISTORY</p>
                </NavLink>

                <NavLink to="/" className="help center-content">
                    <img src={icon_help} alt="Icon Help" />
                </NavLink>
            </div>
        </div>
    </>)
}

export default Sidebar