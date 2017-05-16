import React from 'react';
import {Doughnut} from 'react-chartjs-2';

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getState = () => ({
  labels: [
    'Red',
    'Green',
    'Yellow'
  ],
  datasets: [{
    data: [getRandomInt(50, 200), getRandomInt(100, 150), getRandomInt(150, 250)],
    backgroundColor: [
    '#CCC',
    '#36A2EB',
    '#FFCE56'
    ],
    hoverBackgroundColor: [
    '#FF6384',
    '#36A2EB',
    '#FFCE56'
    ]
  }]
});

class DoughnutBlock extends React.Component {
  super(props) {
    this.state = {};
  }

  componentWillMount() {
		this.setState(getState());
	}


  render () {
    return (
      <div>
          <Doughnut data={this.state} />
      </div>
    );
  }
}

export default DoughnutBlock;
