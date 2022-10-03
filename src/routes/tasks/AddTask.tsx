import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { useNavigate } from "react-router-dom";
import makeAnimated from "react-select/animated";
import AsyncSelect from "react-select/async";
import { IEmployeeInfo } from "../../App";
import DashboardNav from "../../components/DashboardNav";
import VerticalNav from "../../components/VerticalNav";
import { IUserContext, UserContext } from "../../contexts/UserContext";
import "./AddTasks.css";
import DateSelect from "./components/DateSelect";

export interface IEmployeeSelect {
  value?: string;
  label?: string;
  email?: string;
  _id?: string;
  role?: string;
}

interface IFormData {
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
  const [employees, setEmployees] = useState<Array<IEmployeeInfo>>([]);
  const [inputTask, setInputTask] = useState<string>("");
  const [inputEmps, setInputEmps] = useState<Array<IEmployeeSelect>>([]);
  const [taskErrors, setTaskErrors] = useState<boolean>(false);
  const [dateErrors, setDateErrors] = useState<boolean>(false);
  const [empErrors, setEmpErrors] = useState<boolean>(false);

  const navigate = useNavigate();

  const { activeEmployee } = useContext<IUserContext>(UserContext);

  useEffect((): void => {
    fetch(`${process.env.REACT_APP_BACKEND_BASE}/getusers`)
      .then((Response) => Response.json())
      .then((users) => setEmployees(users));
  }, []);

  const empSelect: Array<IEmployeeSelect> = employees.map((employee) => {
    return {
      value: employee.name,
      label: employee.name,
      email: employee.email,
    };
  });

  const handleChange = (options: React.SetStateAction<IEmployeeSelect[]>) => {
    setInputEmps(options);
    setEmpErrors(false);
  };

  function compareDate(date: Date) {
    return new Date(date?.toDateString()) < new Date(new Date().toDateString());
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setDateErrors(false);

    const startDate = new Date();
    const deadline = new Date((e.target as HTMLFormElement).deadline.value);
    let employeeNames!: Array<string | undefined>;
    let employeeEmails!: Array<string | undefined>;
    if (!inputTask) setTaskErrors(true);
    if (compareDate(deadline)) setDateErrors(true);
    if (inputEmps.length === 0) {
      setEmpErrors(true);
    } else {
      employeeNames = inputEmps?.map((emps: IEmployeeSelect) => emps.value);
      employeeEmails = inputEmps?.map((emps: IEmployeeSelect) => emps.email);
    }

    if (taskErrors === false && empErrors === false && dateErrors === false) {
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
      await axios
        .post(`${process.env.REACT_APP_BACKEND_BASE}/addtask`, formData)
        .then((response) => {
          if (response.status === 200) {
            navigate("/alltasks");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
              <Stack direction="vertical" className="">
                <h3 className="mb-4 mt-3">Add task form</h3>
                <Form.Group className="mb-4" controlId="task">
                  <Form.Label>Task:</Form.Label>
                  <Form.Control
                    className=""
                    type="text"
                    name="task"
                    onChange={(e) => {
                      setInputTask(e.target.value);
                      setTaskErrors(false);
                    }}
                    placeholder="Task"
                    autoComplete="off"
                  />
                  {taskErrors && (
                    <h6 className="task-tool-tip">Please input task name</h6>
                  )}
                </Form.Group>

                <Form.Group className="mb-4" controlId="deadline">
                  <Form.Label>Deadline:</Form.Label>

                  <DateSelect />
                  {dateErrors && (
                    <h6 className="deadline-tool-tip">
                      Please select a valid deadline
                    </h6>
                  )}
                </Form.Group>

                <Form.Group className="mb-4" controlId="employees">
                  <Form.Label>Issued to:</Form.Label>

                  <AsyncSelect
                    isMulti={true}
                    cacheOptions
                    placeholder="Select User(s)"
                    name="employees"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    components={makeAnimated()}
                    defaultOptions={empSelect}
                    onChange={handleChange}
                    menuPlacement="auto"
                    maxMenuHeight={200}
                  />
                  {empErrors && (
                    <h6 className="employees-tool-tip">
                      Please fill out this field
                    </h6>
                  )}
                </Form.Group>

                <Form.Group className="d-flex justify-content-center mt-4 mb-1">
                  <Button
                    type="submit"
                    variant="info"
                    size="lg"
                    className="text-center font-main-color ms-4"
                  >
                    Submit
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
