import Chart from "chart.js/auto";

export default function initChart() {
  const ctx = document.querySelector(".growth-chart") as HTMLCanvasElement;
  if (!ctx) return;

  new Chart(ctx, {
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          type: "line",
          label: "Revenue Target",
          data: [12, 19, 15, 25, 22, 30],
          borderColor: "#ff6384",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
          tension: 0.4,
        },
        {
          type: "bar",
          label: "Actual Sales",
          data: [10, 15, 20, 22, 28, 35],
          backgroundColor: "#36a2eb",
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Monthly Performance: Target vs Actual" },
      },
    },
  });

  const market = document.querySelector(".market-chart") as HTMLCanvasElement;
  if (!market) return;

  new Chart(market, {
    type: "doughnut",
    data: {
      labels: ["Imported Goods", "Local Production", "Services"],
      datasets: [
        {
          label: "Market Split",
          data: [45, 30, 25],
          backgroundColor: ["#FFCE56", "#4BC0C0", "#9966FF"],
          hoverOffset: 15,
          borderRadius: 10,
          spacing: 5,
        },
      ],
    },
    options: {
      cutout: "70%",
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });

  const compare = document.querySelector(
    ".comparison-chart",
  ) as HTMLCanvasElement;
  if (!compare) return;

  new Chart(compare, {
    type: "radar",
    data: {
      labels: ["Profitability", "Scalability", "Risk", "Capital", "Labor"],
      datasets: [
        {
          label: "Manufacturing Idea",
          data: [90, 85, 40, 70, 60],
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
        },
        {
          label: "Import Idea",
          data: [60, 50, 80, 40, 30],
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
        },
      ],
    },
    options: {
      elements: { line: { borderWidth: 3 } },
      scales: { r: { suggestedMin: 0, suggestedMax: 100 } },
    },
  });
}
