import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Stack from "react-bootstrap/Stack";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
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
  const [checkedBox, setCheckedBox] = useState<Array<string>>([]);
  const [forceUpdate, setForceUpdate] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [allTasksView, setAllTasksView] = useState<boolean>(true);
  const [incompleteShow, setincompleteShow] = useState<string>("");
  const [pendingShow, setPendingShow] = useState<string>("");
  const [completeShow, setCompleteShow] = useState<string>("");

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
    };
  }, [forceUpdate, allTasksView]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLButtonElement>) {
    const submitter = (e.target as HTMLButtonElement).value;
    checkedBox.length > 0 &&
      (await axios
        .post(
          `${process.env.REACT_APP_BACKEND_BASE}/update${submitter}tasks`,
          checkedBox
        )
        .then((response) => {
          if (response.status === 200) {
            setForceUpdate((current) => (current += 1));
          }
        })
        .catch(() => {
          /**/
        }));
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
                  variant="outline-info"
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
                  variant="outline-info"
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
                  variant="outline-info"
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
                  variant="outline-info"
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
            setCheckedBox={setCheckedBox}
            loading={loading}
            setLoading={setLoading}
            incompleteShow={incompleteShow}
            pendingShow={pendingShow}
            completeShow={completeShow}
          />
        </div>

        <div className="grid-area-buttons">
          <Card className="mt-3 mb-2 mx-3">
            <Card.Body className="d-flex justify-content-end align-items-center">
              {activeEmployee.role === "User" ? (
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-disabled">
                      You don&apos;t have the required privileges
                    </Tooltip>
                  }
                >
                  <span className="d-inline-block">
                    <Button
                      type="button"
                      name="submit"
                      value="delete"
                      variant="outline-info"
                      size="lg"
                      className="text-center"
                      disabled
                    >
                      Delete task(s)
                    </Button>
                  </span>
                </OverlayTrigger>
              ) : (
                <Button
                  type="button"
                  name="submit"
                  value="delete"
                  variant="outline-info"
                  size="lg"
                  className="text-center"
                  onClick={handleSubmit}
                >
                  Delete task(s)
                </Button>
              )}
              {activeEmployee.role === "User" ? (
                <span className="d-inline-block">
                  <Button
                    type="button"
                    name="submit"
                    value="pending"
                    onClick={handleSubmit}
                    variant="info"
                    size="lg"
                    className="ms-5 text-center"
                  >
                    Submit for approval
                  </Button>
                </span>
              ) : (
                <Button
                  type="button"
                  name="submit"
                  value="complete"
                  variant="info"
                  size="lg"
                  className="ms-5 text-center"
                  onClick={handleSubmit}
                >
                  Approve as completed
                </Button>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}
