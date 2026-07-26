import { useNavigate } from "react-router-dom";
import theme from "../utils/theme.js";
import { ThemeProvider, CssBaseline, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from "./Support.module.css";

function Support() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={styles.page}>
        <IconButton
          className={styles.homeButton}
          onClick={() => {
            navigate("/home");
          }}
        >
          <HomeIcon />
        </IconButton>
      </div>
      <main className={styles.supportContainer}>
        <section className={styles.hero}>
          <Typography variant="overline" className={styles.eyebrow}>
            LiveMeet support
          </Typography>
          <Typography variant="h2" component="h1" className={styles.title}>
            How can we help?
          </Typography>
          <Typography className={styles.subtitle}>
            Find quick answers or contact our team if you need help with your
            meetings.
          </Typography>
        </section>

        <Card className={styles.card} variant="outlined">
          <CardContent>
            <Typography variant="h5" component="h2">Need assistance?</Typography>
            <Typography className={styles.cardText}>
              Having trouble joining a call or using your camera and
              microphone? Our support team is ready to help.
            </Typography>
            <Button variant="contained" color="primary" href="https://chatgpt.com/">
              Contact support
            </Button>
          </CardContent>
        </Card>

        <Card className={styles.card} variant="outlined">
          <CardContent>
            <Typography variant="h5" component="h2">Quick tips</Typography>
            <ul className={styles.tipList}>
              <li>Check your camera and microphone permissions.</li>
              <li>Use a stable internet connection for better calls.</li>
              <li>Refresh the meeting if another user cannot connect.</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </ThemeProvider>
  );
}

export default Support;
