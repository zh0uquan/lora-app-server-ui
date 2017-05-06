import React from 'react'

const NumBlock = (props) => {
  return (
    <div className="col-xs-6 col-md-3 text-center">
      <div className="inline text-left text-center">
        <div className="pt lh1">
          <strong className="text-muted">{props.title}</strong>
        </div>
        <h1 className="mv text-xl text-thin">{props.number}</h1>
      </div>
      <div className="pt">
        <i className={"fa fa-2x " + (props.icon !== undefined? props.icon : "fa-cogs")} aria-hidden="true" style={{color: props.color}}></i>
      </div>
    </div >
  )
}


export default NumBlock;
