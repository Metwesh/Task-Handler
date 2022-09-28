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
import "./SignIn.css";

export default function SignIn(): JSX.Element {
  const [employees, setEmployees] = useState<Array<IEmployeeInfo>>([]);
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<boolean>(false);
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
    e.preventDefault();
    const emailMatch: IEmployeeInfo | undefined = employees.find(matchEmail);
    if (!emailMatch) {
      setEmailErrors(true);
      return;
    } else {
      userInfo = {
        email: inputEmail.toLocaleLowerCase(),
        password: inputPassword,
      };
      setActiveEmployee(emailMatch);
    }
    emailMatch &&
      axios
        .post(`${process.env.REACT_APP_BACKEND_BASE}/signin`, userInfo)
        .then((response) => {
          if (response.data.accessToken) {
            const { name, email, role, _id } = emailMatch;

            localStorage.setItem(
              "UserInfo",
              JSON.stringify({
                name,
                email,
                role,
                _id,
              })
            );

            setActiveEmployee(emailMatch);
            delete response.data.password;
            localStorage.setItem("UserAuth", JSON.stringify(response.data));
            setUserAuth({
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            });
            navigate("/admindashboard");
          }
        })
        .catch((error) => {
          if (error.response.status === 401) return setPasswordErrors(true);
        });
  }

  return (
    <>
      <Navigation />
      <div className="d-flex justify-content-center align-items-center height-40rem">
        <Card className="shadow-lg card-sizer-signin">
          <div className="p-4">
            <h3 className="my-3 mt-1">Sign in</h3>
            <Form onSubmit={handleSubmit}>
              <FloatingLabel
                controlId="email"
                label="Email address"
                className="mb-3">
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
                  <h6 className="email-tool-tip">Invalid credentials</h6>
                )}
              </FloatingLabel>
              <FloatingLabel controlId="password" label="Password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setPasswordErrors(false);
                  }}
                  required
                />
                {passwordErrors && (
                  <h6 className="email-tool-tip">Invalid credentials</h6>
                )}
              </FloatingLabel>
              <Stack direction="vertical" className="form-group pt-3">
                <Button variant="info" type="submit" className="mt-3">
                  Sign in
                </Button>
              </Stack>
              <Stack direction="vertical" className="form-group pt-3">
                <p className="">New user?</p>
                <Button
                  href="/signup"
                  variant="outline-info"
                  className="font-main-color">
                  Register
                </Button>
              </Stack>
            </Form>
          </div>
        </Card>
      </div>
    </>
  );
}
