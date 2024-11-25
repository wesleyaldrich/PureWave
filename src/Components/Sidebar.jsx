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
                <div className="icon center-content">
                    <img src={icon_community} alt="PureWave Logo" />
                    <p>COMMUNITY</p>
                </div>
                <div className="icon center-content">
                    <img src={icon_lab} alt="PureWave Logo" />
                    <p>LABORATORY</p>
                </div>
                <div className="icon center-content">
                    <img src={icon_history} alt="PureWave Logo" />
                    <p>HISTORY</p>
                </div>
            </div>
        </div>
    </>)
}

export default Sidebar