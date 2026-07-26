import "./LandingPage.css"
import zoom2 from '../assets/zoom2.avif'
import zoom from '../assets/zoom1.avif'
import { ThemeProvider, CssBaseline, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home"
import Typography from '@mui/material/Typography'
import { useNavigate } from "react-router-dom"


function Home() {

    const navigate = useNavigate();

    return ( <div className="landingPageContainer">
        <IconButton
          onClick={() => {
            navigate("/home");
          }}
        >
          <HomeIcon />
        </IconButton>
        <p className="appSlogan">"Learning is better when we connect together."</p>
        <div className="homeImg">
            <img src={zoom} alt="zoom" className="img"  />
            <div className="text">
                <h2>Connect. Learn. Collaborate.</h2>
                <p>A modern video conferencing platform designed for students, teachers, and study groups. Join classes, host meetings, share your screen, and collaborate from anywhere.</p>
            </div>
        </div>
        <div className="homeImg">
            <div className="text">
                <h2>Meet. Learn. Grow.</h2>
                <p>Experience high-quality video calls designed for students, educators, and collaborative teams. Learn without limits and connect effortlessly.</p>
            </div>    
            <img src={zoom2} alt="zoom" className="img" />
        </div>
        <div className="feature">
            <div>
                <h3>Our APP features:</h3>
                <ul style={{marginTop: "20px"}}>
                    <li>Group Discussions</li>
                    <li>Video Meetings</li>
                    <li>Remote Learning</li>
                    <li>Online Lecture</li>
                </ul>
            </div>
            <div>
                <h3>Student Use Cases</h3>
                <ul style={{marginTop: "20px"}}>
                    <li>Attend online college lectures</li>
                    <li>Prepare for coding interviews with friends</li>
                    <li>Group assignment discussions</li>
                    <li>Placement preparation sessions</li>
                    <li>Teacher–student doubt solving</li>
                    <li>Online workshops and seminars</li>
                </ul>
            </div>
        </div>
        <p className="appSlogan">One Platform <br /> Endless way to connect togeather</p>
    </div> );
}

export default Home;