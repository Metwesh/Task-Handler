import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ITasks } from "../routes/tasks/components/TasksTable";
import "./ViewTaskModal.css";

export function ViewTaskModal(props: {
  taskInfo: ITasks
  showTaskModal: boolean | undefined;
  handleClose: (() => void) | undefined;
}): JSX.Element {
  return (
    <Modal
      show={props.showTaskModal}
      onHide={props.handleClose}
      onClick={(e: React.SyntheticEvent) => e.stopPropagation()}>
      <Modal.Header closeButton>
        <Modal.Title>{props.taskInfo.task}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {/* 
      adminEmail: "m_1234@gmail.com"
      adminName: "Mohamed"
      deadline: "2022-10-20T01:11:42.000Z"
      employeeEmails: ['shady@gmail.com']
      employeeNames: ['Shady']
      startDate: "2022-10-08T09:42:21.036Z"
      status: "Incomplete"
      task: "Merge temp pull request"
      _id: "634145fd90c592a3e887b1ca" 
      */}
        <p>Task ID:</p>
      <p>{props.taskInfo._id}</p>
      <p>Task name:</p>
      <p>{props.taskInfo.task}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="info" onClick={props.handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
