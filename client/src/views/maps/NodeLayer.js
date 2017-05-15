import moment from 'moment';

import React, { Component } from 'react';
import { Layer, Feature, Popup } from "react-mapbox-gl";
import Slider from 'rc-slider';
import {Panel} from 'react-bootstrap';
import Drawer from '../../components/Drawer';
import NodeStore from "../../stores/NodeStore";

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
      currentPopup: null,
      visibleDrawer: false,
      lists: []
    };

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

  _filterNodesByRange(range) {
    // console.log(moment().add(range[0], 'days') < moment(this.state.nodes[0].time));
    // console.log(moment(this.state.nodes[0].time) < moment().add(range[1], 'days'));

    const displayNodes = this.state.nodes.filter( (node) =>
      moment().add(range[0], 'days') < moment(node.time) && moment(node.time) < moment().add(range[1], 'days')
    );
    this.setState({
      displayNodes: displayNodes
    });
  }

  _onClickPopup() {
    this.setState({
      currentPopup: null
    })
  }

  _onClickMarker(node) {
    if (this.state.currentPopup) {
      this.setState({
        currentPopup: null
      })
    } else{
      this.setState({
        currentPopup: {
          coordinates: node.coordinates,
          name: node.time,
          deveui: node.deveui,
          description: node.gw_rssi,
          popupShowLabel: !this.state.popupShowLabel
        }
      });
    }
  }


  render() {
    const {displayNodes, circleRadius, currentPopup, lists} = this.state;

    const displayNodesFeatures = displayNodes.map((node, i) =>
      <Feature
        key={node.time}
        coordinates={node.coordinates}
        properties={{rssi: node.gw_rssi}}
        onClick={this._onClickMarker.bind(this, node)}
      />
    );

    // remeber never mix manual Feature and dynamic List
    return (
      <div>
        <Layer
          id="cluster-history"
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
        </Layer>
        {currentPopup &&
          <Popup
            style={{display: currentPopup.popupShowLabel? "true": "none" }}
            coordinates={currentPopup.coordinates}
            anchor={"bottom"}
            offset={10}
            onClick={this._onClickPopup.bind(this)}>
            <p className="text-popup"><strong>Time Send: {currentPopup.name}</strong></p>
            <p className="text-popup">Signal Strength: {currentPopup.description}</p>
            <p className="text-popup">Deveui: {currentPopup.deveui}</p>
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
