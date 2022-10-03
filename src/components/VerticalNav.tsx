import { useContext, useLayoutEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { Link } from "react-router-dom";
import { IUserContext, UserContext } from "../contexts/UserContext";
import ConditionalChecks from "../functions/ConditionalChecks";
import LogoLight from "../images/Logo-light.svg";
import "./VerticalNav.css";

export default function VerticalNav(): JSX.Element {
  const [homeLink, setHomeLink] = useState<string>("");
  const [adminHomeLink, setAdminHomeLink] = useState<string>("");
  const [profileLink, setProfileLink] = useState<string>("");
  const [editProfileLink, setEditProfileLink] = useState<string>("");
  const [privilegesLink, setPrivilegesLink] = useState<string>("");
  const [allTasksLink, setAllTasksLink] = useState<string>("");
  const [tasksLink, setTasksLink] = useState<string>("");
  const [addTaskLink, setAddTaskLink] = useState<string>("");

  const { activeEmployee } = useContext<IUserContext>(UserContext);

  function signout(): void {
    localStorage.clear();
  }

  useLayoutEffect(() => {
    ConditionalChecks(
      setHomeLink,
      setAdminHomeLink,
      setProfileLink,
      setEditProfileLink,
      setPrivilegesLink,
      setAllTasksLink,
      setTasksLink,
      setAddTaskLink
    );
  }, []);

  return (
    <Stack direction="vertical" className="custom-v-stack">
      <Stack
        direction="vertical"
        className="d-flex justify-content-start width-100">
        <Card className="custom-card">
          <Link
            to="/dashboard"
            aria-label="Home"
            className="text-decoration-none">
            <Card.Body>
              <img src={LogoLight} alt="Logo" width="40rem"></img>
              <span className="h5 font-inverse">Task Handler</span>
            </Card.Body>
          </Link>
        </Card>

        <Accordion
          flush
          defaultActiveKey={
            window.location.pathname === "/dashboard"
              ? "0"
              : window.location.pathname === "/admindashboard"
              ? "0"
              : window.location.pathname === "/profile"
              ? "1"
              : window.location.pathname === "/editprofile"
              ? "1"
              : window.location.pathname === "/privileges"
              ? "1"
              : window.location.pathname === "/tasks"
              ? "2"
              : window.location.pathname === "/addtask"
              ? "2"
              : window.location.pathname === "/alltasks"
              ? "2"
              : null
          }>
          <Accordion.Item eventKey="0" className="custom-accordion-item">
            <Accordion.Header className="d-flex">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z"
                  fill="#E5E4FF"
                />
              </svg>
              <span className="h5 span-text">Home</span>
            </Accordion.Header>
            <Accordion.Body>
              <Stack direction="vertical">
                {activeEmployee.role === "Admin" && (
                  <Link
                    to="/admindashboard"
                    aria-label="Admin Dashboard"
                    className={`text-decoration-none font-inverse mb-1 cardHover ${adminHomeLink}`}>
                    Admin dashboard
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  aria-label="Home"
                  className={`text-decoration-none mt-1 font-inverse cardHover ${homeLink}`}>
                  Dashboard
                </Link>
              </Stack>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className="custom-accordion-item">
            <Accordion.Header className="d-flex">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-3.123 0-5.914-1.441-7.749-3.69.259-.588.783-.995 1.867-1.246 2.244-.518 4.459-.981 3.393-2.945-3.155-5.82-.899-9.119 2.489-9.119 3.322 0 5.634 3.177 2.489 9.119-1.035 1.952 1.1 2.416 3.393 2.945 1.082.25 1.61.655 1.871 1.241-1.836 2.253-4.628 3.695-7.753 3.695z"
                  fill="#E5E4FF"
                />
              </svg>

              <span className="h5 font-inverse ml-05">User</span>
            </Accordion.Header>
            <Accordion.Body>
              <Stack direction="vertical">
                <Link
                  to="/profile"
                  aria-label="Home"
                  className={`text-decoration-none font-inverse mb-1 cardHover ${profileLink}`}>
                  View profile
                </Link>
                <Link
                  to="/editprofile"
                  aria-label="Home"
                  className={`text-decoration-none font-inverse mt-1 mb-1 cardHover ${editProfileLink}`}>
                  Edit profile
                </Link>
                {activeEmployee.role === "Admin" && (
                  <Link
                    to="/privileges"
                    aria-label="Home"
                    className={`text-decoration-none font-inverse mt-1 cardHover ${privilegesLink}`}>
                    Edit privileges
                  </Link>
                )}
              </Stack>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className="custom-accordion-item">
            <Accordion.Header className="d-flex">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M22 2v22h-20v-22h3c1.23 0 2.181-1.084 3-2h8c.82.916 1.771 2 3 2h3zm-11 1c0 .552.448 1 1 1 .553 0 1-.448 1-1s-.447-1-1-1c-.552 0-1 .448-1 1zm9 1h-4l-2 2h-3.897l-2.103-2h-4v18h16v-18zm-13 9.729l.855-.791c1 .484 1.635.852 2.76 1.654 2.113-2.399 3.511-3.616 6.106-5.231l.279.64c-2.141 1.869-3.709 3.949-5.967 7.999-1.393-1.64-2.322-2.686-4.033-4.271z"
                  fill="#E5E4FF"
                />
              </svg>
              <span className="h5 font-inverse ml-05">Tasks</span>
            </Accordion.Header>
            <Accordion.Body>
              <Stack direction="vertical">
                <Link
                  to="/tasks"
                  aria-label="Tasks"
                  className={`text-decoration-none font-inverse mb-1 cardHover ${tasksLink}`}>
                  Your tasks
                </Link>
                <Link
                  to="/alltasks"
                  aria-label="Tasks"
                  className={`text-decoration-none font-inverse mb-1 mt-1 cardHover ${allTasksLink}`}>
                  All tasks
                </Link>
                {activeEmployee.role === "Admin" && (
                  <Link
                    to="/addtask"
                    aria-label="Tasks"
                    className={`text-decoration-none font-inverse mt-1 cardHover ${addTaskLink}`}>
                    Add task
                  </Link>
                )}
              </Stack>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Stack>
      <Button
        href="/"
        variant="info"
        size="lg"
        className="m-3 text-center font-main-color"
        onClick={signout}>
        Sign out
      </Button>
    </Stack>
  );
}
