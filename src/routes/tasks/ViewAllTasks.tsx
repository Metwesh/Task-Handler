import axios from "axios";
import { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import VerticalNav from "../../components/VerticalNav";
import DashboardNav from "../../components/DashboardNav";
import AllTasksTable from "./components/AllTasksTable";
import "./ViewTasks.css";
import { IUserContext, UserContext } from "../../contexts/UserContext";

export default function ViewTasks(): JSX.Element {
  const [checkedBox, setCheckedBox] = useState<Array<string>>([]);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const { activeEmployee } = useContext<IUserContext>(UserContext);

  async function handleSubmit(e: React.SyntheticEvent) {
    const submitter: string = (e.nativeEvent as any).submitter.value;

    e.preventDefault();
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
        .catch((error) => {
          console.log(error);
        }));
  }

  return (
    <>
      <VerticalNav />
      <form onSubmit={handleSubmit}>
        <div className="d-grid custom-grid">
          <DashboardNav />
          <div className="ms-3 me-3 mt-2 rounded-3 tasks-grid-area">
            <AllTasksTable
              forceUpdate={forceUpdate}
              setCheckedBox={setCheckedBox}
            />
          </div>

          <div className="grid-area-buttons">
            <Card className="mt-3 mb-2 mx-3">
              <Card.Body className="d-flex justify-content-end align-items-center">
                {activeEmployee.role === "User" ? (
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        You don't have the required privileges
                      </Tooltip>
                    }>
                    <span className="d-inline-block">
                      <Button
                        type="submit"
                        name="submit"
                        value="delete"
                        variant="outline-info"
                        size="lg"
                        className="text-center font-main-color"
                        disabled>
                        Delete task(s)
                      </Button>
                    </span>
                  </OverlayTrigger>
                ) : (
                  <Button
                    type="submit"
                    name="submit"
                    value="delete"
                    variant="outline-info"
                    size="lg"
                    className="text-center font-main-color">
                    Delete task(s)
                  </Button>
                )}
                {activeEmployee.role === "User" ? (
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        You don't have the required privileges
                      </Tooltip>
                    }>
                    <span className="d-inline-block">
                      <Button
                        type="submit"
                        name="submit"
                        value="complete"
                        variant="info"
                        size="lg"
                        className="ms-5 text-center font-main-color"
                        disabled>
                        Mark as completed
                      </Button>
                    </span>
                  </OverlayTrigger>
                ) : (
                  <Button
                    type="submit"
                    name="submit"
                    value="complete"
                    variant="info"
                    size="lg"
                    className="ms-5 text-center font-main-color">
                    Mark as completed
                  </Button>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </form>
    </>
  );
}
