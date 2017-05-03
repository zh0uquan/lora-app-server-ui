import React, { Component } from 'react';
import { Link } from 'react-router';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.handleToggleSidebar = this.handleToggleSidebar.bind(this);
  }

  handleToggleSidebar() {
    this.props.onToggleSidebar();
  }

  render() {
    return (
      <div id="sidebar-main" className="nav-side-menu">
        <div className="brand">
          Menu<i className="fa fa-bars fa-lg" id="menu-toggle" onClick={this.handleToggleSidebar}></i>
        </div>
        <div>
          <ul className="sidebar-top">
            <li><Link to="/">Dashboard<i className="fa fa-dashboard fa-lg"></i></Link></li>
            <li><Link to="maps/view">Maps<i className="fa fa-map fa-lg"></i></Link></li>
            <li><Link to="applications">Apps<i className="fa fa-cogs fa-lg"></i></Link></li>
            <li><Link to="users">Users<i className="fa fa-users fa-lg"></i></Link></li>
            <li><Link to="gateways">Gateways<i className="fa fa-server fa-lg"></i></Link></li>
            <li><a href="#">Piechart</a><i className="fa fa-pie-chart fa-lg"></i></li>
          </ul>
          <ul className="sidebar-bottom">
            <li></li>
            <li><a href="#">Contact</a><i className="fa fa-envelope fa-lg"></i></li>
            <li><a href="#">Settings</a><i className="fa fa-cog fa-lg"></i></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;
