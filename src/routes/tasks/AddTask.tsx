import axios from "axios";
import React, { SetStateAction, useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { useNavigate } from "react-router-dom";
import DashboardNav from "../../components/DashboardNav";
import DateSelect from "../../components/DateSelect";
import EmployeeAsyncSelect from "../../components/EmployeeAsyncSelect";
import VerticalNav from "../../components/VerticalNav";
import { IUserContext, UserContext } from "../../contexts/UserContext";
import "./AddTasks.css";

export interface ISelectOptions {
  value?: string;
  label?: string;
  email?: string;
  _id?: string;
  role?: string;
}

export interface IFormData {
  task: string | undefined;
  adminEmail: string | undefined;
  adminRole: string | undefined;
  adminName: string | undefined;
  startDate: Date;
  deadline: Date;
  employeeNames: Array<string | undefined> | undefined;
  employeeEmails: Array<string | undefined> | undefined;
  status: string;
}

export default function AddTask(): JSX.Element {
  const [inputTask, setInputTask] = useState<string>("");
  const [inputEmps, setInputEmps] = useState<Array<ISelectOptions>>([]);
  const [empErrors, setEmpErrors] = useState<boolean>(false);
  const [taskError, setTaskErrors] = useState<boolean>(false);
  const [dateErrors, setDateErrors] = useState<boolean>(false);

  const navigate = useNavigate();

  const { activeEmployee } = useContext<IUserContext>(UserContext);

  const handleEmpChange = (options: {
    value?: SetStateAction<string> | undefined;
    label?: SetStateAction<string> | undefined;
    _id?: SetStateAction<string> | undefined;
    role?: SetStateAction<string> | undefined;
    email?: SetStateAction<string> | undefined;
  }) => {
    setInputEmps(options as SetStateAction<Array<ISelectOptions>>);
    setEmpErrors(false);
  };
  
  function taskValidation() {
    if (!inputTask) {
      setTaskErrors(true);
      return false;
    }
    return true;
  }

  function employeeValidation() {
    if (inputEmps.length === 0) {
      setEmpErrors(true);
      return false;
    }
    return true;
  }

  function compareDate(date: Date) {
    return new Date(date?.toDateString()) < new Date(new Date().toDateString());
  }

  function dateValidation(deadline: Date) {
    if (compareDate(deadline)) {
      setDateErrors(true);
      return false;
    }
    return true;
  }

  function validateInputs(deadline: Date) {
    taskValidation();
    dateValidation(deadline);
    employeeValidation();
    if (!taskValidation() || !dateValidation(deadline) || !employeeValidation())
      return false;
    return true;
  }

  async function handlePostToDb(formData: IFormData) {
    await axios
      .post(`${process.env.REACT_APP_BACKEND_BASE}/addtask`, formData)
      .then((response) => {
        if (response.status === 200) {
          navigate("/tasks");
        }
      })
      .catch(() => {
        /**/
      });
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const startDate = new Date();
    const deadline = new Date((e.target as HTMLFormElement).deadline.value);
    validateInputs(deadline);
    if (!validateInputs(deadline)) return false;
    const employeeNames = inputEmps?.map((emps: ISelectOptions) => emps.value);
    const employeeEmails = inputEmps?.map((emps: ISelectOptions) => emps.email);
    const formData: IFormData = {
      task: inputTask,
      adminEmail: activeEmployee.email,
      adminRole: activeEmployee.role,
      adminName: activeEmployee.name,
      startDate: startDate,
      deadline: deadline,
      employeeNames: employeeNames,
      employeeEmails: employeeEmails,
      status: "Incomplete",
    };
    e.persist();
    await handlePostToDb(formData);
  }

  return (
    <>
      <VerticalNav />
      <div className="d-grid custom-d-grid">
        <DashboardNav />

        <Card className="mx-3 my-2 custom-card-padding">
          <Card.Body>
            <Form
              onSubmit={handleSubmit}
              className="fixed-width d-flex justify-content-center"
            >
              <Stack direction="vertical">
                <h3 className="mb-4 mt-3">Add task form</h3>
                <Form.Group className="mb-2" controlId="task">
                  <Form.Label>Task:</Form.Label>
                  <Form.Control
                    className={`rounded-0 ${
                      taskError ? "border-danger" : "custom-input-field"
                    }`}
                    type="text"
                    name="task"
                    onChange={(e) => {
                      setInputTask(e.target.value);
                      setTaskErrors(false);
                    }}
                    placeholder="Task"
                    autoComplete="off"
                  />
                  <h6 className="roles-errors-tool-tip m-0 mt-2 d-flex align-items-center">
                    <svg
                      className={`warning-svg me-1${
                        taskError ? " show" : " hide"
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
                    {taskError && "Please input task name"}&nbsp;
                  </h6>
                </Form.Group>

                <Form.Group className="mb-2" controlId="employees">
                  <Form.Label>Issued to:</Form.Label>
                  <EmployeeAsyncSelect
                    placeholder={"Select User(s)"}
                    multi={true}
                    editable={true}
                    error={empErrors ? true : false}
                    onChange={handleEmpChange}
                  />
                  <h6 className="roles-errors-tool-tip m-0 mt-2 d-flex align-items-center">
                    <svg
                      className={`warning-svg me-1${
                        empErrors ? " show" : " hide"
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
                    {empErrors && "Please assign at least one employee"}&nbsp;
                  </h6>
                </Form.Group>

                <Form.Group className="mb-4" controlId="deadline">
                  <Form.Label>Deadline:</Form.Label>
                  <DateSelect
                    name="deadline"
                    setDateErrors={setDateErrors}
                    placement={"top"}
                    error={dateErrors ? true : false}
                  />
                  <h6 className="roles-errors-tool-tip m-0 mt-2 d-flex align-items-center">
                    <svg
                      className={`warning-svg me-1${
                        dateErrors ? " show" : " hide"
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
                    {dateErrors && "Please select a valid deadline"}&nbsp;
                  </h6>
                </Form.Group>

                <Form.Group className="d-flex justify-content-center mt-4 mb-1">
                  <Button
                    type="submit"
                    variant="outline-info"
                    size="lg"
                    className="text-center ms-4"
                  >
                    Submit task
                  </Button>
                </Form.Group>
              </Stack>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
