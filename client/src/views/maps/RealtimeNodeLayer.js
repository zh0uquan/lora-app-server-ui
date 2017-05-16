import moment from 'moment';

import React, { Component } from 'react';
import { Layer, Feature } from "react-mapbox-gl";
import Slider from 'rc-slider';
import {Panel} from 'react-bootstrap';
import Drawer from '../../components/Drawer';
import NodeStore from "../../stores/NodeStore";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class RealtimeNodeLayer extends Component {

  constructor() {
    super();
    this.state = {
      circleRadius: 4.5,
      realtimeNodes: [],
    };

    this._watch();
  }

  _watch(props) {
    const ws = new WebSocket(window.location.origin.replace('http', 'ws'));

    ws.onopen = () => {
      ws.send('hello world');
    }

    ws.onmessage = (evt) => {
      const nodes = JSON.parse(evt.data);
      console.log(nodes)

      var node = nodes[Math.floor(Math.random()*nodes.length)];
      // console.log(node);
      this.setState({
        realtimeNodes: [node]
      });
    }
  }

  _onClickDrawer() {
    this.setState({
      visibleDrawer: !this.state.visibleDrawer
    })
  }

  render() {
    const {realtimeNodes, circleRadius, visibleDrawer, } = this.state;

    const realtimeNodesFeatures = realtimeNodes.map((node, i) =>
      <Feature
        key={moment()}
        coordinates={node.coordinates}
        properties={{rssi: node.gw_rssi}}
      />
    );

    const message = realtimeNodes.map((node, i) =>
      <Panel key={moment()}>
        <p>{node.coordinates}</p>
        <p>{node.gw_rssi}</p>
      </Panel>
    );

    // remeber never mix manual Feature and dynamic List
    return (
      <div>
        <Layer
          id="cluster-realtime"
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
          {realtimeNodesFeatures}
        </Layer>
        <div className="container-fluid">
          <div className="row">
            <div id="right-pane" className="col-md-offset-10 col-md-2 col-xs-12">
              <button
                onClick={this._onClickDrawer.bind(this)}
                aria-controls="navigation"
                aria-expanded={visibleDrawer? 'true' : 'false'}>
                {visibleDrawer ? 'Hide' : 'Show'} Navigation
              </button>
              <Drawer id="navigation" visible={visibleDrawer}>
                <div onClick={this._onClickDrawer.bind(this)}>
                  <i className="fa fa-times fa-lg" aria-hidden="true" >close</i>
                </div>
                {message}
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default RealtimeNodeLayer;
