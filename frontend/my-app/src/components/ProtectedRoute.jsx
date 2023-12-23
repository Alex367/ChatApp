import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
    const userOnline = useSelector((state) => state.doMessages.logged);

    return Object.keys(userOnline).length === 0 ? (
        <Navigate to={redirectPath} replace />
    ) : (
        <Outlet />
    );
};

export default ProtectedRoute;
