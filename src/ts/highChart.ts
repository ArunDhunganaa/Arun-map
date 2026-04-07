import Highcharts from "highcharts";
import Gantt from "highcharts/modules/gantt";

export default function initHighChart() {
  const ganttOptions: Gantt.Options = {
    title: { text: undefined },
    yAxis: { uniqueNames: true },
    series: [
      {
        name: "Project 1",
        type: "gantt",
        data: [
          {
            id: "planning",
            name: "Planning",
            start: Date.UTC(2026, 3, 1),
            end: Date.UTC(2026, 3, 10),
            completed: 0.95,
          },
          {
            name: "Development",
            start: Date.UTC(2026, 3, 11),
            end: Date.UTC(2026, 4, 15),
            dependency: "planning",
          },
        ],
      },
    ],
  };

  Gantt.ganttChart("gantt-container", ganttOptions);

  const growthOptions: Highcharts.Options = {
    chart: { type: "area" },
    title: { text: undefined },
    xAxis: { categories: ["Week 1", "Week 2", "Week 3", "Week 4"] },
    credits: { enabled: false },
    series: [
      {
        name: "User Growth",
        type: "area",
        data: [150, 450, 700, 1200],
        color: "#4f46e5",
      },
    ],
  };

  Highcharts.chart("growth-container", growthOptions);

  const comparisonOptions: Highcharts.Options = {
    chart: { type: "column" },
    title: { text: undefined },
    xAxis: { categories: ["Q1", "Q2", "Q3", "Q4"] },
    yAxis: { title: { text: "Revenue" } },
    credits: { enabled: false },
    series: [
      {
        name: "Actual",
        type: "column",
        data: [45000, 52000, 48000, 61000],
        color: "#0ea5e9",
      },
      {
        name: "Target",
        type: "column",
        data: [40000, 50000, 50000, 55000],
        color: "#cbd5e1",
      },
    ],
  };

  Highcharts.chart("comparison-container", comparisonOptions);
}
