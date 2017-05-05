import React from 'react'

const Pane = (props) => {
  return (
    <div className="panel panel-default">
      <div className="panel-heading" style={{display: (props.title !== undefined? 'default' : 'none')}}>
        {props.title}
      </div>
      <div className="panel-body">
        {props.children}
      </div>
    </div>
  )
}

export default Pane;
