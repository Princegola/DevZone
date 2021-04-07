import Server from './Server.js';
import configuration from './config/configuration.js';

const server = new Server( configuration );
server.bootstrap().run();