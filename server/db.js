import Pool from 'pg-pool'
import url from 'url'
import config from 'config'

const params = url.parse(config.get('dbConfig.url'));
const auth = params.auth.split(':');

const dbconfig = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: false
};

const pool = new Pool(dbconfig)

export default pool;
