import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { IEmployeeInfo } from "../App";
import { IUserContext, UserContext } from "../contexts/UserContext";
import { IFormData, ISelectOptions } from "../routes/tasks/AddTask";
import { ITasks } from "../routes/tasks/components/TasksTable";
import TaskModalForm from "./TaskModalForm";
import "./ViewTaskModal.css";

export default function ViewTaskModal(props: {
  activeModalInfo: ITasks | undefined;
  showTaskModal: boolean | undefined;
  handleClose: (() => void) | undefined;
  setShowToastSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToastFail: React.Dispatch<React.SetStateAction<boolean>>;
  setForceUpdate: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element {
  const [taskName, setTaskName] = useState<string>("");

  const [inputEmps, setInputEmps] = useState<Array<ISelectOptions>>([]);
  const [taskError, setTaskError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [empError, setEmpError] = useState<boolean>(false);

  const [employees, setEmployees] = useState<Array<IEmployeeInfo>>([]);

  const [defaultModalInfo, setDefaultModalInfo] = useState<ITasks | undefined>(
    undefined
  );

  const [editable, setEditable] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean | null>(null);
  const [key, setKey] = useState<number>(0);

  const { activeEmployee } = useContext<IUserContext>(UserContext);

  useEffect((): void => {
    fetch(`${process.env.REACT_APP_BACKEND_BASE}/getusers`)
      .then((Response) => Response.json())
      .then((users) => {
        setEmployees(
          users.sort((a: { name: string }, b: { name: string }) => {
            return a.name && b.name && a.name.localeCompare(b.name);
          })
        );
      });
  }, []);

  useEffect(() => {
    setDefaultModalInfo(props.activeModalInfo);
    props.activeModalInfo && setTaskName(props.activeModalInfo.task);
    props.activeModalInfo &&
      props.activeModalInfo.employeeNames.map((name, i) => {
        const defaultEmps: ISelectOptions = {};
        defaultEmps.label = name;
        defaultEmps.value = name;
        defaultEmps.email = props.activeModalInfo?.employeeEmails[i];
        setInputEmps((assignedEmps) => [...assignedEmps, defaultEmps]);
      });
    setKey((key) => (key += 1));
    return () => {
      setInputEmps([]);
      setTaskError(false);
      setEmpError(false);
      setDateError(false);
    };
  }, [props.activeModalInfo]);

  const handleDeleteConfirmShow = () => {
    setDeleteConfirm(true);
    setEditable(false);
  };

  const handleModalEditRevert = () => {
    props?.activeModalInfo && setTaskName(props?.activeModalInfo.task);
    setDeleteConfirm(null);
    setEditable(false);
    setKey((key) => (key += 1));
    setDefaultModalInfo(props.activeModalInfo);
    setDeleteConfirm(null);
    setEditable(false);
    setTaskError(false);
    setEmpError(false);
    setDateError(false);
  };

  const handleDeleteConfirmHide = () => setDeleteConfirm(false);

  async function handlePostToDB(formData: IFormData) {
    defaultModalInfo &&
      (await axios
        .post(
          `${process.env.REACT_APP_BACKEND_BASE}/updatetask/${defaultModalInfo._id}`,
          formData
        )
        .then((response) => {
          if (response.status === 200) {
            props.handleClose?.();
            props.setShowToastSuccess(true);
            setTimeout(() => {
              props.setShowToastSuccess(false);
              props.setForceUpdate((current) => (current += 1));
            }, 3000);
          }
        })
        .catch(() => {
          props.handleClose?.();
          handleModalEditRevert()
          props.setShowToastFail(true);
          setTimeout(() => {
            props.setShowToastFail(false);
            props.setForceUpdate((current) => (current += 1));
          }, 3000);
        }));
  }

  function taskValidation() {
    if (!taskName) {
      setTaskError(true);
      return false;
    }
    return true;
  }

  function employeeValidation() {
    if (inputEmps.length === 0) {
      setEmpError(true);
      return false;
    }
    return true;
  }

  function compareDate(date: Date) {
    return new Date(date?.toDateString()) < new Date(new Date().toDateString());
  }

  function dateValidation(deadline: Date) {
    if (compareDate(deadline)) {
      setDateError(true);
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

  async function handleEditSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const deadline = new Date(
      (e.target as HTMLFormElement).form.deadline.value
    );
    const status = (e.target as HTMLFormElement).form.status.value;
    const startDate = defaultModalInfo && new Date(defaultModalInfo.startDate);
    validateInputs(deadline);
    if (!validateInputs(deadline)) return false;
    const employeeNames = inputEmps?.map((emps: ISelectOptions) => emps.value);
    const employeeEmails = inputEmps?.map((emps: ISelectOptions) => emps.email);
    const formData: IFormData = {
      task: taskName,
      adminEmail: activeEmployee.email,
      adminRole: activeEmployee.role,
      adminName: activeEmployee.name,
      deadline: deadline,
      startDate: startDate as Date,
      employeeNames: employeeNames,
      employeeEmails: employeeEmails,
      status: status,
    };
    await handlePostToDB(formData);
  }

  async function handleDeleteSubmit() {
    await axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE}/updatedeletetasks`,
        Array(defaultModalInfo?._id)
      )
      .then((response) => {
        if (response.status === 200) {
          props.handleClose?.();
          props.setShowToastSuccess(true);
          setTimeout(() => {
            props.setShowToastSuccess(false);
            props.setForceUpdate((current) => (current += 1));
          }, 3000);
        }
      })
      .catch(() => {
        props.handleClose?.();
        props.setShowToastFail(true);
        setTimeout(() => {
          props.setShowToastFail(false);
          props.setForceUpdate((current) => (current += 1));
        }, 3000);
      });
  }

  return (
    <>
      <Modal
        dialogClassName="modal-45w mt-5"
        show={props.showTaskModal}
        onHide={() => {
          props.handleClose?.();
          handleModalEditRevert();
        }}
        onClick={(e: React.SyntheticEvent) => e.stopPropagation()}
      >
        <Form
          key={key}
          className={`transition ${editable ? "border-modal" : ""}${
            deleteConfirm ? "border-modal-danger" : ""
          }`}
        >
          <Modal.Header closeButton>
            <Modal.Title
              className={`text-wrap${editable ? " fst-italic" : ""}`}
            >
              {taskName}&nbsp;
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TaskModalForm
              activeModalInfo={props.activeModalInfo}
              employees={employees}
              editable={editable}
              defaultModalInfo={defaultModalInfo}
              setTaskName={setTaskName}
              setInputEmps={setInputEmps}
              taskError={taskError}
              setTaskError={setTaskError}
              empError={empError}
              setEmpError={setEmpError}
              dateError={dateError}
              setDateError={setDateError}
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
              {taskError && "Please input a task name"}
            </h6>
            <h6 className="roles-errors-tool-tip m-0 mt-2 d-flex align-items-center">
              <svg
                className={`warning-svg me-1${dateError ? " show" : " hide"}`}
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
              {dateError && "Please select a valid deadline"}
            </h6>
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
              {empError && "Please assign at least one employee"}
            </h6>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            {activeEmployee.role === "User" ? (
              <>
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-disabled">
                      You don&apos;t have the required privileges
                    </Tooltip>
                  }
                >
                  <span className="d-inline-block me-auto cursor-disabled">
                    <Button variant="outline-danger" disabled>
                      Delete task
                    </Button>
                  </span>
                </OverlayTrigger>
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-disabled">
                      You don&apos;t have the required privileges
                    </Tooltip>
                  }
                >
                  <span className="d-inline-block cursor-disabled">
                    <Button variant="info" disabled>
                      Edit task
                    </Button>
                  </span>
                </OverlayTrigger>
              </>
            ) : (
              <>
                <p className="text-center fw-bold">
                  &nbsp;
                  {deleteConfirm &&
                    "Are you sure you want to delete this task?"}
                </p>
                <div className="d-flex justify-content-between w-100">
                  {editable ? (
                    <Button
                      variant="outline-secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        handleModalEditRevert();
                      }}
                    >
                      Discard changes
                    </Button>
                  ) : (
                    <Button
                      variant="outline-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteConfirmShow();
                        setEditable(false);
                        deleteConfirm && handleDeleteSubmit();
                      }}
                    >
                      Delete task
                    </Button>
                  )}
                  {deleteConfirm ? (
                    <Button
                      variant="outline-secondary"
                      onClick={(e) => {
                        setDeleteConfirm(null);
                        setEditable(false);
                        e.preventDefault();
                      }}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      variant="outline-info"
                      type="submit"
                      onClick={(e) => {
                        handleDeleteConfirmHide();
                        setEditable(true);
                        e.preventDefault();
                        editable && handleEditSubmit(e);
                      }}
                    >
                      {editable ? "Save changes" : "Edit task"}
                    </Button>
                  )}
                </div>
              </>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
