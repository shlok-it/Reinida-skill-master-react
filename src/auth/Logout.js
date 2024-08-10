import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
const Logout = () => {
    secureLocalStorage.removeItem("admin_authenticated");
    secureLocalStorage.removeItem("admin_access_token");
    return <Navigate replace to="/login" />;
};
export default Logout