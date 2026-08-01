import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  TextField,
  Button,
  IconButton,
  Badge,
  InputAdornment,
} from "@mui/material";
import "./VideoComponent.css";
import theme from "../utils/theme.js";
import io from "socket.io-client";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SendIcon from "@mui/icons-material/Send";

const server_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function VideoMeet() {
  var socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoref = useRef();
  const localStreamRef = useRef(null);
  const connectionsRef = useRef({});

  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState(false);

  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModal, setModal] = useState(true);

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  const navigate = useNavigate();

  const getPermission = async () => {
    let previewStream;
    try {
      previewStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setVideoAvailable(previewStream.getVideoTracks().length > 0);
      setAudioAvailable(previewStream.getAudioTracks().length > 0);
    } catch {
      // A denied camera should not prevent microphone-only calls (and vice versa).
      const [camera, microphone] = await Promise.allSettled([
        navigator.mediaDevices.getUserMedia({ video: true }),
        navigator.mediaDevices.getUserMedia({ audio: true }),
      ]);
      setVideoAvailable(camera.status === "fulfilled");
      setAudioAvailable(microphone.status === "fulfilled");
      [camera, microphone].forEach((result) => {
        if (result.status === "fulfilled") {
          result.value.getTracks().forEach((track) => track.stop());
        }
      });
    } finally {
      previewStream?.getTracks().forEach((track) => track.stop());
      setScreenAvailable(Boolean(navigator.mediaDevices?.getDisplayMedia));
    }
  };

  useEffect(() => {
    // Permission state is populated from the browser's media APIs on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getPermission();
  }, []);

  useEffect(() => () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    socketRef.current?.disconnect();
    Object.values(connectionsRef.current).forEach((connection) => connection.close());
    connectionsRef.current = {};
  }, []);

  const getUserMediaSuccess = (stream) => {
    try {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.log(error);
    }
    localStreamRef.current = stream;
    if (localVideoref.current) {
      localVideoref.current.srcObject = stream;
      localVideoref.current.play().catch(() => {});
    }

    for (let id in connectionsRef.current) {
      if (id === socketIdRef.current) continue;

      connectionsRef.current[id].addStream(stream);

      connectionsRef.current[id].createOffer().then((description) => {
        connectionsRef.current[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connectionsRef.current[id].localDescription }),
            );
          })
          .catch((error) => console.log(error));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (error) {
            console.log(error);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          localStreamRef.current = blackSilence();
          localVideoref.current.srcObject = localStreamRef.current;

          for (let id in connectionsRef.current) {
            connectionsRef.current[id].addStream(localStreamRef.current);
            connectionsRef.current[id].createOffer().then((description) => {
              connectionsRef.current[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connectionsRef.current[id].localDescription }),
                  );
                })
                .catch((error) => console.log(error));
            });
          }
        }),
    );
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  const getUserMedia = async () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: video,
          audio: audio,
        });
        getUserMediaSuccess(stream);
      } catch (error) {
        console.log(error);
      }
    } else {
      getUserMediaSuccess(new MediaStream([black(), silence()]));
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  const gotMessagesFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connectionsRef.current[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connectionsRef.current[fromId]
                .createAnswer()
                .then((description) => {
                  connectionsRef.current[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connectionsRef.current[fromId].localDescription,
                        }),
                      );
                    })
                    .catch((error) => console.log(error));
                })
                .catch((error) => console.log(error));
            }
          })
          .catch((error) => console.log(error));
      }
      if (signal.ice) {
        connectionsRef.current[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((error) => console.log(error));
      }
    }
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);

    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessagesFromServer);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);

      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          if (socketListId === socketIdRef.current) return;

          setVideos((videos) => {
            if (videos.some((video) => video.socketId === socketListId)) {
              return videos;
            }

            return [
              ...videos,
              {
                socketId: socketListId,
                stream: null,
                autoPlay: true,
                playinline: true,
              },
            ];
          });

          connectionsRef.current[socketListId] = new RTCPeerConnection(
            peerConfigConnections,
          );

          connectionsRef.current[socketListId].onicecandidate = (event) => {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate }),
              );
            }
          };

          connectionsRef.current[socketListId].ontrack = (event) => {
            const stream = event.streams[0];
            if (!stream) return;
            setVideos((videos) => {
              const existingVideo = videos.find(
                (video) => video.socketId === socketListId,
              );

              let updatedVideos;

              if (existingVideo) {
                updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream }
                    : video,
                );
              } else {
                updatedVideos = [
                  ...videos,
                  {
                    socketId: socketListId,
                    stream,
                    autoPlay: true,
                    playinline: true,
                  },
                ];
              }

              videoRef.current = updatedVideos;
              return updatedVideos;
            });
          };

          if (localStreamRef.current) {
            connectionsRef.current[socketListId].addStream(localStreamRef.current);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            localStreamRef.current = blackSilence();
            connectionsRef.current[socketListId].addStream(localStreamRef.current);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connectionsRef.current) {
            if (id === socketIdRef.current) continue;

            connectionsRef.current[id2].addStream(localStreamRef.current);

            connectionsRef.current[id2].createOffer().then((description) => {
              connectionsRef.current[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({
                      sdp: connectionsRef.current[id2].localDescription,
                    }),
                  );
                })
                .catch((error) => console.log(error));
            });
          }
        }
      });
    });
  };

  const getMedia = async () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);

    connectToSocketServer();
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  const handleVideo = () => {
    setVideo(!video);
  };

  const handleAudio = () => {
    setAudio(!audio);
  };

  const getDisplayMediaSuccess = (stream) => {
    try {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    localStreamRef.current = stream;
    localVideoref.current.srcObject = stream;
    localVideoref.current.play().catch(() => {});

    for (let id in connectionsRef.current) {
      if (id === socketIdRef.current) continue;

      connectionsRef.current[id].addStream(stream);

      connectionsRef.current[id].createOffer().then((description) => {
        connectionsRef.current[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connectionsRef.current[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          localStreamRef.current = blackSilence();
          localVideoref.current.srcObject = localStreamRef.current;

          getUserMedia();
        }),
    );
  };

  const getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then((stream) => {
            getDisplayMediaSuccess(stream);
          })
          .catch((error) => console.log(error));
      }
    }
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  const handleScreen = () => {
    setScreen(!screen);
  };

  const sendMessage = () => {
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  const handleCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (error) {
      console.log(error);
    }
    navigate("/home");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {askForUsername === true ? (
        <div className="lobbyContainer">
          <div className="lobbyForm">
            <h2>Enter into Lobby</h2>
            <TextField
              id="outlined-basic"
              value={username}
              label="Username"
              onChange={(e) => setUsername(e.target.value)}
            ></TextField>
            <Button variant="contained" onClick={connect}>
              Connect
            </Button>
          </div>
          <div className="videoSection">
            <video ref={localVideoref} autoPlay muted playsInline />
          </div>
        </div>
      ) : (
        <div className="meetVideoContainer">
          {showModal ? (
            <div className="chatContainer">
              <h1
                style={{
                  textAlign: "center",
                  padding: "5px",
                  backgroundColor: "rgb(255, 120, 140)",
                }}
              >
                Chats
              </h1>

              <div className="chatDisplay">
                {messages.map((msg, index) => {
                  return (
                    <div
                      key={index}
                      className="userMsg"
                      style={{
                        justifyContent:
                          username === msg.sender ? "flex-end" : "flex-start",
                        marginLeft: username === msg.sender ? "30px" : "0px",
                        marginRight: username !== msg.sender ? "30px" : "0px",
                      }}
                    >
                      <p className="user">{msg.sender}</p>
                      <p className="msg">{msg.data}</p>
                    </div>
                  );
                })}
              </div>

              <div className="chatField">
                <TextField
                  id="standard-basic"
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    },
                  }}
                  label="Standard"
                  placeholder="Enter you message"
                  variant="standard"
                />
                <IconButton onClick={sendMessage}>
                  <SendIcon></SendIcon>
                </IconButton>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="buttonContainer">
            <IconButton onClick={handleVideo}>
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            <IconButton onClick={handleAudio}>
              {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            <IconButton onClick={handleCall} color="error">
              <CallEndIcon sx={{ fill: "red !important" }} />
            </IconButton>

            {screenAvailable === true ? (
              <IconButton onClick={handleScreen}>
                {screen === true ? (
                  <ScreenShareIcon />
                ) : (
                  <StopScreenShareIcon />
                )}
              </IconButton>
            ) : (
              <></>
            )}

            <Badge badgeContent={newMessages} max={999} color="secondary">
              <IconButton
                onClick={() => {
                  setModal(!showModal);
                  showModal ? setNewMessages(0) : null;
                }}
              >
                <ChatIcon />
              </IconButton>
            </Badge>
          </div>

          <video
            className="meetUserVideo"
            ref={localVideoref}
            autoPlay
            muted
          ></video>

          <div className="conferenceView">
            {videos.map((video) => (
              <div key={video.socketId}>
                {video.stream ? (
                  <video
                    data-socket={video.socketId}
                    ref={(ref) => {
                      if (ref) {
                        ref.srcObject = video.stream;
                        ref.play().catch(() => {});
                      }
                    }}
                    autoPlay
                    playsInline
                  />
                ) : (
                  <p>Camera off</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}

export default VideoMeet;
