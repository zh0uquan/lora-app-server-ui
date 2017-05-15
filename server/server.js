import bodyParser from 'body-parser'
import express from 'express'
import proxy from 'http-proxy'
import path from 'path'
import pool from './db.js'
import http from 'http'
import WebSocket from 'ws'
import cors from 'cors'
import url from 'url'
import processNode from './utils/processNode.js'
import filterNodes from './utils/filter.js'
import PGPubsub from 'pg-pubsub'

const app = express()
const apiProxy = proxy.createProxyServer()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// api for history records
app.get('/api/nodes/location', (req, res) => {
  console.log(`reading this from env > ${process.env.MY_VARIABLE}`)
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
  apiProxy.web(req, res, {target: "https://localhost:8080", secure: false})
})

app.set('port', (process.env.PORT || 8899))


const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws) => {
  const location = url.parse(ws.upgradeReq.url, true)
  ws.isAlive = true;
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  var pubsubInstance = new PGPubsub(`${process.env.PSQL_URL}`);
  pubsubInstance.addChannel('packet_update');

  pubsubInstance.once('packet_update', (channelPayload) => {
    // Process the payload
    // console.log(channelPayload.new_val)
    var node = processNode(channelPayload.new_val)
    ws.send(JSON.stringify((channelPayload)))
  });

  ws.on('message', (message) => {
    console.log('received: %s', message)
  });

  ws.on('close', (message) => {
    console.log('received: %s', message)
    pubsubInstance.close()
  });

});

server.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})
