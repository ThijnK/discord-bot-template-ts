import { event } from '../utils';

export default event('ready', ({ logger }, client) => {
  logger.system(
    `\x1b[4m${client.user.tag}\x1b[0m\x1b[36m is up and ready to go!`
  );
});
