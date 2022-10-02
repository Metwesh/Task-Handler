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
  const [emailErrors, setEmailErrors] = useState<boolean>(false);

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
      setEmailErrors(true);
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
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <>
      <Navigation />
      <div className="d-flex justify-content-center align-items-center height-41rem">
        <Card className="shadow-lg card-sizer-signup">
          <div className="p-4">
            <h3 className="my-3 mt-1">Register</h3>
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
                  className="p-relative"
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  onChange={(e) => {
                    setInputEmail(e.target.value);
                    setEmailErrors(false);
                  }}
                  autoComplete="off"
                  required
                />
                {emailErrors && (
                  <h6 className="email-tool-tip">Email already exists</h6>
                )}
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
                <Button
                  href="/signin"
                  variant="outline-info"
                  className="font-main-color"
                >
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
