import { useState } from "react";
import { useDispatch } from "react-redux";
import { chatActions } from "../store/message_redux";

const useFetchData = () => {
    const sendRequest = async (requestConfig, applyData) => {
        const response = await fetch(requestConfig.url, {
            method: requestConfig.method ? requestConfig.method : "GET",
            headers: requestConfig.headers ? requestConfig.headers : {},
            body: requestConfig.body
                ? JSON.stringify(requestConfig.body)
                : null,
        });

        const data = await response.json();
        
        let isError = {};
        if (!response.ok) {
            isError = {status: true, message: data.message}
        } else {
            isError = {status: false}
        }

        applyData(data, isError);
    };

    return {
        sendRequest,
    };
};

export default useFetchData;
