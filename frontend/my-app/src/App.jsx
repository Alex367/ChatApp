import { Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import AboutPage from "./pages/About";
import MainNavigation from "./pages/MainNavigation";
import classes from "./app.module.css";

import PageNotFound from "./pages/PageNotFound";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { chatActions } from "./store/message_redux";
import SettingsPage from "./pages/Settings";
import useFetchData from "./hook/fetch-hook";
import extractLocalStorage from "./lib/local-storage-extract";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const { isError, sendRequest: fetchAllData } = useFetchData();

    useEffect(() => {
        const { dataCredentials, connectionStatus } = extractLocalStorage();
        if (!dataCredentials || !dataCredentials.token) {
            setIsLoading(false);
            return;
        }

        const dispatchAllData = (dataObj) => {
            // messages
            dispatch(chatActions.populateMessage(dataObj));
            //user data
            dispatch(
                chatActions.setLoginData({
                    username: dataCredentials.username,
                    token: dataCredentials.token,
                })
            );

            if (connectionStatus) {
                dispatch(chatActions.setConnectionStatus(true));
            } else {
                dispatch(chatActions.setConnectionStatus(false));
            }
            setIsLoading(false);
        };

        fetchAllData(
            {
                url: "http://localhost:8080/",
                headers: {
                    Authorization: `Bearer ${dataCredentials.token}`,
                },
            },
            dispatchAllData
        );
    }, []);

    if (isLoading) {
        if (isError.code === 501) {
            return (
                <>
                    Error: {isError.message} {isError.code}...
                </>
            );
        } else if (isError.code !== 500) {
            return <>Loading...</>;
        }
    }

    // console.log("app");

    return (
        <div className={classes.app_container}>
            <MainNavigation />
            <Routes>
                <Route element={<ProtectedRoute></ProtectedRoute>}>
                    <Route path="/" element={<ChatPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
                <Route
                    path="/registration"
                    element={<RegistrationPage />}
                ></Route>
                <Route path="/about" element={<AboutPage />}></Route>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route path="*" element={<PageNotFound />}></Route>
            </Routes>
        </div>
    );
}

export default App;
