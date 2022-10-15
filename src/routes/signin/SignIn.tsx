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
  const [credentialsError, setCredentialsError] = useState<boolean>(false);
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
      setCredentialsError(true);
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
          if (error.response.status === 401) return setCredentialsError(true);
        });
  }

  return (
    <>
      <Navigation />
      <div className="d-flex justify-content-center align-items-center height-40rem">
        <Card className="shadow-lg card-sizer-signin">
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center">
            <h3 className="my-3 mt-1">Sign in</h3>
            <h6 className="roles-errors-tool-tip m-0 d-flex align-items-center">
                    <svg
                      className={`warning-svg me-1${
                        credentialsError ? " show" : " hide"
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
                    {credentialsError && "Invalid credentials"}&nbsp;
                  </h6>
            </div>
            <Form onSubmit={handleSubmit}>
              <FloatingLabel
                controlId="email"
                label="Email address"
                className="mb-3"
              >
                <Form.Control
                  className={`${credentialsError && "border-danger"}`}
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  onChange={(e) => {
                    setInputEmail(e.target.value);
                    setCredentialsError(false);
                  }}
                  autoComplete="off"
                  required
                />
              </FloatingLabel>
              <FloatingLabel controlId="password" label="Password">
                <Form.Control
                  className={`${credentialsError && "border-danger"}`}
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setCredentialsError(false);
                  }}
                  required
                />
              </FloatingLabel>
              <Stack direction="vertical" className="form-group pt-3">
                <Button variant="info" type="submit" className="mt-3">
                  Sign in
                </Button>
              </Stack>
              <Stack direction="vertical" className="form-group pt-3">
                <p className="">New user?</p>
                <Button href="/signup" variant="outline-info">
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
