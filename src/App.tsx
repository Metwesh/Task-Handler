import Landing from "./routes/landing/Landing";
import SignUp from "./routes/signup/SignUp";
import SignIn from "./routes/signin/SignIn";
import Dashboard from "./routes/dashboard/Dashboard";
import AdminDashboard from "./routes/dashboard/AdminDashboard";
import Tasks from "./routes/tasks/ViewTasks";
import AddTask from "./routes/tasks/AddTask";
import Profile from "./routes/profile/Profile";
import EditProfile from "./routes/profile/EditProfile";
import Privileges from "./routes/profile/Privileges";
import Error404 from "./routes/Error404/Error404";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { UserContext } from "./contexts/UserContext";
import ProtectedRoute from "./containers/ProtectedRoute";
import AdminProtectedRoute from "./containers/AdminProtectedRoute";
import axios from "axios";
import ViewAllTasks from "./routes/tasks/ViewAllTasks";

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
        value={{ activeEmployee, setActiveEmployee, setUserAuth }}>
        <Routes>
          <Route path="/task-handler">
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
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
                    <AdminDashboard />
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
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alltasks"
              element={
                <ProtectedRoute>
                  <ViewAllTasks />
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
          </Route>
        </Routes>
      </UserContext.Provider>
    </main>
  );
}

export default App;
