import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Stack from "react-bootstrap/Stack";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Tooltip from "react-bootstrap/Tooltip";
import DashboardNav from "../../components/DashboardNav";
import VerticalNav from "../../components/VerticalNav";
import { IUserContext, UserContext } from "../../contexts/UserContext";
import SearchBox from "./components/SearchBox";
import TasksTable, { ITasks } from "./components/TasksTable";
import "./ViewTasks.css";

export default function ViewTasks(): JSX.Element {
  const [tasks, setTasks] = useState<Array<ITasks>>([]);
  const [searchedTasks, setSearchedTasks] = useState<Array<ITasks>>([]);
  const [checkboxes, setCheckboxes] = useState<Array<string>>([]);
  const [checkboxError, setCheckboxError] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [allTasksView, setAllTasksView] = useState<boolean>(true);
  const [incompleteShow, setincompleteShow] = useState<string>("");
  const [pendingShow, setPendingShow] = useState<string>("");
  const [completeShow, setCompleteShow] = useState<string>("");

  const [showToastSuccess, setShowToastSuccess] = useState<boolean>(false);
  const [showToastFail, setShowToastFail] = useState<boolean>(false);

  const { activeEmployee } = useContext<IUserContext>(UserContext);

  useEffect(() => {
    setSearchedTasks([]);
    setLoading(true);
    allTasksView
      ? fetch(`${process.env.REACT_APP_BACKEND_BASE}/getalltasks`)
          .then((Response) => Response.json())
          .then((tasks) => {
            setTasks(tasks);
            setSearchedTasks(tasks);
            if (tasks.length === 0) setLoading(false);
          })
      : fetch(
          `${process.env.REACT_APP_BACKEND_BASE}/getusertasks/${activeEmployee.name}`
        )
          .then((Response) => Response.json())
          .then((tasks) => {
            setTasks(tasks);
            setSearchedTasks(tasks);
            if (tasks.length === 0) setLoading(false);
          });
    return () => {
      setSearchedTasks([]);
      setCheckboxes([]);
    };
  }, [forceUpdate, allTasksView]);

  function validateCheckbox() {
    if (checkboxes.length === 0) {
      setCheckboxError(true);
      setTimeout(() => setCheckboxError(false), 6000);
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLButtonElement>) {
    const submitter = (e.target as HTMLButtonElement).value;

    validateCheckbox();
    if (!validateCheckbox()) return false;

    await handlePostToDB(submitter);
  }

  async function handlePostToDB(submitter: string) {
    await axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE}/update${submitter}tasks`,
        checkboxes
      )
      .then((response) => {
        if (response.status === 200) {
          setShowToastSuccess(true);
          setTimeout(() => {
            setShowToastSuccess(false);
            setForceUpdate((current) => (current += 1));
          }, 3000);
        }
      })
      .catch(() => {
        setShowToastFail(true);
        setTimeout(() => setShowToastFail(false), 3000);
      });
  }

  return (
    <>
      <VerticalNav />
      <div className="d-grid custom-grid">
        <DashboardNav />

        <Card className="grid-area-search mt-2 mx-3">
          <Stack
            direction="horizontal"
            className="d-flex justify-content-between align-items-center"
          >
            <Card.Body className="task-tab-group tiny-negative-margin-top">
              <Tabs
                defaultActiveKey="view-all-tasks"
                onSelect={(key) => {
                  key === "view-all-tasks"
                    ? setAllTasksView(true)
                    : setAllTasksView(false);
                  setTasks([]);
                  setSearchedTasks([]);
                }}
              >
                <Tab
                  eventKey="view-your-tasks"
                  title="View Your tasks"
                  className="tab-focus"
                />
                <Tab
                  eventKey="view-all-tasks"
                  title="View all tasks"
                  className="tab-focus"
                />
              </Tabs>
            </Card.Body>

            <Card.Body className="filter-radio-group">
              <ToggleButtonGroup type="radio" name="filter" defaultValue={1}>
                <ToggleButton
                  id="tbg-radio-1"
                  variant="outline-info color-in"
                  onClick={() => {
                    setincompleteShow("");
                    setPendingShow("");
                    setCompleteShow("");
                  }}
                  value={1}
                >
                  All
                </ToggleButton>
                <ToggleButton
                  id="tbg-radio-2"
                  variant="outline-info color-in"
                  onClick={() => {
                    setincompleteShow("");
                    setPendingShow("hide");
                    setCompleteShow("hide");
                  }}
                  value={2}
                >
                  Incomplete
                </ToggleButton>
                <ToggleButton
                  id="tbg-radio-3"
                  variant="outline-info color-in"
                  onClick={() => {
                    setincompleteShow("hide");
                    setPendingShow("");
                    setCompleteShow("hide");
                  }}
                  value={3}
                >
                  Pending
                </ToggleButton>
                <ToggleButton
                  id="tbg-radio-4"
                  variant="outline-info color-in"
                  onClick={() => {
                    setincompleteShow("hide");
                    setPendingShow("hide");
                    setCompleteShow("");
                  }}
                  value={4}
                >
                  Complete
                </ToggleButton>
              </ToggleButtonGroup>
            </Card.Body>

            <Card.Body className="search-box">
              <SearchBox
                tasks={tasks}
                setTasks={setTasks}
                searchedTasks={searchedTasks}
                setSearchedTasks={setSearchedTasks}
              />
            </Card.Body>
          </Stack>
        </Card>

        <div className="ms-3 me-3 mt-2 rounded-3 tasks-grid-area">
          <TasksTable
            tasks={tasks}
            searchedTasks={searchedTasks}
            setSearchedTasks={setSearchedTasks}
            forceUpdate={forceUpdate}
            setForceUpdate={setForceUpdate}
            checkboxes={checkboxes}
            setCheckboxes={setCheckboxes}
            checkboxError={checkboxError}
            setCheckboxError={setCheckboxError}
            loading={loading}
            setLoading={setLoading}
            incompleteShow={incompleteShow}
            pendingShow={pendingShow}
            completeShow={completeShow}
            setShowToastSuccess={setShowToastSuccess}
            setShowToastFail={setShowToastFail}
          />
        </div>

        <div className="grid-area-buttons">
          <Card className="mt-3 mb-2 mx-3">
            <Card.Body className="d-flex justify-content-end align-items-center">
              {activeEmployee.role === "User" ? (
                <>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        You don&apos;t have the required privileges
                      </Tooltip>
                    }
                  >
                    <span className="d-inline-block cursor-disabled">
                      <Button
                        type="button"
                        name="submit"
                        value="delete"
                        variant="outline-danger"
                        size="lg"
                        className="text-center"
                        disabled
                      >
                        Delete task(s)
                      </Button>
                    </span>
                  </OverlayTrigger>
                  <span className="d-inline-block">
                    <Button
                      type="button"
                      name="submit"
                      value="pending"
                      onClick={handleSubmit}
                      variant="outline-info"
                      size="lg"
                      className="ms-5 text-center"
                    >
                      Submit for approval
                    </Button>
                  </span>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    name="submit"
                    value="delete"
                    variant="outline-danger"
                    size="lg"
                    className="text-center"
                    onClick={handleSubmit}
                  >
                    Delete task(s)
                  </Button>
                  <Button
                    type="button"
                    name="submit"
                    value="complete"
                    variant="outline-info"
                    size="lg"
                    className="ms-5 text-center"
                    onClick={handleSubmit}
                  >
                    Approve task(s)
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
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

      <ToastContainer position="top-start" className="toast-margin-left mt-2">
        <Toast
          className="mt-5 ms-3 me-3"
          bg="danger"
          show={checkboxError}
          animation
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Failure</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Please select at least one of the checkboxes
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
