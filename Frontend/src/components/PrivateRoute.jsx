import { Navigate } from "react-router-dom";

function PrivateRoute({ isAuthenticated, children }) {
    return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default PrivateRoute;