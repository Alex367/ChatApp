import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PageNotFound from "../pages/PageNotFound";

export default function ProtectedAdmin() {
    const userOnline = useSelector((state) => state.doMessages.logged);

    if (Object.keys(userOnline).length === 0) {
        return <Navigate to={"/login"} replace />;
    }

    if (jwtDecode(userOnline.token).role === "admin") {
        return <Outlet />;
    } else {
        return <PageNotFound />;
    }
}
