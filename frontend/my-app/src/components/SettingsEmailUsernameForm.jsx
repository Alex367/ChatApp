import { useEffect, useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import classes from "../styles/settingsForm.module.css";
import { chatActions } from "../store/message_redux";

function reducer(state, action) {
    if (action.type === "change_both") {
        return { email: action.value.email, username: action.value.username };
    } else if (action.type === "changed_email") {
        return { email: action.value, username: state.username };
    } else if (action.type === "changed_username") {
        return { email: state.email, username: action.value };
    }

    return { email: "", username: "" };
}

let emailDefault = "";
let usernameDefault = "";

export default function SettingsEmaiUsernameForm() {
    const [isLoading, setIsLoading] = useState(true);
    const [isEditedCredentials, setIsEditedCredentials] = useState(false);
    const [isError, setIsError] = useState(false);

    const dispatch = useDispatch();

    const [isUserData, dispatchIsUserData] = useReducer(reducer, {
        email: "",
        username: "",
    });

    useEffect(() => {
        const userCredentials = localStorage.getItem("userData");
        let dataCredentials = JSON.parse(userCredentials);
        if (!dataCredentials || !dataCredentials.token) {
            return;
        }

        const fetchUserData = async () => {
            const response = await fetch("http://localhost:8080/settings", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${dataCredentials.token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                dispatchIsUserData({
                    type: "change_both",
                    value: { email: data.email, username: data.username },
                });
                emailDefault = data.email;
                usernameDefault = data.username;
            } else {
                setIsError({
                    status: true,
                    message: data.message,
                });
            }
            setIsLoading(false);
        };

        fetchUserData();
    }, []);

    const settingFormHandler = async (e) => {
        e.preventDefault();

        if (isEditedCredentials) {
            const userCredentials = localStorage.getItem("userData");
            let dataCredentials = JSON.parse(userCredentials);
            if (!dataCredentials || !dataCredentials.token) {
                return;
            }

            const response = await fetch("http://localhost:8080/settings", {
                method: "PATCH",
                body: JSON.stringify({
                    email: isUserData.email,
                    username: isUserData.username,
                }),
                headers: {
                    Authorization: `Bearer ${dataCredentials.token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                // User Data
                dispatch(
                    chatActions.setLoginData({
                        username: data.username,
                        token: data.token,
                    })
                );
                localStorage.setItem(
                    "userData",
                    JSON.stringify({
                        username: data.username,
                        token: data.token,
                    })
                );

                // Messages
                dispatch(
                    chatActions.updateUsernameInMessages({
                        old: dataCredentials.username,
                        new: data.username,
                    })
                );

                setIsEditedCredentials(false);
            } else {
                setIsError({
                    status: true,
                    message: data.message,
                });
            }
        }
    };

    console.log("bbb");

    if (isLoading) {
        return <p>Loading...</p>;
    }

    const emailHandler = (e) => {
        dispatchIsUserData({
            type: "changed_email",
            value: e.target.value,
        });
        if (e.target.value !== emailDefault) {
            setIsEditedCredentials(true);
        } else if (
            e.target.value === emailDefault &&
            isUserData.username === usernameDefault
        ) {
            setIsEditedCredentials(false);
        }
    };

    const usernameHandler = (e) => {
        dispatchIsUserData({
            type: "changed_username",
            value: e.target.value,
        });
        if (e.target.value !== usernameDefault) {
            setIsEditedCredentials(true);
        } else if (
            e.target.value === usernameDefault &&
            isUserData.email === emailDefault
        ) {
            setIsEditedCredentials(false);
        }
    };

    console.log("aaa");

    return (
        <form className={classes.settings_form} onSubmit={settingFormHandler}>
            <label>Email</label>
            <input
                type="text"
                value={isUserData.email}
                onChange={emailHandler}
            />
            <label>Username</label>
            <input
                type="text"
                value={isUserData.username}
                onChange={usernameHandler}
            />
            {isEditedCredentials && (
                <button type="submit" className={classes.btn_save}>
                    Save
                </button>
            )}
            {isError.status && (
                <div style={{ color: "red" }}>{isError.message}</div>
            )}
        </form>
    );
}
