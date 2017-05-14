import React, { Component } from 'react';
import { Layer, Feature } from "react-mapbox-gl";

import { Panel } from 'react-bootstrap';
import NodeStore from "../../stores/NodeStore";

import moment from 'moment';
import Slider from 'rc-slider';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class NodeLayer extends Component {

  constructor() {
    super();
    this.state = {
      nodes: [],
      message: [],
      circleRadius: 4.5,
      displayNodes:[],
      realtimeNodes: []
    };

    this._watch();
  }

  componentDidMount() {
    this.updateMapNodes(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateMapNodes(nextProps);
  }

  updateMapNodes(props) {
    NodeStore.getNodeLocation((nodes) => {
      this.setState({
        nodes: nodes,
        displayNodes: nodes
      });
    });
  }

  _watch(props) {

    const ws = new WebSocket('ws://207.154.240.83:8888');

    ws.onopen = () => {
      ws.send('hello world');
    }

    ws.onmessage = (evt) => {
      // console.log(evt.data);
      const nodes = JSON.parse(evt.data);
      var node = nodes[Math.floor(Math.random()*nodes.length)];
      console.log(node);
      this.setState({
        realtimeNodes: [node]
      });
    }
  }

  _filterNodes(range) {
    // console.log(moment().add(range[0], 'days') < moment(this.state.nodes[0].time));
    // console.log(moment(this.state.nodes[0].time) < moment().add(range[1], 'days'));

    const displayNodes = this.state.nodes.filter( (node) =>
      moment().add(range[0], 'days') < moment(node.time) && moment(node.time) < moment().add(range[1], 'days')
    );
    this.setState({
      displayNodes: displayNodes
    });
    // console.log(displayNodes)
  }

  render() {
    const {displayNodes, realtimeNodes, circleRadius} = this.state;

    const displayNodesFeatures = displayNodes.map((node, i) =>
      <Feature
        key={node.time}
        coordinates={[node.location.y, node.location.x]}
        properties={{rssi: node.gw_rssi}}
      />
    );

    const realtimeNodesFeatures = realtimeNodes.map((node, i) =>
      <Feature
        key={moment()}
        coordinates={node.coordinates}
        properties={{rssi: node.gw_rssi}}
      />
    );
    //

    // remeber never mix manual Feature and dynamic List
    return (
      <div>
        <Layer
          id="clusters"
          type="circle"
          paint={{
            "circle-radius": circleRadius,
            "circle-color": {
                  property: "rssi",
                  stops: [
                      [-300, "#1a237e"],
                      [-120, "#18FFFF"],
                      [-115, "#00E676"],
                      [-110, "#FFEB3B"],
                      [-105, "#FF9800"],
                      [-100, "#FF5722"],
                  ]
            },
            "circle-opacity": .8 }}>
          {displayNodesFeatures}
          {realtimeNodesFeatures}
        </Layer>
        <div id="time-slider" className="container-fluid">
          <div className="row">
            <div className="col-md-offset-3 col-md-6 col-xs-offset-1 col-xs-9">
              <Panel>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-offset-1 col-sm-10">
                      <Range
                        allowCross={false}
                        min={-30}
                        max={0}
                        defaultValue={[-30, 0]}
                        tipFormatter={value => `${value} days`}
                        onChange={this._filterNodes.bind(this)} />
                    </div>
                  </div>
              </div>
            </Panel>
          </div>
          </div>
        </div>
      </div>
    );
  }
}


export default NodeLayer;
