import axios from "axios";
import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { useNavigate } from "react-router-dom";
import { IUserContext, UserContext } from "../../../contexts/UserContext";
import "./EditProfileForm.css";

interface IFormData {
  name?: string;
  email?: string;
  oldPassword: string;
  newPassword?: string;
}

export default function EditProfileForm(): JSX.Element {
  const [inputName, setInputName] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [oldInputPassword, setOldInputPassword] = useState<string>("");
  const [newInputPassword, setNewInputPassword] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<boolean>(false);

  const navigate = useNavigate();

  const { activeEmployee, setActiveEmployee } =
    useContext<IUserContext>(UserContext);

  const userInfo: IFormData = {
    name: inputName?.charAt(0)?.toUpperCase() + inputName?.slice(1),
    email: inputEmail?.toLocaleLowerCase(),
    oldPassword: oldInputPassword,
    newPassword: newInputPassword,
  };
  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (Object.keys(userInfo).length === 0) return;
    if (!userInfo.name) delete userInfo.name;
    if (!userInfo.email) delete userInfo.email;
    if (!userInfo.newPassword) delete userInfo.newPassword;

    !passwordErrors &&
      (await axios
        .post(
          `${process.env.REACT_APP_BACKEND_BASE}/updateuser/${activeEmployee._id}`,
          userInfo
        )
        .then((response) => {
          if (response.status === 200) {
            setActiveEmployee(Object.assign(activeEmployee, userInfo));
            navigate("/profile");
          }
        })
        .catch((error) => {
          if (error.response.status === 401) setPasswordErrors(true);
        }));
  }
  return (
    <div className="mx-3 my-2 grid-padding">
      <h3 className="mb-4 mt-3">Edit profile</h3>
      <Form onSubmit={handleSubmit}>
        <Stack direction="vertical">
          <Form.Group className="mb-4" controlId="name">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              className="px-2"
              type="text"
              placeholder={activeEmployee.name}
              onChange={(e) => {
                setInputName(e.target.value);
              }}
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="email">
            <Form.Label>E-mail:</Form.Label>
            <Form.Control
              className="px-2"
              type="text"
              placeholder={activeEmployee.email}
              onChange={(e) => {
                setInputEmail(e.target.value);
              }}
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="oldpassword">
            <Form.Label>Current password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Current password"
              onChange={(e) => {
                setOldInputPassword(e.target.value);
                setPasswordErrors(false);
              }}
            />
            {passwordErrors && (
              <h6 className="password-error-tool-tip">Invalid credentials</h6>
            )}
          </Form.Group>

          <Form.Group className="mb-4" controlId="newpassword">
            <Form.Label>New password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="New password"
              onChange={(e) => {
                setNewInputPassword(e.target.value);
              }}
            />
          </Form.Group>

          <Form.Group className="d-flex justify-content-center mb-1">
            <Button
              type="submit"
              variant="info"
              size="lg"
              className="text-center"
            >
              Update profile
            </Button>
          </Form.Group>
        </Stack>
      </Form>
    </div>
  );
}
