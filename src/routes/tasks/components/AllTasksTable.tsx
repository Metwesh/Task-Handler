import { useEffect, useState, useContext } from "react";
import Loading from "../../../components/Loading";
import "./TasksTable.css";
import { BACKEND_BASE } from "../../../config";
import { ITasks } from "./TasksTable";
import { IUserContext, UserContext } from "../../../contexts/UserContext";

export default function TasksTable(props: {
  forceUpdate: number;
  setCheckedBox: React.Dispatch<React.SetStateAction<Array<string>>>;
}): JSX.Element {
  const [tasks, setTasks] = useState<Array<ITasks>>([]);
  const [incompleteTasks, setIncompleteTasks] = useState<Array<ITasks>>([]);
  const [pendingTasks, setPendingTasks] = useState<Array<ITasks>>([]);
  const [completeTasks, setCompleteTasks] = useState<Array<ITasks>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { activeEmployee } = useContext<IUserContext>(UserContext);

  useEffect(() => {
    setLoading(true);
    setIncompleteTasks([]);
    setPendingTasks([]);
    setCompleteTasks([]);
    fetch(`${BACKEND_BASE}/getalltasks`)
      .then((Response) => Response.json())
      .then((tasks) => setTasks(tasks));
  }, [props.forceUpdate]);

  function stateTimeout() {
    if (tasks.length === 0) setLoading(false);
  }
  setTimeout(stateTimeout, 3000);

  useEffect(() => {
    tasks.length > 0 &&
      tasks.forEach((task) => {
        setLoading(false);
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
  }, [tasks]);

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
      <thead>
        <tr className="row-header">
          <th className="fs-3" colSpan={4}>
            Tasks
          </th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={4} className="fs-3 text-center no-hover">
              <Loading />
            </td>
          </tr>
        ) : null}
        {tasks.length === 0 && !loading && (
          <tr>
            <td colSpan={4} className="fs-3 text-center no-hover">
              No tasks found
            </td>
          </tr>
        )}
        {incompleteTasks.length > 0 && (
          <tr className="row-header-thick">
            <th className="width-40" scope="col">
              <span className="dot-gray me-2 align-center"></span>Incomplete
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
        {incompleteTasks.length > 0 &&
          incompleteTasks.map((taskInfo) => {
            const taskStartDate = new Date(taskInfo.startDate);
            const taskDeadline = new Date(taskInfo.deadline);
            const formattedArray = String(taskInfo.employeeNames);
            return (
              <tr key={taskInfo._id}>
                <td>
                  <input
                    type="checkbox"
                    title={taskInfo._id}
                    value={taskInfo._id}
                    className="ms-05 me-25 scale-13"
                    onChange={checkboxOnChange(props.setCheckedBox)}
                    disabled={activeEmployee.role === "User" ? true : false}
                  />

                  {taskInfo.task}
                </td>
                <td className="text-center">{formattedArray}</td>
                <td className="text-center">{taskStartDate.toDateString()}</td>
                <td className="text-center">{taskDeadline.toDateString()}</td>
              </tr>
            );
          })}
        {pendingTasks.length > 0 && (
          <tr className="row-header-thick">
            <th scope="col" className="width-40">
              <span className="dot-yellow align-center"></span>Pending approval
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
            const formattedArray = String(taskInfo.employeeNames);
            return (
              <tr key={taskInfo._id}>
                <td>
                  <input
                    type="checkbox"
                    title={taskInfo._id}
                    value={taskInfo._id}
                    className="ms-05 me-25 scale-13"
                    onChange={checkboxOnChange(props.setCheckedBox)}
                    disabled={activeEmployee.role === "User" ? true : false}
                  />
                  {taskInfo.task}
                </td>
                <td className="text-center">{formattedArray}</td>
                <td className="text-center">{taskStartDate.toDateString()}</td>
                <td className="text-center">{taskDeadline.toDateString()}</td>
              </tr>
            );
          })}
        {completeTasks.length > 0 && (
          <tr className="row-header-thick">
            <th scope="col" className="width-40">
              <span className="dot-green align-center"></span>
              Completed
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
            const formattedArray = String(taskInfo.employeeNames);

            return (
              <tr key={taskInfo._id}>
                <td>
                  <input
                    type="checkbox"
                    title={taskInfo._id}
                    value={taskInfo._id}
                    className="ms-05 me-25 scale-13"
                    onChange={checkboxOnChange(props.setCheckedBox)}
                    disabled={activeEmployee.role === "User" ? true : false}
                  />
                  {taskInfo.task}
                </td>
                <td className="text-center">{formattedArray}</td>
                <td className="text-center">{taskStartDate.toDateString()}</td>
                <td className="text-center">{taskDeadline.toDateString()}</td>
              </tr>
            );
          })}
        {tasks.length > 0 && !loading && <tr></tr>}
      </tbody>
    </table>
  );
}
