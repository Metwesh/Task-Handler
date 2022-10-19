import React from "react";
import "../../../components/Rating.css";
import { ITasks } from "../../tasks/components/TasksTable";
import "./PrioritiesTable.css";

export default function PrioritiesTable(props: {
  incompleteTasks: Array<ITasks>;
  handleShow: (() => void) | undefined;
  setActiveModalInfo: React.Dispatch<React.SetStateAction<ITasks | undefined>>;
}) {
  function compareDate(date: Date) {
    const differenceInTime = date.getTime() - new Date().getTime();
    // To calculate the no. of days between two dates
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays;
  }

  props.incompleteTasks.length > 0 &&
    props.incompleteTasks.forEach((taskInfo) => {
      const taskDeadline = new Date(taskInfo.deadline);
      if (compareDate(taskDeadline) > 7) return (taskInfo.priority = 5);
      else if (compareDate(taskDeadline) > 5 && compareDate(taskDeadline) < 7)
        return (taskInfo.priority = 4);
      else if (compareDate(taskDeadline) > 3 && compareDate(taskDeadline) < 5)
        return (taskInfo.priority = 3);
      else if (compareDate(taskDeadline) > 0 && compareDate(taskDeadline) < 3)
        return (taskInfo.priority = 2);
      else if (compareDate(taskDeadline) <= 0) return (taskInfo.priority = 1);
    });

  props.incompleteTasks.sort((a, b) => b?.priority - a?.priority);

  return (
    <>
      {props.incompleteTasks.length > 0 &&
        props.incompleteTasks.map((taskInfo) => {
          const taskDeadline = new Date(taskInfo.deadline);
          return (
            <tr
              key={taskInfo._id}
              className="pointer"
              onClick={() => {
                props.handleShow?.();
                props.setActiveModalInfo(taskInfo);
              }}
            >
              <td>{taskInfo.task}</td>
              <td className="text-center">{taskDeadline.toDateString()}</td>
              {taskInfo.priority === 1 ? (
                <td
                  className="text-center"
                  title="Priority level 1: Today or past due"
                >
                  <span
                    className="dot five-star"
                    title="Priority level 1: Today or past due"
                  ></span>
                  <span
                    className="dot five-star"
                    title="Priority level 1: Today or past due"
                  ></span>
                  <span
                    className="dot five-star"
                    title="Priority level 1: Today or past due"
                  ></span>
                  <span
                    className="dot five-star"
                    title="Priority level 1: Today or past due"
                  ></span>
                  <span
                    className="dot five-star"
                    title="Priority level 1: Today or past due"
                  ></span>
                </td>
              ) : taskInfo.priority === 2 ? (
                <td
                  className="text-center"
                  title="Priority level 2: Less than 3 days left"
                >
                  <span
                    className="dot four-star"
                    title="Priority level 2: Less than 3 days left"
                  ></span>
                  <span
                    className="dot four-star"
                    title="Priority level 2: Less than 3 days left"
                  ></span>
                  <span
                    className="dot four-star"
                    title="Priority level 2: Less than 3 days left"
                  ></span>
                  <span
                    className="dot four-star"
                    title="Priority level 2: Less than 3 days left"
                  ></span>
                  <span
                    className="dot"
                    title="Priority level 2: Less than 3 days left"
                  ></span>
                </td>
              ) : taskInfo.priority === 3 ? (
                <td
                  className="text-center"
                  title="Priority level 3: Less than 5 days left"
                >
                  <span
                    className="dot three-star"
                    title="Priority level 3: Less than 5 days leftPriority 3: Less than 5 days left"
                  ></span>
                  <span
                    className="dot three-star"
                    title="Priority level 3: Less than 5 days left"
                  ></span>
                  <span
                    className="dot three-star"
                    title="Priority level 3: Less than 5 days left"
                  ></span>
                  <span
                    className="dot"
                    title="Priority level 3: Less than 5 days left"
                  ></span>
                  <span
                    className="dot"
                    title="Priority level 3: Less than 5 days left"
                  ></span>
                </td>
              ) : taskInfo.priority === 4 ? (
                <td
                  className="text-center"
                  title="Priority level 4: More than 5 days left"
                >
                  <span
                    className="dot two-star"
                    title="Priority level 4: More than 5 days left"
                  ></span>
                  <span
                    className="dot two-star"
                    title="Priority level 4: More than 5 left"
                  ></span>
                  <span
                    className="dot"
                    title="Priority level 4: More than 5 days left"
                  ></span>
                  <span
                    className="dot"
                    title="Priority level 4: More than 5 left"
                  ></span>
                  <span
                    className="dot"
                    title="Priority level 4: More than 5 left"
                  ></span>
                </td>
              ) : (
                <td
                  className="text-center"
                  title="Priority level 5: More than 7 days left"
                >
                  <span
                    className="dot one-star"
                    title="Priority level 5: More than 7 days left"
                  ></span>
                  <span
                    className="dot"
                    title="Priority level 5: More than 7 days left"
                  ></span>
                  <span
                    className="dot"
                    title="Priority level 5: More than 7 days left"
                  ></span>
                  <span
                    className="dot"
                    title="Priority level 5: More than 7 days left"
                  ></span>
                  <span
                    className="dot"
                    title="Priority level 5: More than 7 days left"
                  ></span>
                </td>
              )}
            </tr>
          );
        })}
    </>
  );
}
