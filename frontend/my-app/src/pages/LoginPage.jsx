import { useEffect, useRef, useState } from "react";
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

    const { sendRequest } = useFetchData();

    const transformData = async (dataObj, isError) => {
        if(isError.status){
            dispatch(
                chatActions.setNofification({
                    status: "Failed",
                    message: isError.message,
                })
            );
            return;
        }
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
                message: "Log in was successfull",
            })
        );

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
        </div>
    );
}
