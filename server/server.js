import bodyParser from 'body-parser'
import express from 'express'
import proxy from 'http-proxy'
import path from 'path'
import pool from './db.js'
import https from 'https'
import http from 'http'
import WebSocket from 'ws'
import cors from 'cors'
import url from 'url'
import processNode from './utils/processNode.js'
import filterNodes from './utils/filter.js'
import config from 'config'

const app = express()
const apiProxy = proxy.createProxyServer()

// api for history records
app.get('/api/nodes/location', (req, res) => {
  pool.connect().then(client => {
    client.query('select * from packet where location is not null').then(result => {
      client.release()
      console.log('successfully queryed, well done!')
      var results = filterNodes(result.rows)
      var json = JSON.stringify(results)
      res.writeHead(200, {'content-type':'application/json', 'content-length':Buffer.byteLength(json)})
      res.end(json)
    })
    .catch(e => {
      client.release()
      console.error('query error', e.message, e.stack)
      res.status(500).send('Something broke in db!')
    })
  })

})

// redirect to golang server
app.all('*', (req, res) => {
  console.log(`redirect to golang server`)
  config.get('proxy').agent = https.agent
  apiProxy.web(req, res, config.get('proxy'))
})

app.set('port', (process.env.PORT || 8899))


const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.broadcast = (data) => {
  wss.clients.forEach( (client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  });
};

pool.connect().then(client => {
  client.on('notification', (msg) => {
    if (msg.channel === 'packet_update') {
      var node = processNode(JSON.parse(msg.payload).new_val)
      if (node !== null) {
        wss.broadcast(JSON.stringify(node))
      }
    }
  })
  client.query("LISTEN packet_update");
});

wss.on('connection', (ws) => {
  const location = url.parse(ws.upgradeReq.url, true)
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  ws.on('message', (message) => {
    console.log('received: %s', message)
  });

  ws.on('close', (message) => {
    console.log('received: %s', message)
  });
});

server.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})
