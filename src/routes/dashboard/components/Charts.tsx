import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { ITasks } from "../../tasks/components/TasksTable";

Chart.register(ArcElement, Legend, Tooltip);

export default function Charts(props: {
  incompleteTasks: Array<ITasks>;
  pendingTasks: Array<ITasks>;
  completeTasks: Array<ITasks>;
}) {
  const chartData = [
    props.incompleteTasks.length,
    props.pendingTasks.length,
    props.completeTasks.length,
  ];

  const data = {
    labels: [" Incomplete", " Pending approval", " Completed"],
    datasets: [
      {
        label: "Tasks chart",
        data: chartData,
        backgroundColor: [
          "rgb(190,190,190)",
          "rgb(255, 205, 86)",
          "rgb(128,255,0)",
        ],
        hoverOffset: 3,
      },
    ],
  };

  return (<Doughnut data={data} />);
}
