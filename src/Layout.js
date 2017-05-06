import React, { Component } from 'react';
import Navbar from "./components/Navbar";
import RightPane from "./components/RightPane";
import Sidebar from "./components/Sidebar";
import Errors from "./components/Errors";
import dispatcher from "./dispatcher";

class Layout extends Component {
  constructor() {
    super();
    this.state = {
      active: false,
    }

    this.handleToggleSidebar = this.handleToggleSidebar.bind(this);
  }


  onClick() {
    // cancel dropdown-menu in navbar
    dispatcher.dispatch({
      type: "BODY_CLICK",
    });
  }

  handleToggleSidebar() {
    this.setState({
      active: !this.state.active,
    });
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            <div id="main" className={"col-sm-12 " + (this.state.active ? "active" : "")}>
              <Sidebar onToggleSidebar={this.handleToggleSidebar}/>
              <RightPane onClick={this.onClick}>
                <Errors />
                {this.props.children}
              </RightPane>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Layout;
