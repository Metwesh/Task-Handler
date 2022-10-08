import { Navigate } from "react-router-dom";

export default function AlreadySignedInRoute(props: { children: JSX.Element }) {
  const userInfo = localStorage.getItem("UserInfo");
  const userAuth = localStorage.getItem("UserAuth");
  const userObject = userInfo && JSON.parse(userInfo);

  if (userObject?.role === "Admin" && userAuth) {
    return <Navigate to="/admindashboard" replace />;
  } else if (userObject?.role == "User" && userAuth) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return props.children;
  }
}
