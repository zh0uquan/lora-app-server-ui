import bodyParser from 'body-parser'
import express from 'express'
import proxy from 'http-proxy'
import path from 'path'
import pool from './db.js'

const app = express()
const apiProxy = proxy.createProxyServer()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const router = express.Router()

// api for history records
router.get('/api/nodes/location', (req, res) => {
  console.log(`reading this from env > ${process.env.MY_VARIABLE}`)
  pool.connect().then(client => {
    client.query('select * from packet where location is not null').then(result => {
      client.release()
      console.log('successfully queryed, well done!')
      var json = JSON.stringify(result.rows);
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
router.all('*', (req, res) => {
  console.log(`redirect to golang server`)
  apiProxy.web(req, res, {target: "https://localhost:8080", secure: false});
})

app.use(router)

app.set('port', (process.env.PORT || 8899))
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})
