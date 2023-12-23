import { useRef } from "react";
import classes from "../styles/login.module.css";
import { useDispatch } from "react-redux";
import { chatActions } from "../store/message_redux";
import { useNavigate } from "react-router-dom";
import useFetchData from "../hook/fetch-hook";

export default function LoginPage() {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isError, sendRequest } = useFetchData();

    const transformData = async (dataObj) => {
        const getResponse = await fetch("http://localhost:8080/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${dataObj.token}`,
            },
        });

        if (getResponse.ok) {
            const messagesData = await getResponse.json();
            dispatch(chatActions.populateMessage(messagesData));
        } else {
            dispatch(chatActions.setErrorFetchChatData(true));
        }

        localStorage.setItem(
            "userData",
            JSON.stringify({ username: dataObj.username, token: dataObj.token })
        );
        dispatch(
            chatActions.setLoginData({
                username: dataObj.username,
                token: dataObj.token,
            })
        );
        // Avatar
        dispatch(chatActions.populateAvatar(dataObj.avatar));
        
        navigate("/");
    };

    const loginHandler = async (e) => {
        e.preventDefault();

        const emailInput = emailInputRef.current.value;
        const passwordInput = passwordInputRef.current.value;

        sendRequest(
            {
                url: "http://localhost:8080/login",
                method: "POST",
                body: {
                    email: emailInput,
                    password: passwordInput,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            },
            transformData
        );
    };

    return (
        <div className={`container ${classes.container_login}`}>
            <h1>Login Page</h1>
            <form className={`form`} onSubmit={loginHandler}>
                <label>Email:</label>
                <input
                    type="text"
                    name="email"
                    placeholder="email"
                    ref={emailInputRef}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    ref={passwordInputRef}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            {isError.status && (
                <div style={{ color: "red" }}>{isError.message}</div>
            )}
        </div>
    );
}
