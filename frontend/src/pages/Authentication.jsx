import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "./Authentication.css";
import bgImage from "../assets/auth.avif";
import { toast } from "react-toastify";


export default function Authentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formState, setFormState] = useState(0);

  const { handleLogin, handleRegister } = useContext(AuthContext);

  const handleAuth = async () => {
    setError("");

    try {
      if (formState === 0) {
        await handleLogin(username, password);
      } else {
        const result = await handleRegister(email, username, password);

        setMessage(result);
        toast.success(message);

        setTimeout(() => {
          setMessage("");
        }, 4000);

        setEmail("");
        setUsername("");
        setPassword("");

        setFormState(0);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="left-side" style={{ backgroundImage: `url(${bgImage})` }}></div>

      <div className="right-side">
        <div className="auth-box">
          <h2>Welcome</h2>

          <div className="toggle-buttons">
            <button
              className={formState === 0 ? "active" : ""}
              onClick={() => setFormState(0)}
            >
              Sign In
            </button>

            <button
              className={formState === 1 ? "active" : ""}
              onClick={() => setFormState(1)}
            >
              Sign Up
            </button>
          </div>

          {formState === 1 && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          {message && <p className="success">{message}</p>}

          <button className="submit-btn" onClick={handleAuth}>
            {formState === 0 ? "Login" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}