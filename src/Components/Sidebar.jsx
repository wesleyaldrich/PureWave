import { NavLink } from "react-router-dom";
import './Sidebar.css'
import logo from '../assets/logo.png'
import icon_community from '../assets/icon-community.png'
import icon_lab from '../assets/icon-lab.png'
import icon_history from '../assets/icon-history.png'
<<<<<<< HEAD
<<<<<<< HEAD
import icon_faq from '../assets/icon-faq.png'
=======
import icon_help from '../assets/icon-help.png'
>>>>>>> c2a9fccca2375b2f223863e0b65b1f01f8df4057
=======
import icon_help from '../assets/icon-help.png'
>>>>>>> c2a9fccca2375b2f223863e0b65b1f01f8df4057

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
<<<<<<< HEAD
<<<<<<< HEAD
                <NavLink to="/gethelp" className="icon center-content" activeClassName="active">
                    <img src={icon_faq} alt="PureWave Logo" />
                    <p>HELP</p>
=======
                <NavLink to="/gethelp" className="help center-content">
                    <img src={icon_help} alt="Icon Help" />
>>>>>>> c2a9fccca2375b2f223863e0b65b1f01f8df4057
=======
                <NavLink to="/gethelp" className="help center-content">
                    <img src={icon_help} alt="Icon Help" />
>>>>>>> c2a9fccca2375b2f223863e0b65b1f01f8df4057
                </NavLink>
            </div>
        </div>
    </>)
}

export default Sidebar