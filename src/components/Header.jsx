import { useContext } from "react";
import Button from "./Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import axiosInstance from "../axiosInstance";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = async () => {
    try {
      await axiosInstance.post("logout/");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("csrfToken");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <nav className="navbar container pt-3 pb-3 align-items-start">
        <Link className="navbar-brand text-light" to="/">
          Stock Prediction Portal
        </Link>

        <div>
          {isLoggedIn ? (
            <>
              {location.pathname == "/dashboard" ? (
                <Button text="Home" class="btn-info" url="/" />
              ) : (
                <Button text="Dashboard" class="btn-info" url="/dashboard" />
              )}
              &nbsp;
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Button text="Login" class="btn-outline-info" url="/login" />
              &nbsp;
              <Button text="Register" class="btn-info" url="/register" />
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
