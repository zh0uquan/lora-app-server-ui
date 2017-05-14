import React, { Component } from 'react';
import { Layer, Feature, Popup } from "react-mapbox-gl";

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
      realtimeNodes: [],
      currentPopup: null
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
      console.log(nodes.length)

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
      // console.log(node);
      this.setState({
        realtimeNodes: [node]
      });
    }
  }

  _filterNodesByRange(range) {
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

  _onClickMarker(node) {
    console.log(node);
    if (this.state.currentPopup) {
      this.setState({
        currentPopup: null
      })
    } else{
      this.setState({
        currentPopup: {
          coordinates: [node.location.y, node.location.x],
          name: node.name,
          description: node.description,
          popupShowLabel: !this.state.popupShowLabel
        }
      });
    }
  }

  _onClickPopup() {
    this.setState({
      currentPopup: null
    })
  }

  render() {
    const {displayNodes, realtimeNodes, circleRadius, currentPopup} = this.state;

    const displayNodesFeatures = displayNodes.map((node, i) =>
      <Feature
        key={node.time}
        coordinates={[node.location.y, node.location.x]}
        properties={{rssi: node.gw_rssi}}
        onClick={this._onClickMarker.bind(this, node)}
      />
    );

    const realtimeNodesFeatures = realtimeNodes.map((node, i) =>
      <Feature
        key={moment()}
        coordinates={node.coordinates}
        properties={{rssi: node.gw_rssi}}
      />
    );

    // remeber never mix manual Feature and dynamic List
    return (
      <div>
        <Layer
          id="cluster"
          type="symbol"

          {displayNodesFeatures}
          {realtimeNodesFeatures}
        </Layer>
        {currentPopup &&
          <Popup
            style={{display: currentPopup.popupShowLabel? "true": "none" }}
            coordinates={currentPopup.coordinates}
            anchor={"bottom"}
            offset={10}
            onClick={this._onClickPopup.bind(this)}>
            <p className="text-popup"><strong>{currentPopup.name}</strong></p>
            <p className="text-popup">{currentPopup.description}</p>
            <p className="text-popup">Status: <i className="fa fa-circle" aria-hidden="true" style={{color:"#76FF03"}}></i></p>
          </Popup>
        }
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
                        onChange={this._filterNodesByRange.bind(this)} />
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
