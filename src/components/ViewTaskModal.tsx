import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { IEmployeeInfo } from "../App";
import { IUserContext, UserContext } from "../contexts/UserContext";
import { ITasks } from "../routes/tasks/components/TasksTable";
import TaskModalForm from "./TaskModalForm";
import "./ViewTaskModal.css";

// interface IFormData {
//   task: string | undefined;
//   adminEmail: string | undefined;
//   adminRole: string | undefined;
//   adminName: string | undefined;
//   deadline: Date;
//   employeeNames: Array<string | undefined> | undefined;
//   employeeEmails: Array<string | undefined> | undefined;
//   status: string;
// }

export default function ViewTaskModal(props: {
  activeModalInfo: ITasks | undefined;
  showTaskModal: boolean | undefined;
  handleClose: (() => void) | undefined;
  setShowToastSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToastFail: React.Dispatch<React.SetStateAction<boolean>>;
  setForceUpdate: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element {
  const [taskName, setTaskName] = useState<string>("");

  const [employees, setEmployees] = useState<Array<IEmployeeInfo>>([]);

  const [defaultModalInfo, setDefaultModalInfo] = useState<ITasks | undefined>(
    undefined
  );

  const [editable, setEditable] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean | null>(null);
  const [key, setKey] = useState<number>(0);

  const handleDeleteConfirmShow = () => {
    setDeleteConfirm(true);
    setEditable(false);
  };

  const handleModalEditRevert = () => {
    setDeleteConfirm(null);
    setEditable(false);
  };

  const handleDeleteConfirmHide = () => setDeleteConfirm(false);

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
    setKey((key) => (key += 1));
  }, [props.activeModalInfo]);

  // async function handlePostToDB(formData: IFormData) {
  //   defaultModalInfo &&
  //     (await axios
  //       .post(
  //         `${process.env.REACT_APP_BACKEND_BASE}/updatetask/${defaultModalInfo._id}`,
  //         formData
  //       )
  //       .then((response) => {
  //         if (response.status === 200) {
  //           props.handleClose?.();
  //           props.setShowToastSuccess(true);
  //           setTimeout(() => {
  //             props.setShowToastSuccess(false);
  //             props.setForceUpdate((current) => (current += 1));
  //           }, 3000);
  //         }
  //       })
  //       .catch(() => {
  //         props.handleClose?.();
  //         props.setShowToastFail(true);
  //         setTimeout(() => {
  //           props.setShowToastFail(false);
  //           props.setForceUpdate((current) => (current += 1));
  //         }, 3000);
  //       }));
  // }

  // async function handleEditSubmit(e: React.SyntheticEvent) {
  //   e.preventDefault();
  //   const employeeNames = inputEmps?.map((emps: ISelectOptions) => emps.value);
  //   const employeeEmails = inputEmps?.map(
  //     (emps: ISelectOptions) => emps.email
  //   );
  //   const formData: IFormData = {
  //     task: taskName,
  //     adminEmail: activeEmployee.email,
  //     adminRole: activeEmployee.role,
  //     adminName: activeEmployee.name,
  //     deadline: deadline,
  //     employeeNames: employeeNames,
  //     employeeEmails: employeeEmails,
  //     status: "Incomplete",
  //   };
  //   // await handlePostToDB(formData);
  // }

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
        dialogClassName="modal-45w mt-2"
        show={props.showTaskModal}
        onHide={() => {
          props.handleClose?.();
          handleModalEditRevert();
        }}
        onClick={(e: React.SyntheticEvent) => e.stopPropagation()}
      >
        <Form
          key={key}
          className={`transition${editable ? " border-modal" : ""} ${
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
            />
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
                        setKey((key) => (key += 1));
                        props?.activeModalInfo &&
                          setTaskName(props?.activeModalInfo.task);
                        setDefaultModalInfo(props.activeModalInfo);
                        setDeleteConfirm(null);
                        setEditable(false);
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
                        !editable && e.preventDefault();
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
