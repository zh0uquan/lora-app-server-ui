import Pool from 'pg-pool'
import url from 'url'

const params = url.parse(`${process.env.PSQL_URL}`);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: false
};

const pool = new Pool(config)

export default pool;
