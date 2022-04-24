import { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Charts from "./components/Charts";
import TasksSplitTable from "./components/TasksSplitTable";
import PrioritiesTable from "./components/PrioritiesTable";
import DashboardNav from "../../components/DashboardNav";
import VerticalNav from "../../components/VerticalNav";
import "./Dashboard.css";
import { ITasks } from "../tasks/components/TasksTable";
import { IUserContext, UserContext } from "../../contexts/UserContext";
import Loading from "../../components/Loading";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Array<ITasks>>([]);
  const [incompleteTasks, setIncompleteTasks] = useState<Array<ITasks>>([]);
  const [pendingTasks, setPendingTasks] = useState<Array<ITasks>>([]);
  const [completeTasks, setCompleteTasks] = useState<Array<ITasks>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { activeEmployee } = useContext<IUserContext>(UserContext);

  useEffect(() => {
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_BACKEND_BASE}/getusertasks/${activeEmployee.name}`
    )
      .then((Response) => Response.json())
      .then((tasks) => setTasks(tasks));
  }, [activeEmployee.name]);

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

  function stateTimeout() {
    if (tasks.length === 0) setLoading(false);
  }
  setTimeout(stateTimeout, 3000);

  return (
    <>
      <VerticalNav />

      <div className="d-grid grid-dashboard">
        <DashboardNav />

        <div className="ms-3 me-2 mt-2 mb-2 rounded-3 grid-area-area1">
          <table className="table table-hover rounded-3 table-border-collapse">
            <thead>
              <tr className="row-header-thick">
                <th scope="col" className="width-35rem">
                  Priorities
                </th>
                <th scope="col" className="text-center">
                  Deadline
                </th>
                <th scope="col" className="text-center">
                  Priority level
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="height-300">
                  <td colSpan={4} className="fs-5 text-center no-hover">
                    <Loading />
                  </td>
                </tr>
              )}

              {incompleteTasks.length === 0 && !loading ? (
                <tr className="height-300">
                  <td colSpan={4} className="fs-3 text-center no-hover">
                    No tasks found
                  </td>
                </tr>
              ) : (
                <PrioritiesTable incompleteTasks={incompleteTasks} />
              )}
            </tbody>
          </table>
        </div>

        <Card className="me-3 ms-1 my-2 grid-area-area2">
          <Card.Body>
            <h3 className="text-center">Tasks</h3>
            <div className="d-flex justify-content-center align-items-center height-295">
              {loading && (
                <div className="fs-5">
                  <Loading />
                </div>
              )}
              {tasks.length === 0 && !loading ? (
                <h4>No tasks found</h4>
              ) : (
                tasks.length > 0 &&
                !loading && (
                  <Charts
                    incompleteTasks={incompleteTasks}
                    pendingTasks={pendingTasks}
                    completeTasks={completeTasks}
                  />
                )
              )}
            </div>
          </Card.Body>
        </Card>

        <div className="mx-3 my-2 grid-area-area3">
          <TasksSplitTable
            loading={loading}
            incompleteTasks={incompleteTasks}
          />
        </div>
      </div>
    </>
  );
}
