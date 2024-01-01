import { useRef } from "react";
import classes from "../styles/registration.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { chatActions } from "../store/message_redux";
import useFetchData from "../hook/fetch-hook";

export default function RegistrationPage() {
    const usernameInputValue = useRef();
    const emailInputValue = useRef();
    const passwordInputValue = useRef();
    const repeatPasswordInputValue = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { sendRequest } = useFetchData();

    const dataTransformation = async (dataObj, isError) => {
        if(isError.status){
            dispatch(
                chatActions.setNofification({
                    status: "Failed",
                    message: isError.message,
                })
            );
            return;
        }
        // Get all messages
        const getResponse = await fetch("http://localhost:8080/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${dataObj.token}`,
            },
        });

        const messagesData = await getResponse.json();
        if (getResponse.ok) {
            dispatch(chatActions.populateMessage(messagesData.data));
        } else {
            dispatch(
                chatActions.setNofification({
                    status: "Failed",
                    message: messagesData.message,
                })
            );
            return;
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

        dispatch(
            chatActions.setNofification({
                status: "Success",
                message: "Registration was finished successfully!",
            })
        );

        navigate("/");
    };

    const regFormHandler = async (e) => {
        e.preventDefault();

        const usernameInput = usernameInputValue.current.value;
        const emailInput = emailInputValue.current.value;
        const passwordInput = passwordInputValue.current.value;
        const repeatPasswordInput = repeatPasswordInputValue.current.value;

        sendRequest(
            {
                url: "http://localhost:8080/registration",
                method: "POST",
                body: {
                    username: usernameInput,
                    email: emailInput,
                    password: passwordInput,
                    repeatPassword: repeatPasswordInput,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            },
            dataTransformation
        );
    };

    return (
        <div className={`container ${classes.container_registration}`}>
            <h1>Registration Page</h1>
            <form
                className={`form ${classes.form_registration}`}
                onSubmit={regFormHandler}
            >
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    placeholder="username"
                    ref={usernameInputValue}
                    required
                />
                <label>Email:</label>
                <input
                    type="text"
                    name="email"
                    placeholder="email"
                    ref={emailInputValue}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    ref={passwordInputValue}
                    required
                />
                <label>Repeat password:</label>
                <input
                    type="password"
                    name="repeat_password"
                    placeholder="repeat password"
                    ref={repeatPasswordInputValue}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
