import "./PrioritiesTable.css";
import "../../../components/Rating.css";
import { ITasks } from "../../tasks/components/TasksTable";

export default function PrioritiesTable(props: {
  incompleteTasks: Array<ITasks>;
}) {
  function compareDate(date: Date) {
    let differenceInTime = date.getTime() - new Date().getTime();

    // To calculate the no. of days between two dates
    let differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays;
  }

  props.incompleteTasks.length > 0 &&
    props.incompleteTasks.forEach((taskInfo) => {
      const taskDeadline = new Date(taskInfo.deadline);
      if (compareDate(taskDeadline) > 7) return (taskInfo.priority = 1);
      else if (compareDate(taskDeadline) > 5 && compareDate(taskDeadline) < 7)
        return (taskInfo.priority = 2);
      else if (compareDate(taskDeadline) > 3 && compareDate(taskDeadline) < 5)
        return (taskInfo.priority = 3);
      else if (compareDate(taskDeadline) > 0) return (taskInfo.priority = 4);
      else if (compareDate(taskDeadline) <= 0) return (taskInfo.priority = 5);
    });
    
  props.incompleteTasks.sort((a, b) => b?.priority - a?.priority);

  return (
    <>
      {props.incompleteTasks.length > 0 &&
        props.incompleteTasks.map((taskInfo) => {
          const taskDeadline = new Date(taskInfo.deadline);
          return (
            <tr key={taskInfo._id}>
              <td>{taskInfo.task}</td>
              <td className="text-center">{taskDeadline.toDateString()}</td>
              {taskInfo.priority === 5 ? (
                <td className="text-center">
                  <span className="dot five-star"></span>
                  <span className="dot five-star"></span>
                  <span className="dot five-star"></span>
                  <span className="dot five-star"></span>
                  <span className="dot five-star"></span>
                </td>
              ) : taskInfo.priority === 4 ? (
                <td className="text-center">
                  <span className="dot four-star"></span>
                  <span className="dot four-star"></span>
                  <span className="dot four-star"></span>
                  <span className="dot four-star"></span>
                  <span className="dot"></span>
                </td>
              ) : taskInfo.priority === 3 ? (
                <td className="text-center">
                  <span className="dot three-star"></span>
                  <span className="dot three-star"></span>
                  <span className="dot three-star"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </td>
              ) : taskInfo.priority === 2 ? (
                <td className="text-center">
                  <span className="dot two-star"></span>
                  <span className="dot two-star"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </td>
              ) : (
                <td className="text-center">
                  <span className="dot one-star"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </td>
              )}
            </tr>
          );
        })}
    </>
  );
}
