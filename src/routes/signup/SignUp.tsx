import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { useNavigate } from "react-router-dom";
import { IEmployeeInfo } from "../../App";
import Navigation from "../../components/Navigation";
import { IUserContext, UserContext } from "../../contexts/UserContext";
import "./SignUp.css";

export default function SignUp(): JSX.Element {
  const [employees, setEmployees] = useState<Array<IEmployeeInfo>>([]);
  const [inputName, setInputName] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [inputRole, setInputRole] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);

  const navigate = useNavigate();

  const { setActiveEmployee, setUserAuth } =
    useContext<IUserContext>(UserContext);

  let userInfo: IEmployeeInfo;

  useEffect((): void => {
    fetch(`${process.env.REACT_APP_BACKEND_BASE}/getallusers`)
      .then((Response) => Response.json())
      .then((users) => setEmployees(users));
  }, []);

  function matchEmail(employees: IEmployeeInfo) {
    return employees.email === inputEmail;
  }

  function handleSubmit(e: React.SyntheticEvent) {
    const emailMatch = employees.find(matchEmail);
    e.preventDefault();
    if (emailMatch != null) {
      setEmailError(true);
      return;
    } else {
      userInfo = {
        name: inputName.charAt(0).toUpperCase() + inputName.slice(1),
        email: inputEmail.toLocaleLowerCase(),
        password: inputPassword,
        role: inputRole,
      };
      setActiveEmployee(userInfo);
    }
    axios
      .post(`${process.env.REACT_APP_BACKEND_BASE}/signup`, userInfo)
      .then((response) => {
        if (response.data.accessToken) {
          const { name, email, role } = userInfo;
          setActiveEmployee({
            ...userInfo,
            _id: response.data.insertedId,
            password: response.data.password,
          });
          setUserAuth({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          });

          localStorage.setItem(
            "UserAuth",
            JSON.stringify({
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            })
          );
          delete response.data.accessToken;
          delete response.data.refreshToken;
          delete response.data.password;
          localStorage.setItem(
            "UserInfo",
            JSON.stringify({ ...response.data, name, email, role })
          );
          navigate("/admindashboard");
        }
      })
      .catch(() => {
        /* */
      });
  }
  return (
    <>
      <Navigation />
      <div className="d-flex justify-content-center align-items-center height-41rem">
        <Card className="shadow-lg card-sizer-signup">
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="my-3 mt-1">Register</h3>
              <h6 className="roles-errors-tool-tip m-0 d-flex align-items-center">
                <svg
                  className={`warning-svg me-1${
                    emailError ? " show" : " hide"
                  }`}
                  clipRule="evenodd"
                  fillRule="evenodd"
                  strokeLinejoin="round"
                  strokeMiterlimit="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="m12.002 21.534c5.518 0 9.998-4.48 9.998-9.998s-4.48-9.997-9.998-9.997c-5.517 0-9.997 4.479-9.997 9.997s4.48 9.998 9.997 9.998zm0-1.5c-4.69 0-8.497-3.808-8.497-8.498s3.807-8.497 8.497-8.497 8.498 3.807 8.498 8.497-3.808 8.498-8.498 8.498zm0-6.5c-.414 0-.75-.336-.75-.75v-5.5c0-.414.336-.75.75-.75s.75.336.75.75v5.5c0 .414-.336.75-.75.75zm-.002 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"
                    fillRule="nonzero"
                    fill="#ff0000"
                  />
                </svg>
                {emailError && "Email already in use"}&nbsp;
              </h6>
            </div>
            <Form onSubmit={handleSubmit}>
              <FloatingLabel controlId="name" label="Name" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Jhon Doe"
                  name="name"
                  onChange={(e) => {
                    setInputName(e.target.value);
                  }}
                  autoComplete="off"
                  pattern="^[a-zA-Z ]*$"
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="email"
                label="Email address"
                className="mb-3"
              >
                <Form.Control
                  className={`${emailError && "border-danger"}`}
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  onChange={(e) => {
                    setInputEmail(e.target.value);
                    setEmailError(false);
                  }}
                  autoComplete="off"
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="password"
                label="Password"
                className="mb-3"
              >
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                  }}
                  required
                />
              </FloatingLabel>
              <FloatingLabel controlId="role" label="Role">
                <Form.Select
                  aria-label="Role select"
                  name="role"
                  defaultValue=""
                  onChange={(e) => {
                    setInputRole(e.target.value);
                  }}
                  required
                >
                  <option value="" disabled hidden>
                    Select role
                  </option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </Form.Select>
              </FloatingLabel>
              <Stack direction="vertical" className="form-group pt-3">
                <Button type="submit" variant="info" className="mt-3">
                  Register
                </Button>
              </Stack>
              <Stack direction="vertical" className="form-group pt-3">
                <p className="">Already registered?</p>
                <Button href="/signin" variant="outline-info">
                  Sign in
                </Button>
              </Stack>
            </Form>
          </div>
        </Card>
      </div>
    </>
  );
}
