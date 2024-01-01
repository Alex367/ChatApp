import { Link, useNavigate } from "react-router-dom";
import classes from "../../styles/mainNavigation.module.css"
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../store/message_redux";
import { jwtDecode } from "jwt-decode";

export default function MainNavigation() {
    const userOnlineData = useSelector((state) => state.doMessages.logged);
    const getUserAvatar = useSelector((state) => state.doMessages.avatarPath);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    let userOnline;
    let isAdmin;
    if (Object.keys(userOnlineData).length === 0) {
        userOnline = false;
    } else {
        userOnline = true;
        if (jwtDecode(userOnlineData.token).role !== "admin"){
            isAdmin = false;
        } else{
            isAdmin = true;
        }
    }

    const logoutHandler = () => {
        dispatch(chatActions.clearAllMessages());
        dispatch(chatActions.clearLogged());
        localStorage.removeItem("userData");
        if (localStorage.getItem("items")) {
            localStorage.removeItem("items");
        }
        dispatch(
            chatActions.setNofification({
                status: "Success",
                message: "You were logged out",
            })
        );
        navigate("/login");
    };

    return (
        <header className={classes.navigation}>
            <div>Logo</div>
            <nav>
                <ul className={classes.navigation_items}>
                    {userOnline && isAdmin && (
                        <li>
                            <Link to="/configurator">Configurator</Link>
                        </li>
                    )}
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
                                {userOnlineData.username}
                                <span style={{ color: "green" }}>Online</span>
                            </div>
                        ) : (
                            <div style={{ color: "red" }}>Offline</div>
                        )}
                    </li>
                    {userOnline && (
                        <li>
                            {getUserAvatar && (
                                <img
                                    className={classes.avatar_user}
                                    alt={getUserAvatar}
                                    src={`http://localhost:8080/${getUserAvatar}`}
                                />
                            )}
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}
