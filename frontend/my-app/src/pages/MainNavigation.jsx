import { Link, useNavigate } from "react-router-dom";
import classes from "../styles/mainNavigation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../store/message_redux";
import { useEffect, useState } from "react";
import useFetchData from "../hook/fetch-hook";

export default function MainNavigation() {
    const { isError, sendRequest } = useFetchData();
    const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);
    const userOnlineData = useSelector((state) => state.doMessages.logged);
    const getUserAvatar = useSelector((state) => state.doMessages.avatarPath);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const dataTransformation = (dataObj) => {
        dispatch(chatActions.populateAvatar(dataObj.avatar));
        setIsLoadingAvatar(false);
    };

    useEffect(() => {
        console.log("use effect nav");
        const userCredentials = localStorage.getItem("userData");
        let dataCredentials = JSON.parse(userCredentials);
        if (!dataCredentials || !dataCredentials.token) {
            setIsLoadingAvatar(false);
            return;
        }

        sendRequest(
            {
                url: "http://localhost:8080/settings",
                headers: {
                    Authorization: `Bearer ${dataCredentials.token}`,
                },
            },
            dataTransformation
        );
    }, []);

    let userOnline;
    if (Object.keys(userOnlineData).length === 0) {
        userOnline = false;
    } else {
        userOnline = true;
    }

    const logoutHandler = () => {
        dispatch(chatActions.clearAllMessages());
        dispatch(chatActions.clearLogged());
        localStorage.removeItem("userData");
        if (localStorage.getItem("items")) {
            localStorage.removeItem("items");
        }
        navigate("/login");
    };

    console.log("navigationPage");
    console.log(isLoadingAvatar);

    return (
        <header className={classes.navigation}>
            <div>Logo</div>
            <nav>
                <ul className={classes.navigation_items}>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {userOnline && (
                        <li>
                            <Link to="/settings">Settings</Link>
                        </li>
                    )}
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    {!userOnline && (
                        <li>
                            <Link to="/registration">Registration</Link>
                        </li>
                    )}
                    {!userOnline && (
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    )}
                    {userOnline && (
                        <li>
                            <button onClick={logoutHandler}>Logout</button>
                        </li>
                    )}
                    <li>
                        Status:
                        {userOnline ? (
                            <div>
                                {userOnlineData.username}{" "}
                                <span style={{ color: "green" }}>Online</span>
                            </div>
                        ) : (
                            <div style={{ color: "red" }}>Offline</div>
                        )}
                    </li>
                    {userOnline && (
                        <li>
                            {isError.status ? (
                                <p>Error loading avatar.</p>
                            ) : isLoadingAvatar ? (
                                <p>Loading...</p>
                            ) : (
                                <img
                                    src={
                                        getUserAvatar
                                            ? `http://localhost:8080/${getUserAvatar}`
                                            : ""
                                    }
                                    className={classes.avatar_user}
                                />
                            )}
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}
