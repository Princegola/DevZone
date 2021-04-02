import Server from './Server.js';
import config from './config/configuration.js';

const server = new Server( config );
server.bootstrap().run();