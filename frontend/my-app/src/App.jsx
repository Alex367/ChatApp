import { Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import AboutPage from "./pages/About";
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
import NotificationMessage from "./components/NotificationMessage";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import ProtectedAdmin from "./components/ProtectedAdmin";
import Layout from "./components/layout/Layout";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchedData, setIsFetchedData] = useState();
    const dispatch = useDispatch();

    const { sendRequest: fetchAllData } = useFetchData();

    useEffect(() => {
        const { dataCredentials, connectionStatus } = extractLocalStorage();
        if (!dataCredentials || !dataCredentials.token) {
            setIsLoading(false);
            setIsFetchedData(true);
            return;
        }

        const dispatchAllData = (dataObj, isError) => {
            // console.log(isError)
            if (isError.status) {
                dispatch(
                    chatActions.setNofification({
                        status: "Failed",
                        message: isError.message,
                    })
                );
                setIsLoading(false);
                setIsFetchedData(true);
                return;
            }
            console.log("inside");
            // Get messages
            dispatch(chatActions.populateMessage(dataObj.data));

            // Update in case if wrong username was in localStorage
            localStorage.setItem(
                "userData",
                JSON.stringify({
                    username: dataObj.dataUser.username,
                    token: dataCredentials.token,
                })
            );
            dispatch(
                chatActions.setLoginData({
                    username: dataObj.dataUser.username,
                    token: dataCredentials.token,
                })
            );

            if (connectionStatus) {
                dispatch(chatActions.setConnectionStatus(true));
            } else {
                dispatch(chatActions.setConnectionStatus(false));
            }
            // Avatar
            dispatch(chatActions.populateAvatar(dataObj.dataUser.avatar));
            setIsFetchedData(true);
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
        setIsLoading(false);
    }, []);

    if (localStorage.getItem("theme") === "dark") {
        document.querySelector("body").setAttribute("data-theme", "dark");
    }

    if (isLoading || !isFetchedData) {
        return <p className="loading">Loading...</p>;
    }

    // console.log("App");

    return (
        <div className={classes.app_container}>
            <Layout>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<ChatPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Route>
                    <Route
                        path="/registration"
                        element={<RegistrationPage />}
                    ></Route>
                    <Route path="/about" element={<AboutPage />}/>
                    <Route path="/login" element={<LoginPage />}/>
                    <Route element={<ProtectedAdmin />}>
                        <Route
                            path="/configurator"
                            element={<ConfiguratorPage />}
                        />
                    </Route>
                    <Route path="*" element={<PageNotFound />}/>
                </Routes>
            </Layout>
            <NotificationMessage />
        </div>
    );
}

export default App;
