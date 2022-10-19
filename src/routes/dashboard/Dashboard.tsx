import { useContext, useEffect, useState } from "react";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import Card from "react-bootstrap/Card";
import DashboardNav from "../../components/DashboardNav";
import Loading from "../../components/Loading";
import VerticalNav from "../../components/VerticalNav";
import ViewTaskModal from "../../components/ViewTaskModal";
import { IUserContext, UserContext } from "../../contexts/UserContext";
import { ITasks } from "../tasks/components/TasksTable";
import Charts from "./components/Charts";
import PrioritiesTable from "./components/PrioritiesTable";
import TasksSplitTable from "./components/TasksSplitTable";
import "./Dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Array<ITasks>>([]);
  const [incompleteTasks, setIncompleteTasks] = useState<Array<ITasks>>([]);
  const [pendingTasks, setPendingTasks] = useState<Array<ITasks>>([]);
  const [completeTasks, setCompleteTasks] = useState<Array<ITasks>>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
  const [activeModalInfo, setActiveModalInfo] = useState<ITasks | undefined>(
    undefined
  );

  const [showToastSuccess, setShowToastSuccess] = useState<boolean>(false);
  const [showToastFail, setShowToastFail] = useState<boolean>(false);

  const { activeEmployee } = useContext<IUserContext>(UserContext);

  const handleClose = () => {
    setActiveModalInfo(undefined);
    setShowTaskModal(false);
  };
  const handleShow = () => setShowTaskModal(true);

  useEffect(() => {
    setLoading(true);
    window.location.pathname === "/admindashboard" &&
      fetch(`${process.env.REACT_APP_BACKEND_BASE}/getalltasks`)
        .then((Response) => Response.json())
        .then((tasks) => {
          setTasks(tasks);
          if (tasks.length === 0) setLoading(false);
        });
    window.location.pathname === "/dashboard" &&
      fetch(
        `${process.env.REACT_APP_BACKEND_BASE}/getusertasks/${activeEmployee.name}`
      )
        .then((Response) => Response.json())
        .then((tasks) => {
          setTasks(tasks);
          if (tasks.length === 0) setLoading(false);
        });
    return (() => {
      setTasks([]);
      setIncompleteTasks([]);
      setPendingTasks([]);
      setCompleteTasks([]);
    })
  }, [forceUpdate]);

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

  return (
    <>
      <VerticalNav />

      <div className="d-grid grid-dashboard">
        <DashboardNav />

        <div className="ms-3 me-2 mt-2 mb-2 rounded-3 grid-area-area1">
          <table className="table table-hover rounded-3 table-border-collapse">
            <thead>
              <tr className="row-header-thick">
                <th scope="col" className="width-30rem">
                  Incomplete tasks
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
                <tr className="height-195">
                  <td colSpan={4} className="fs-3 text-center no-hover">
                    No tasks found
                  </td>
                </tr>
              ) : (
                <PrioritiesTable
                  incompleteTasks={incompleteTasks}
                  handleShow={handleShow}
                  setActiveModalInfo={setActiveModalInfo}
                />
              )}
            </tbody>
          </table>
        </div>

        <Card className="me-3 ms-1 my-2 grid-area-area2">
          <Card.Body>
            <h5 className="text-center mb-0">Tasks</h5>
            {loading && (
              <div className="d-flex justify-content-center align-items-center height-295">
                <div className="fs-5">
                  <Loading />
                </div>
              </div>
            )}
            {tasks.length === 0 && !loading ? (
              <div className="d-flex justify-content-center align-items-center height-195">
                <div className="d-flex justify-content-center align-items-center h-50">
                  <h4>No tasks found</h4>
                </div>
              </div>
            ) : (
              tasks.length > 0 &&
              !loading && (
                <div className="chart-container p-relative w-100">
                  <Charts
                    incompleteTasks={incompleteTasks}
                    pendingTasks={pendingTasks}
                    completeTasks={completeTasks}
                  />
                </div>
              )
            )}
          </Card.Body>
        </Card>

        <div className="mx-3 my-2 grid-area-area3">
          <TasksSplitTable
            loading={loading}
            incompleteTasks={incompleteTasks}
            handleShow={handleShow}
            setActiveModalInfo={setActiveModalInfo}
          />
        </div>
      </div>

      <ViewTaskModal
        activeModalInfo={activeModalInfo}
        showTaskModal={showTaskModal}
        handleClose={handleClose}
        setShowToastSuccess={setShowToastSuccess}
        setShowToastFail={setShowToastFail}
        setForceUpdate={setForceUpdate}
      />
      <ToastContainer position="top-end">
        <Toast
          className="mt-2 me-3"
          bg="info"
          show={showToastSuccess}
          animation
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>Operation was successful</Toast.Body>
        </Toast>
        <Toast className="mt-2 me-3" bg="danger" show={showToastFail} animation>
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Failure</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Operation failed</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
