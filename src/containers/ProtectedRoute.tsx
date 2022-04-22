import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { IUserContext, UserContext } from "../contexts/UserContext";

export default function ProtectedRoute(props: { children: JSX.Element }) {
  const { activeEmployee, setActiveEmployee, setUserAuth } =
    useContext<IUserContext>(UserContext);

  const userInfo = localStorage.getItem("UserInfo");
  const userAuth = localStorage.getItem("UserAuth");
  useEffect(() => {
    if (userInfo != null) {
      setActiveEmployee(JSON.parse(userInfo));
    }
    if (userAuth != null) {
      setUserAuth(JSON.parse(userAuth));
    }
  }, [setActiveEmployee, setUserAuth, userAuth, userInfo]);
  if (
    Object.keys(activeEmployee).length === 0 &&
    userInfo == null &&
    userAuth == null
  ) {
    return <Navigate to="/signin" replace />;
  } else {
    return props.children;
  }
}
