import React, { Component } from "react";
import Pane from "./base/Pane";
import LineBlock from "./base/LineBlock";
import NumBlock from "./base/NumBlock";
import DoughnutBlock from "./base/DoughnutBlock";

class Overview extends Component {
  constructor()  {
    super();
  }

  render () {
    return (
      <div>
        <div id="#pane-numbers" className="col-lg-9 col-md-12">
          <Pane>
            <div className="row">
              <NumBlock title="Applications" number="4" color="rgb(68,138,255)" />
              <NumBlock title="Gateways" number="9" color="rgb(105,240,174)" icon="fa-server" />
              <NumBlock title="Users" number="34" color="rgb(124,77,255)" icon="fa-users" />
              <NumBlock title="Channels" number="55" color="rgb(66,66,66)" icon="fa-signal" />
            </div>
            <div className="row">
              <div id="div-line">
                <LineBlock />
              </div>
            </div>
          </Pane>
        </div>
        <div id="#pane-pies" className="col-lg-3 col-md-3">
          <Pane title="hello world 01">
            <div id="div-doughnut">
              <DoughnutBlock />
            </div>
          </Pane>
          <Pane title="hello world 02">
            <div id="div-doughnut">
              <DoughnutBlock />
            </div>
          </Pane>
        </div>
    </div>
    );
  }
}

export default Overview;
