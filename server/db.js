import Pool from 'pg-pool'
import url from 'url'

const params = url.parse("postgres://loraserver:loraserver@172.17.0.4:5432/loraserver");
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
<<<<<<< HEAD
=======
//
>>>>>>> 4c9c3bd326d7063792ae088336ac4cd829d93e1a
