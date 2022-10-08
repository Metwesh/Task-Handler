import axios from "axios";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminProtectedRoute from "./containers/AdminProtectedRoute";
import AlreadySignedInRoute from "./containers/AlreadySignedInRoute";
import ProtectedRoute from "./containers/ProtectedRoute";
import { UserContext } from "./contexts/UserContext";
import Dashboard from "./routes/dashboard/Dashboard";
import Error404 from "./routes/Error404/Error404";
import Landing from "./routes/landing/Landing";
import EditProfile from "./routes/profile/EditProfile";
import Privileges from "./routes/profile/Privileges";
import Profile from "./routes/profile/Profile";
import SignIn from "./routes/signin/SignIn";
import SignUp from "./routes/signup/SignUp";
import AddTask from "./routes/tasks/AddTask";
import ViewTasks from "./routes/tasks/ViewTasks";

export interface IEmployeeInfo {
  email?: string;
  name?: string;
  password?: string;
  role?: string;
  _id?: string;
}

export interface IUserAuth {
  accessToken?: string;
  refreshToken?: string;
}

function App(): JSX.Element {
  const [userAuth, setUserAuth] = useState<IUserAuth>({});
  const [activeEmployee, setActiveEmployee] = useState<IEmployeeInfo>({});

  axios.interceptors.request.use(
    (config) => {
      if (config.headers == null) config.headers = {};
      if (userAuth.accessToken)
        config.headers.authorization = `Bearer ${userAuth.accessToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <main className={"route-wrapper maxVH"}>
      <UserContext.Provider
        value={{ activeEmployee, setActiveEmployee, setUserAuth }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <AlreadySignedInRoute>
                <Landing />
              </AlreadySignedInRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <AlreadySignedInRoute>
                <SignUp />
              </AlreadySignedInRoute>
            }
          />

          <Route
            path="/signin"
            element={
              <AlreadySignedInRoute>
                <SignIn />
              </AlreadySignedInRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute>
                <AdminProtectedRoute>
                  <Dashboard />
                </AdminProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editprofile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/privileges"
            element={
              <ProtectedRoute>
                <AdminProtectedRoute>
                  <Privileges />
                </AdminProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <ViewTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addtask"
            element={
              <ProtectedRoute>
                <AdminProtectedRoute>
                  <AddTask />
                </AdminProtectedRoute>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Error404 />} />
        </Routes>
      </UserContext.Provider>
    </main>
  );
}

export default App;
