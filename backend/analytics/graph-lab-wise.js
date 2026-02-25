const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const canvas = new ChartJSNodeCanvas({ width: 600, height: 400 });
const image = await canvas.renderToBuffer({
  type: 'bar',
  data: {
    labels: ['Lab1', 'Lab2', 'Lab3'],
    datasets: [{
      label: 'Faults Reported',
      data: [5, 12, 7],
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }]
  }
});
