import bodyParser from 'body-parser'
import express from 'express'
import proxy from 'http-proxy'
import path from 'path'
import pool from './db.js'
import http from 'http'
import WebSocket from 'ws'
import cors from 'cors'
import url from 'url'
import moment from 'moment'
import Dict from 'collections/dict'

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
      let nodes = result.rows

      let hashtable = new Map()
      for (let node of nodes) {
        let coordinates = [node.location.y.toFixed(5), node.location.x.toFixed(5)]
        node.coordinates = coordinates
        hashtable.set(
          JSON.stringify(coordinates), (hashtable.get(JSON.stringify(coordinates)) || []).concat(node))
      }

      const now = moment({})
      for (let corrd of hashtable.keys()) {
        let dateDict = new Map()
        for (let node of hashtable.get(corrd)) {
          let diffDay = now.diff(moment(node.time), 'days')
          if ( dateDict.get(diffDay) === undefined ) {
            dateDict.set(diffDay, node)
          } else {
            if (moment(node.time) > moment(dateDict.get(diffDay).time)) {
              dateDict.set(diffDay, node)
            }
          }
        }
        hashtable.set(corrd, Array.from(dateDict.values()))
      }

      let results = Array.from(hashtable.values()).reduce((arr, curr)=> arr.concat(curr), [])

      var json = JSON.stringify(results);
      res.writeHead(200, {'content-type':'application/json', 'content-length':Buffer.byteLength(json)});
      res.end(json);
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
  apiProxy.web(req, res, {target: "https://localhost:8080", secure: false});
})

app.set('port', (process.env.PORT || 8899))


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  const location = url.parse(ws.upgradeReq.url, true);
  ws.isAlive = true;
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  ws.on('message', (message) => {
    console.log('received: %s', message);
  });

  var clientRandomNumberUpdater;

  clientRandomNumberUpdater = setInterval(() => {
    if (ws.readyState == ws.OPEN) {
      ws.send(
      JSON.stringify(
        [{'coordinates': [13.3866111, 52.5170092], 'gw_rssi': -117},
       {'coordinates': [13.3866103, 52.5170012], 'gw_rssi': -113},
       {'coordinates': [13.3866103, 52.5170092], 'gw_rssi': -107},
       {'coordinates': [13.3866103, 52.5170033], 'gw_rssi': -101}]
      )
    )
    }
  }, 3000);

});

server.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})
