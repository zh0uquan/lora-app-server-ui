import React from 'react';
import {Line} from 'react-chartjs-2';

class LineBlock extends React.Component {
  render () {
    // fake data
    var chartData = {
          labels: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58'],
          datasets: [{
            label: "fake data",
            data: [14, 10, 2, 4, 5, 5, 5, 17, 18, 5, 1, 16, 4, 8, 18, 12, 18, 16, 1, 20, 14, 8, 10, 8, 3, 2, 8, 3, 11, 5],
            backgroundColor: "rgba(189,189,189, 0.5)"
          }, {
            label: "fake data",
            data: [9, 3, 7, 8, 12, 5, 12, 11, 12, 16, 12, 8, 8, 7, 5, 3, 6, 6, 14, 18, 3, 4, 8, 8, 15, 9, 10, 9, 11, 10],
            backgroundColor: "rgba(120,144,156, 0.5)"
          }]
    };
    var chartOptions = {
      maintainAspectRatio: false,
      scales: {

            xAxes: [{
                        gridLines: {
                            display:false
                        },
                        display: false
                    }],
            yAxes: [{
                        gridLines: {
                            display:false
                        },
                        display: false
                    }]
      },
      tooltips: {
        intersect:false
      }
    };

    return (
      <div>
        <Line data={chartData} options={chartOptions} width={500} height={300}/>
      </div>
    );
  }
}

export default LineBlock;
