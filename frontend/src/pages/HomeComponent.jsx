import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from '../contexts/AuthContext';
import { Button, TextField, ThemeProvider, CssBaseline } from '@mui/material';
import theme from "../utils/theme.js";
import zoom from '../assets/zoom2.avif';
import styles from "./HomeComponent.module.css";

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");


    const {addToUserHistory} = useContext(AuthContext);
    
    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`)
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <div className={styles.meetContainer}>
                <div className={styles.leftPanel}>
                    <div>
                        <h2>Providing Quality Video Call Just Like Quality Education</h2>

                        <div style={{ display: 'flex', gap: "10px" }}>

                            <TextField onChange={e => setMeetingCode(e.target.value)} id="outlined-basic" label="Meeting Code" variant="outlined" />
                            <Button onClick={handleJoinVideoCall} variant='contained'>Join</Button>

                        </div>
                    </div>
                </div>
                <div className={styles.rightPanel}>
                    <img src={zoom} alt="" />
                </div>
            </div>
        </ThemeProvider>
    )
}

export default withAuth(HomeComponent);