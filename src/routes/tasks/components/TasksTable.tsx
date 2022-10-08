import { useContext, useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import { ViewTaskModal } from "../../../components/ViewTaskModal";
import { IUserContext, UserContext } from "../../../contexts/UserContext";
import "./TasksTable.css";

export interface ITasks {
  adminEmail: string;
  adminName: string;
  deadline: Date;
  employeeEmails: Array<string>;
  employeeNames: Array<string>;
  startDate: Date;
  status: string;
  task: string;
  _id: string;
  priority: number;
}

export default function TasksTable(props: {
  tasks: ITasks[];
  searchedTasks: ITasks[];
  setSearchedTasks: React.Dispatch<React.SetStateAction<Array<ITasks>>>;
  forceUpdate: number;
  setForceUpdate: React.Dispatch<React.SetStateAction<number>>;
  setCheckedBox: React.Dispatch<React.SetStateAction<Array<string>>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  incompleteShow: string;
  pendingShow: string;
  completeShow: string;
}): JSX.Element {
  const [incompleteTasks, setIncompleteTasks] = useState<Array<ITasks>>([]);
  const [pendingTasks, setPendingTasks] = useState<Array<ITasks>>([]);
  const [completeTasks, setCompleteTasks] = useState<Array<ITasks>>([]);

  const [showTaskModal, setShowTaskModal] = useState(false);

  const handleClose = () => setShowTaskModal(!showTaskModal);
  const handleShow = () => setShowTaskModal(!showTaskModal);

  const { activeEmployee } = useContext<IUserContext>(UserContext);

  useEffect(() => {
    return () => {
      props.setSearchedTasks([]);
    };
  }, []);

  useEffect(() => {
    setIncompleteTasks([]);
    setPendingTasks([]);
    setCompleteTasks([]);
  }, [props.forceUpdate, props.searchedTasks]);

  useEffect(() => {
    props.searchedTasks.length > 0 &&
      props.searchedTasks.forEach((task: ITasks) => {
        props.setLoading(false);
        switch (true) {
          case task.status === "Incomplete":
            setIncompleteTasks((current) => [...current, task]);
            break;

          case task.status === "Pending":
            setPendingTasks((current) => [...current, task]);
            break;

          case task.status === "Complete":
            setCompleteTasks((current) => [...current, task]);
            break;
        }
      });
  }, [props.tasks, props.searchedTasks]);

  function checkboxOnChange(
    setChecked: React.Dispatch<React.SetStateAction<Array<string>>>
  ) {
    return (e: React.SyntheticEvent) =>
      setChecked((current) =>
        (e.target as HTMLFormElement).checked
          ? [...current, (e.target as HTMLFormElement).value]
          : current.filter(function (value) {
              return value === (e.target as HTMLFormElement).value;
            })
      );
  }

  return (
    <table className="table table-hover rounded-start table-border-collapse custom-table">
      <tbody>
        {props.loading && (
          <tr>
            <td colSpan={4} className="fs-3 text-center no-hover">
              <Loading />
            </td>
          </tr>
        )}
        {props.tasks.length === 0 && !props.loading && (
          <tr>
            <td colSpan={4} className="fs-3 text-center no-hover">
              No tasks found
            </td>
          </tr>
        )}
        {props.tasks.length > 0 &&
          !props.loading &&
          props.searchedTasks.length === 0 && (
            <tr>
              <td colSpan={4} className="fs-3 text-center no-hover">
                No tasks found matching your search
              </td>
            </tr>
          )}
        {incompleteTasks.length > 0 && (
          <tr className={`row-header-thick ${props.incompleteShow}`}>
            <th scope="col" className="width-35">
              <span className="dot-gray me-2 align-center" />
              Incomplete
            </th>
            <th scope="col" className="text-center">
              Issued by
            </th>
            <th scope="col" className="text-center">
              Issued to
            </th>
            <th scope="col" className="text-center">
              Issued on 
              {/* TODO: add sorting
              &#8681; Arrow down
              &#8679; Arrow up */}
            </th>
            <th scope="col" className="text-center">
              Deadline
            </th>
          </tr>
        )}
        {incompleteTasks.length > 0 &&
          incompleteTasks.map((taskInfo) => {
            const taskStartDate = new Date(taskInfo.startDate);
            const taskDeadline = new Date(taskInfo.deadline);
            const formattedArray = taskInfo.employeeNames.join(", ");
            return (
              <tr
                key={taskInfo._id}
                className={`${props.incompleteShow} pointer`}
                onClick={handleShow}
              >
                <ViewTaskModal taskInfo={taskInfo} showTaskModal={showTaskModal} handleClose={handleClose} />
                <td>
                  <input
                    type="checkbox"
                    className="ms-05 me-25 scale-13"
                    title={taskInfo._id}
                    value={taskInfo._id}
                    onClick={(e) => e.stopPropagation()}
                    onChange={checkboxOnChange(props.setCheckedBox)}
                  />
                  {taskInfo.task}
                </td>
                <td className="text-center">{taskInfo.adminName}</td>
                <td className="text-center">{formattedArray}</td>
                <td className="text-center">{taskStartDate.toDateString()}</td>
                <td className="text-center">{taskDeadline.toDateString()}</td>
              </tr>
            );
          })}
        {pendingTasks.length > 0 && (
          <tr className={`row-header-thick ${props.pendingShow}`}>
            <th scope="col" className="width-35">
              <span className="dot-yellow align-center" />
              Pending approval
            </th>
            <th scope="col" className="text-center">
              Issued by
            </th>
            <th scope="col" className="text-center">
              Issued to
            </th>
            <th scope="col" className="text-center">
              Issued on
            </th>
            <th scope="col" className="text-center">
              Deadline
            </th>
          </tr>
        )}
        {pendingTasks.length > 0 &&
          pendingTasks.map((taskInfo) => {
            const taskStartDate = new Date(taskInfo.startDate);
            const taskDeadline = new Date(taskInfo.deadline);
            const formattedArray = taskInfo.employeeNames.join(", ");
            return (
              <tr key={taskInfo._id} className={`${props.pendingShow}`}>
                <td>
                  <input
                    type="checkbox"
                    className="ms-05 me-25 scale-13"
                    title={taskInfo._id}
                    value={taskInfo._id}
                    onClick={(e) => e.stopPropagation()}
                    onChange={checkboxOnChange(props.setCheckedBox)}
                    disabled={activeEmployee.role === "User" ? true : false}
                  />
                  {taskInfo.task}
                </td>
                <td className="text-center">{taskInfo.adminName}</td>
                <td className="text-center">{formattedArray}</td>
                <td className="text-center">{taskStartDate.toDateString()}</td>
                <td className="text-center">{taskDeadline.toDateString()}</td>
              </tr>
            );
          })}
        {completeTasks.length > 0 && (
          <tr className={`row-header-thick ${props.completeShow}`}>
            <th scope="col" className="width-35">
              <span className="dot-green align-center" />
              Completed
            </th>
            <th scope="col" className="text-center">
              Issued by
            </th>
            <th scope="col" className="text-center">
              Issued to
            </th>
            <th scope="col" className="text-center">
              Issued on
            </th>
            <th scope="col" className="text-center">
              Deadline
            </th>
          </tr>
        )}
        {completeTasks.length > 0 &&
          completeTasks.map((taskInfo) => {
            const taskStartDate = new Date(taskInfo.startDate);
            const taskDeadline = new Date(taskInfo.deadline);
            const formattedArray = taskInfo.employeeNames.join(", ");

            return (
              <tr key={taskInfo._id} className={`${props.completeShow}`}>
                <td>
                  <input
                    type="checkbox"
                    className="ms-05 me-25 scale-13"
                    title={taskInfo._id}
                    value={taskInfo._id}
                    onClick={(e) => e.stopPropagation()}
                    onChange={checkboxOnChange(props.setCheckedBox)}
                    disabled={activeEmployee.role === "User" ? true : false}
                  />
                  {taskInfo.task}
                </td>
                <td className="text-center">{taskInfo.adminName}</td>
                <td className="text-center">{formattedArray}</td>
                <td className="text-center">{taskStartDate.toDateString()}</td>
                <td className="text-center">{taskDeadline.toDateString()}</td>
              </tr>
            );
          })}
        {props.tasks.length > 0 &&
          !props.loading &&
          props.searchedTasks.length > 0 && <tr></tr>}
      </tbody>
    </table>
  );
}
