import React, { SetStateAction } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { IEmployeeInfo } from "../App";
import { ISelectOptions } from "../routes/tasks/AddTask";
import { ITasks } from "../routes/tasks/components/TasksTable";
import DateSelect from "./DateSelect";
import EmployeeAsyncSelect from "./EmployeeAsyncSelect";
import SyncSelect from "./SyncSelect";
import "./TaskModalForm.css";

export default function TaskModalForm(props: {
  activeModalInfo: ITasks | undefined;
  employees: Array<IEmployeeInfo>;
  editable: boolean;
  defaultModalInfo: ITasks | undefined;
  setTaskName: React.Dispatch<React.SetStateAction<string>>;
  taskError: boolean;
  setTaskError: React.Dispatch<React.SetStateAction<boolean>>;
  setInputEmps: React.Dispatch<React.SetStateAction<Array<ISelectOptions>>>;
  empError: boolean;
  setEmpError: React.Dispatch<React.SetStateAction<boolean>>;
  dateError: boolean;
  setDateError: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  const statusOptions = [
    { value: "Incomplete", label: "Incomplete" },
    { value: "Pending", label: "Pending" },
    { value: "Complete", label: "Complete" },
  ];

  const handleEmpChange = (options: {
    value?: SetStateAction<string> | undefined;
    label?: SetStateAction<string> | undefined;
    _id?: SetStateAction<string> | undefined;
    role?: SetStateAction<string> | undefined;
    email?: SetStateAction<string> | undefined;
  }) => {
    props.setInputEmps(options as SetStateAction<Array<ISelectOptions>>);
    props.setEmpError(false);
  };

  return (
    <Form.Group as={Row} className="mb-3 mt-2" controlId="editTask">
      <Form.Label column sm="4" className="fw-bold">
        Task ID
      </Form.Label>
      <Col sm="8" className="mb-2">
        <Form.Control
          className={`rounded-0 custom-input-field${
            props.editable ? "" : " greyed-out"
          }`}
          title="This field is read-only"
          disabled
          readOnly={props.editable ? false : true}
          defaultValue={props.defaultModalInfo && props.defaultModalInfo._id}
        />
      </Col>
      <Form.Label column sm="4" className="fw-bold">
        Issued on
      </Form.Label>
      <Col sm="8" className="mb-2" title={"This field is read-only"}>
        <DateSelect
          disabled={true}
          initialValue={props.defaultModalInfo?.startDate}
        />
      </Col>
      <Form.Label column sm="4" className="fw-bold">
        Task name
        {props.taskError && (
          <svg
            className="warning-svg ms-1"
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
        )}
      </Form.Label>
      <Col sm="8" className="mb-2">
        <Form.Control
          className={`rounded-0 ${props.editable ? "" : " greyed-out"} ${
            props.taskError ? " border-danger" : " custom-input-field"
          }`}
          disabled={props.editable ? false : true}
          readOnly={props.editable ? false : true}
          defaultValue={props.defaultModalInfo && props.defaultModalInfo.task}
          onChange={(e) =>
            props.setTaskName((e.target as HTMLInputElement).value)
          }
        />
      </Col>
      <Form.Label column sm="4" className="fw-bold">
        Deadline
        {props.dateError && (
          <svg
            className="warning-svg ms-1"
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
        )}
      </Form.Label>
      <Col sm="8" className="mb-2">
        <DateSelect
          name="deadline"
          disabled={props.editable ? false : true}
          initialValue={props.defaultModalInfo?.deadline}
          error={props.dateError}
        />
      </Col>
      <Form.Label column sm="4" className="fw-bold">
        Task status
      </Form.Label>
      <Col sm="8" className="mb-2">
        <SyncSelect
          name={"status"}
          placeholder={"Select status"}
          defaultModalInfo={props.defaultModalInfo}
          editable={props.editable}
          options={statusOptions}
        />
      </Col>
      <Form.Label column sm="4" className="fw-bold">
        Employee(s)
        {props.empError && (
          <svg
            className="warning-svg ms-1"
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
        )}
      </Form.Label>
      <Col sm="8" className="mb-2">
        <EmployeeAsyncSelect
          placeholder={"Select employee(s)"}
          activeModalInfo={props.activeModalInfo}
          editable={props.editable}
          multi={true}
          error={props.empError}
          onChange={handleEmpChange}
        />
      </Col>
    </Form.Group>
  );
}
