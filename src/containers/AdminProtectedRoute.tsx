import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute(props: { children: JSX.Element }) {
  const userInfo = localStorage.getItem("UserInfo");
  const userObject = userInfo && JSON.parse(userInfo);

  if (userObject?.role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  } else {
    return props.children;
  }
}
