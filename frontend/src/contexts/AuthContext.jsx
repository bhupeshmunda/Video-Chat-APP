import axios from "axios"
import httpStatus from "http-status"
import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"


export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/users`,
    withCredentials: true,
});

export const AuthProvider = ({children}) => {
    const authContext = useContext(AuthContext);

    console.log(import.meta.env.VITE_API_URL);

    const [userData, setUserData] = useState(authContext);

    const navigate = useNavigate();

    const handleRegister = async (email, username, password) => {
        try {
            let request = await client.post("/register",{
                username: username,
                email: email,
                password: password,
            })

            if(request.status === httpStatus.CREATED){
                return request.data.messages;
            }
            
        } catch (error) {
            throw error;
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });

            console.log(username, password)
            console.log(request.data)

            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                navigate("/home")
            }
        } catch (err) {
            throw err;
        }
    }

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity");
            return request.data
        } catch
         (err) {
            throw err;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                meeting_code: meetingCode,
            });
            return request;
        } catch (e) {
            throw e;
        }
    }

    const handleLogout = async () => {
        localStorage.removeItem("token");
        await client.post("/logout");
        navigate("/auth");
    };

    const data = {userData, setUserData, handleRegister, handleLogin, getHistoryOfUser, addToUserHistory, handleLogout}

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

}