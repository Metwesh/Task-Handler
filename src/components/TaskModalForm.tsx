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
  setInputEmps: React.Dispatch<React.SetStateAction<Array<ISelectOptions>>>;
  setEmpErrors: React.Dispatch<React.SetStateAction<boolean>>;
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
    props.setEmpErrors(false);
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
      </Form.Label>
      <Col sm="8" className="mb-2">
        <Form.Control
          className={`rounded-0 custom-input-field${
            props.editable ? "" : " greyed-out"
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
      </Form.Label>
      <Col sm="8" className="mb-2">
        <DateSelect
          name="deadline"
          disabled={props.editable ? false : true}
          initialValue={props.defaultModalInfo?.deadline}
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
      </Form.Label>
      <Col sm="8" className="mb-2">
        <EmployeeAsyncSelect
          placeholder={"Select employee(s)"}
          activeModalInfo={props.activeModalInfo}
          editable={props.editable}
          multi={true}
          onChange={handleEmpChange}
        />
      </Col>
    </Form.Group>
  );
}
