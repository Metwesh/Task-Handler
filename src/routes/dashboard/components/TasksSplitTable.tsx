import { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import Loading from "../../../components/Loading";
import "../../../components/Rating.css";
import { ITasks } from "../../tasks/components/TasksTable";
import "./TasksSplitTable.css";

export default function TasksSplitTable(props: {
  loading: boolean;
  incompleteTasks: Array<ITasks>;
}): JSX.Element {
  function compareDate(date: Date) {
    const differenceInTime = date.getTime() - new Date().getTime();

    // To calculate the no. of days between two dates
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays;
  }

  const [priorityZeroTasks, setPriorityZeroTasks] = useState<
    Array<ITasks | undefined>
  >([]);
  const [priorityOneTasks, setPriorityOneTasks] = useState<
    Array<ITasks | undefined>
  >([]);
  const [priorityTwoTasks, setPriorityTwoTasks] = useState<
    Array<ITasks | undefined>
  >([]);
  const [priorityThreeTasks, setPriorityThreeTasks] = useState<
    Array<ITasks | undefined>
  >([]);
  const [priorityFourTasks, setPriorityFourTasks] = useState<
    Array<ITasks | undefined>
  >([]);

  useEffect(() => {
    props.incompleteTasks.length > 0 &&
      props.incompleteTasks.forEach((taskInfo) => {
        const taskDeadline = new Date(taskInfo.deadline);
        if (compareDate(taskDeadline) > 7) return (taskInfo.priority = 5);
        else if (
          compareDate(taskDeadline) > 5 &&
          compareDate(taskDeadline) < 7
        ) {
          setPriorityFourTasks((current) => [...current, taskInfo]);
          return (taskInfo.priority = 4);
        } else if (
          compareDate(taskDeadline) > 3 &&
          compareDate(taskDeadline) < 5
        ) {
          setPriorityThreeTasks((current) => [...current, taskInfo]);
          return (taskInfo.priority = 3);
        } else if (compareDate(taskDeadline) > 0) {
          setPriorityTwoTasks((current) => [...current, taskInfo]);
          return (taskInfo.priority = 2);
        } else if (compareDate(taskDeadline) === 0) {
          setPriorityOneTasks((current) => [...current, taskInfo]);
          return (taskInfo.priority = 1);
        } else if (compareDate(taskDeadline) < 0) {
          setPriorityZeroTasks((current) => [...current, taskInfo]);
          return (taskInfo.priority = 0);
        }
      });
  }, [props.loading, props.incompleteTasks]);

  return (
    <div className="d-grid grid-tasks-split">
      {/* Table 1 */}
      <div className="rounded-3 me-3 grid-format grid-area-table1">
        <table
          className="table table-hover rounded-start table-border-collapse"
          id="pastDueTable">
          <thead>
            <tr className="row-header-thick">
              <th scope="col">
                Past due
                {props.loading ? null : (priorityZeroTasks.length === 0 ||
                    props.incompleteTasks.length === 0) &&
                  !props.loading ? (
                  <Badge bg="secondary" className="ms-2">
                    0
                  </Badge>
                ) : (
                  <Badge bg="danger" className="ms-2">
                    {priorityZeroTasks.length}
                  </Badge>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {props.loading && (
              <tr className="height-197">
                <td colSpan={4} className="fs-5 text-center no-hover">
                  <Loading />
                </td>
              </tr>
            )}
            {(priorityZeroTasks.length === 0 ||
              props.incompleteTasks.length === 0) &&
            !props.loading ? (
              <tr>
                <td className="fw-light fst-italic">No tasks past due</td>
              </tr>
            ) : (
              priorityZeroTasks.length > 0 &&
              !props.loading &&
              priorityZeroTasks.map((taskInfo) => {
                if (taskInfo?.priority !== 0) return false;
                else
                  return (
                    <tr key={taskInfo._id} className="warning pointer">
                      <td>{taskInfo.task}</td>
                    </tr>
                  );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Table 2 */}
      <div className="rounded-3 grid-format grid-area-table2">
        <table
          className="table table-hover rounded-start table-border-collapse"
          id="todayTable">
          <thead>
            <tr className="row-header-thick">
              <th scope="col">
                Today
                {props.loading ? null : (priorityOneTasks.length === 0 ||
                    props.incompleteTasks.length === 0) &&
                  !props.loading ? (
                  <Badge bg="secondary" className="ms-2">
                    0
                  </Badge>
                ) : (
                  <Badge bg="warning" className="ms-2">
                    {priorityOneTasks.length}
                  </Badge>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {props.loading && (
              <tr className="height-197">
                <td colSpan={4} className="fs-5 text-center no-hover">
                  <Loading />
                </td>
              </tr>
            )}
            {(priorityTwoTasks.length === 0 ||
              props.incompleteTasks.length === 0) &&
            !props.loading ? (
              <tr>
                <td className="fw-light fst-italic">No tasks for today</td>
              </tr>
            ) : (
              priorityTwoTasks.length > 0 &&
              !props.loading &&
              priorityTwoTasks.map((taskInfo) => {
                if (taskInfo?.priority !== 1) return false;
                else
                  return (
                    <tr key={taskInfo._id} className="pointer">
                      <td>{taskInfo.task}</td>
                    </tr>
                  );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Table 3 */}
      <div className="rounded-3 ms-3 grid-format grid-area-table3">
        <table
          className="table table-hover rounded-start table-border-collapse"
          id="thisWeekTable">
          <thead>
            <tr className="row-header-thick">
              <th scope="col">
                This week
                {props.loading ? null : (priorityTwoTasks.concat(priorityThreeTasks,priorityFourTasks).length === 0 ||
                    props.incompleteTasks.length === 0) &&
                  !props.loading ? (
                  <Badge bg="secondary" className="ms-2">
                    0
                  </Badge>
                ) : (
                  <Badge bg="info" className="ms-2">
                    {
                      priorityTwoTasks.concat(priorityThreeTasks,priorityFourTasks).length
                    }
                  </Badge>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {props.loading && (
              <tr className="height-197">
                <td colSpan={4} className="fs-5 text-center no-hover">
                  <Loading />
                </td>
              </tr>
            )}
            {(props.incompleteTasks.length === 0) ||
              (priorityTwoTasks.length === 0 && priorityThreeTasks.length === 0 && priorityFourTasks.length === 0) &&
            !props.loading ? (
              <tr>
                <td className="fw-light fst-italic">No tasks for this week</td>
              </tr>
            ) : (
              props.incompleteTasks.length > 0 &&
              !props.loading && priorityTwoTasks.concat(priorityThreeTasks,priorityFourTasks).length > 0 &&
                priorityTwoTasks.concat(priorityThreeTasks,priorityFourTasks).map((taskInfo) => {
                  return (
                    <tr key={taskInfo?._id} className="pointer">
                      <td>{taskInfo?.task}</td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
