import axios from "axios";
import { SetStateAction, useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Toast from "react-bootstrap/Toast";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { IEmployeeInfo } from "../../../App";
import { IUserContext, UserContext } from "../../../contexts/UserContext";
import { IEmployeeSelect } from "../../tasks/AddTask";
import "./EditPrivilegesForm.css";

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore-next-line
  employees.sort((a, b) => {
    return a.name && b.name && a.name.localeCompare(b.name);
  });

  const roleOptions: Array<IEmployeeSelect> = [
    { value: "Admin", label: "Admin" },
    { value: "User", label: "User" },
  ];

  const filteredEmployees = employees.filter(
    (emp) => emp.name !== activeEmployee.name
  );

  const empSelect = filteredEmployees.map((employee) => {
    return {
      value: employee.name,
      label: employee.name,
      _id: employee._id,
      role: employee.role,
    };
  });

  const handleEmpChange = (options: {
    value: SetStateAction<string>;
    _id: SetStateAction<string>;
    role: SetStateAction<string>;
  }) => {
    setInputEmp(options.value);
    setInputEmpId(options._id);
    setInputRole(options.role);
    setEmpErrors(false);
  };

  const filterItems = (inputValue: string) => {
    return (
      empSelect.length > 0 &&
      empSelect.filter((emp) =>
        emp?.label?.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  };

  const loadOptions = (
    inputValue: string,
    callback: (_options: unknown) => void
  ) => {
    setTimeout(() => {
      callback(filterItems(inputValue));
    }, 500);
  };

  const handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, "");
    setInputEmp(inputValue);
    return inputValue;
  };

  const handleRoleChange = (options: { value: SetStateAction<string> }) => {
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
            setTimeout(stateTimeout, 2000);
          }
        })
        .catch(() => {
          /**/
        });
    }
  }

  function stateTimeout() {
    setMessage(null);
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
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore-next-line
              loadOptions={loadOptions}
              onInputChange={handleInputChange}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  text: "black",
                  primary25: "rgb(13, 202, 240, 0.8)",
                  primary: "#0dcaf0",
                },
              })}
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
              isSearchable
              options={roleOptions}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore-next-line
              onChange={handleRoleChange}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  text: "black",
                  primary25: "rgb(13, 202, 240, 0.8)",
                  primary: "#0dcaf0",
                },
              })}
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
              className="text-center"
            >
              Update privileges
            </Button>
          </Form.Group>
          <div className="d-flex justify-content-center">
            {message ? (
              <Toast className="mt-5">
                <Toast.Header closeButton={false}>
                  <strong className="me-auto">Success</strong>
                </Toast.Header>
                <Toast.Body>User privileges updated.</Toast.Body>
              </Toast>
            ) : message === false ? (
              <Toast className="mt-5">
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
