import { useState } from "react";

const useFetchData = () => {
    const [isError, setIsError] = useState({status: false, message: "", code: ""});

    const sendRequest = async (requestConfig, applyData) => {
        const response = await fetch(requestConfig.url, {
            method: requestConfig.method ? requestConfig.method : "GET",
            headers: requestConfig.headers ? requestConfig.headers : {},
            body: requestConfig.body
                ? JSON.stringify(requestConfig.body)
                : null,
        });

        const data = await response.json();

        if (!response.ok) {
            setIsError({status: true, message: data.message, code: response.status});
            return;
        }

        applyData(data);
    };

    return {
        isError: isError,
        sendRequest: sendRequest,
    };
};

export default useFetchData;
