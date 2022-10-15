import axios from "axios";
import { SetStateAction, useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Toast from "react-bootstrap/Toast";
import { IEmployeeInfo } from "../../../App";
import EmployeeAsyncSelect from "../../../components/EmployeeAsyncSelect";
import SyncSelect from "../../../components/SyncSelect";
import { IUserContext, UserContext } from "../../../contexts/UserContext";
import { ISelectOptions } from "../../tasks/AddTask";
import "./EditPrivilegesForm.css";

export default function EditPrivilegesForm(): JSX.Element {
  const [inputRole, setInputRole] = useState<string>("");
  const [defaultRole, setDefaultRole] = useState<string>("");
  const [inputEmp, setInputEmp] = useState<string>("");
  const [inputEmpId, setInputEmpId] = useState<string>("");

  const [empError, setEmpError] = useState<boolean>(false);
  const [roleError, setRoleError] = useState<boolean>(false);
  const [redundantError, setRedundantError] = useState<boolean>(false);

  const [showToastSuccess, setShowToastSuccess] = useState<boolean>(false);
  const [showToastFail, setShowToastFail] = useState<boolean>(false);

  const { activeEmployee } = useContext<IUserContext>(UserContext);

  const roleOptions: Array<ISelectOptions> = [
    { value: "Admin", label: "Admin" },
    { value: "User", label: "User" },
  ];

  const handleEmpChange = (options: {
    value?: SetStateAction<string>;
    label?: SetStateAction<string>;
    _id?: SetStateAction<string>;
    role?: SetStateAction<string>;
    email?: SetStateAction<string>;
  }) => {
    setInputEmp(options.value as string);
    setInputEmpId(options._id as string);
    setDefaultRole(options.role as string);
    setRoleError(false);
    setRedundantError(false);
    setEmpError(false);
  };

  const handleRoleChange = (options: { value: SetStateAction<string> }) => {
    setInputRole(options.value);
    setRoleError(false);
    setRedundantError(false);
  };

  function employeeFieldValidation(
    inputEmp: string,
    setEmpErrors: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    if (inputEmp) return true;
    setEmpErrors(true);
    return false;
  }

  function roleFieldValidation(
    inputRole: string,
    setRoleErrors: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    if (inputRole) return true;
    setRoleErrors(true);
    return false;
  }

  function validateRedundantPost(
    inputRole: string,
    defaultRole: string,
    setRedundantError: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    if (
      employeeFieldValidation(inputEmp, setEmpError) &&
      roleFieldValidation(inputRole, setRoleError) &&
      inputRole === defaultRole
    ) {
      setRedundantError(true);
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    employeeFieldValidation(inputEmp, setEmpError);
    roleFieldValidation(inputRole, setRoleError);
    validateRedundantPost(inputRole, defaultRole, setRedundantError);

    if (
      !employeeFieldValidation(inputEmp, setEmpError) ||
      !roleFieldValidation(inputRole, setRoleError) ||
      !validateRedundantPost(inputRole, defaultRole, setRedundantError)
    )
      return false;

    await handlePostToDB(
      inputEmpId,
      activeEmployee,
      inputRole,
      setShowToastSuccess,
      setShowToastFail
    );
  }

  async function handlePostToDB(
    inputEmpId: string,
    activeEmployee: IEmployeeInfo,
    inputRole: string,
    setShowToastSuccess: React.Dispatch<React.SetStateAction<boolean>>,
    setShowToastFail: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    await axios
      .post(`${process.env.REACT_APP_BACKEND_BASE}/privileges/${inputEmpId}`, {
        activeEmpRole: activeEmployee.role,
        role: inputRole,
      })
      .then((response) => {
        if (response.status === 200) {
          setShowToastSuccess(true);
          setTimeout(() => setShowToastSuccess(false), 3000);
        }
      })
      .catch(() => {
        setShowToastFail(true);
        setTimeout(() => setShowToastFail(false), 3000);
      });
  }

  return (
    <div className="mx-3 my-2 grid-area-eprivileges">
      <div className="d-flex justify-content-center">
        <div className="max-width-50">
          <Stack direction="vertical">
            <h3 className="mb-4 mt-3">Edit privileges</h3>
            <Form.Group className="mb-2" controlId="employee">
              <Form.Label>Employees:</Form.Label>
              <EmployeeAsyncSelect
                placeholder={"Select employee"}
                error={empError ? true : false}
                multi={false}
                editable={true}
                onChange={handleEmpChange}
              />
              <h6 className="roles-errors-tool-tip m-0 mt-2 d-flex align-items-center">
                <svg
                  className={`warning-svg me-1${empError ? " show" : " hide"}`}
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
                {empError && "Please select an employee"}&nbsp;
              </h6>
            </Form.Group>

            <Form.Group className="mb-2" controlId="role">
              <Form.Label>Role:</Form.Label>
              <SyncSelect
                name={"role"}
                placeholder={"Select role"}
                editable={true}
                options={roleOptions}
                defaultRole={defaultRole}
                onChange={handleRoleChange}
                setInputRole={setInputRole}
                error={roleError || redundantError ? true : false}
              />
              <h6 className="roles-errors-tool-tip m-0 mt-2 d-flex align-items-center">
                <svg
                  className={`warning-svg me-1${
                    roleError || redundantError ? " show" : " hide"
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
                {roleError && "Please select a role"}
                {!roleError &&
                  redundantError &&
                  `${inputEmp} already has ${defaultRole.toLocaleLowerCase()} privileges`}
                &nbsp;
              </h6>
            </Form.Group>

            <Form.Group className="d-flex justify-content-center mb-1">
              <Button
                type="submit"
                variant="outline-info"
                size="lg"
                className="text-center"
                onClick={handleSubmit}
              >
                Update privileges
              </Button>
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Toast
                className="mt-5"
                bg="info"
                show={showToastSuccess}
                animation
              >
                <Toast.Header closeButton={false}>
                  <strong className="me-auto">Success</strong>
                </Toast.Header>
                <Toast.Body>User privileges updated.</Toast.Body>
              </Toast>
              <Toast
                className="mt-5"
                bg="danger"
                show={showToastFail}
                animation
              >
                <Toast.Header closeButton={false}>
                  <strong className="me-auto">Failure</strong>
                </Toast.Header>
                <Toast.Body className="text-white">
                  Update privileges failed.
                </Toast.Body>
              </Toast>
            </div>
          </Stack>
        </div>
      </div>
    </div>
  );
}
