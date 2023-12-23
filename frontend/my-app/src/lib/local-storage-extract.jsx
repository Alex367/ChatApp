export default function extractLocalStorage() {
    const dataCredentials = JSON.parse(localStorage.getItem("userData"));
    const connectionStatus = JSON.parse(localStorage.getItem("items"));
    return { dataCredentials, connectionStatus };
}
