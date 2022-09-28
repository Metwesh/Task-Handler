import { useContext } from "react";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { Link } from "react-router-dom";
import { IEmployeeInfo } from "../../../App";
import { IUserContext, UserContext } from "../../../contexts/UserContext";
import "./ViewProfile.css";

export default function ViewProfile() {
  const { activeEmployee } = useContext<IUserContext>(UserContext);
  function checkStyle(activeEmployee: IEmployeeInfo): string | null {
    if (activeEmployee.role === "Admin") return "justify-content-between";
    else if (activeEmployee.role === "User") return "justify-content-center";
    else return null;
  }

  return (
    <>
      <div className="d-grid grid-viewprofile">
        <h3 className="grid-row1 text-center">Profile</h3>
        <div className="grid-row2">
          <div className="d-flex justify-content-center mb-5">
            <svg width="100" height="100" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-3.123 0-5.914-1.441-7.749-3.69.259-.588.783-.995 1.867-1.246 2.244-.518 4.459-.981 3.393-2.945-3.155-5.82-.899-9.119 2.489-9.119 3.322 0 5.634 3.177 2.489 9.119-1.035 1.952 1.1 2.416 3.393 2.945 1.082.25 1.61.655 1.871 1.241-1.836 2.253-4.628 3.695-7.753 3.695z"
                fill="rgba(21,32,46,1)"
              />
            </svg>
          </div>
          <Stack direction="vertical">
            <Card className="mb-4">
              <Card.Body>
                <Stack
                  direction="horizontal"
                  className="justify-content-between">
                  <h5>Name:</h5>
                  <h5 className="fw-normal">{activeEmployee.name}</h5>
                </Stack>
              </Card.Body>
            </Card>
            <Card className="mb-4">
              <Card.Body>
                <Stack
                  direction="horizontal"
                  className="justify-content-between">
                  <h5>E-mail:</h5>
                  <h5 className="fw-normal">{activeEmployee.email}</h5>
                </Stack>
              </Card.Body>
            </Card>
            <Card className="mb-5">
              <Card.Body>
                <Stack
                  direction="horizontal"
                  className="justify-content-between">
                  <h5>Role:</h5>
                  <h5 className="fw-normal">{activeEmployee.role}</h5>
                </Stack>
              </Card.Body>
            </Card>
          </Stack>

          <div className={`d-flex ${checkStyle(activeEmployee)} mb-1`}>
            <Link
              to="/editprofile"
              className="text-center font-main-color width-10rem btn btn-info btn-lg">
              Edit profile
            </Link>
            {activeEmployee.role === "Admin" && (
              <Link
                to="/privileges"
                className="text-center font-main-color width-10rem btn btn-info btn-lg">
                Edit privileges
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
