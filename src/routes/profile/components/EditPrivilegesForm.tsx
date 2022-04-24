import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Toast from "react-bootstrap/Toast";
import "./EditPrivilegesForm.css";
import { IEmployeeInfo } from "../../../App";
import { IEmployeeSelect } from "../../tasks/AddTask";
import { IUserContext, UserContext } from "../../../contexts/UserContext";

export default function EditPrivilegesForm(): JSX.Element {
  const [employees, setEmployees] = useState<Array<IEmployeeInfo>>([]);
  const [inputRole, setInputRole] = useState<string>("");
  const [inputEmp, setInputEmp] = useState<string>("");
  const [inputEmpId, setInputEmpId] = useState<string>("");
  const [empErrors, setEmpErrors] = useState<boolean>(false);
  const [roleErrors, setRoleErrors] = useState<boolean>(false);
  const [message, setMessage] = useState<boolean | null>(null);

  const { activeEmployee } = useContext<IUserContext>(UserContext);

  useEffect((): void => {
    fetch(`${process.env.REACT_APP_BACKEND_BASE}/getallusers`)
      .then((Response) => Response.json())
      .then((users) => setEmployees(users));
  }, []);

  const roleOptions: Array<IEmployeeSelect> = [
    { value: "Admin", label: "Admin" },
    { value: "User", label: "User" },
  ];

  let filteredEmployees: Array<IEmployeeInfo> = employees.filter(
    (emp) => emp.name !== activeEmployee.name
  );

  let empSelect: Array<IEmployeeSelect> = filteredEmployees.map((employee) => {
    return {
      value: employee.name,
      label: employee.name,
      _id: employee._id,
      role: employee.role,
    };
  });

  const handleEmpChange = (options: any) => {
    setInputEmp(options.value);
    setInputEmpId(options._id);
    setEmpErrors(false);
  };

  const handleRoleChange = (options: any) => {
    setInputRole(options.value);
    setRoleErrors(false);
  };
  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (inputEmp.length === 0) setEmpErrors(true);
    if (inputRole.length === 0) setRoleErrors(true);

    if (inputEmp.length > 0 && inputRole.length > 0) {
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_BASE}/privileges/${inputEmpId}`,
          {
            activeEmpRole: activeEmployee.role,
            role: inputRole,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setMessage(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  return (
    <div className="mx-3 my-2 grid-area-eprivileges">
      <h3 className="mb-4 mt-3">Edit privileges</h3>
      <Form onSubmit={handleSubmit}>
        <Stack direction="vertical">
          <Form.Group className="mb-4" controlId="employee">
            <Form.Label>Employees:</Form.Label>
            <AsyncSelect
              name="employee"
              className="basic-single"
              placeholder="Select employee"
              classNamePrefix="select"
              cacheOptions
              defaultOptions={empSelect}
              onChange={handleEmpChange}
            />
            {empErrors && (
              <h6 className="employees-errors-tool-tip">
                Please select an employee
              </h6>
            )}
          </Form.Group>

          <Form.Group className="mb-5" controlId="role">
            <Form.Label>Role:</Form.Label>
            <Select
              name="Role"
              placeholder="Select role"
              className="basic-multi-select"
              classNamePrefix="select"
              options={roleOptions}
              onChange={handleRoleChange}
            />
            {roleErrors && (
              <h6 className="roles-errors-tool-tip">Please select a role</h6>
            )}
          </Form.Group>

          <Form.Group className="d-flex justify-content-center mb-1">
            <Button
              type="submit"
              variant="info"
              size="lg"
              className="text-center font-main-color">
              Update privileges
            </Button>
          </Form.Group>
          <div className="d-flex justify-content-center">
            {message ? (
              <Toast className="mt-5" delay={3000} autohide>
                <Toast.Header closeButton={false}>
                  <strong className="me-auto">Success</strong>
                </Toast.Header>
                <Toast.Body>User privileges updated.</Toast.Body>
              </Toast>
            ) : message === false ? (
              <Toast className="mt-5" delay={3000} autohide>
                <Toast.Header closeButton={false}>
                  <strong className="me-auto">Failed</strong>
                </Toast.Header>
                <Toast.Body>Update privileges failed.</Toast.Body>
              </Toast>
            ) : null}
          </div>
        </Stack>
      </Form>
    </div>
  );
}
