import { event } from 'utils';

export default event('ready', ({ logger }, client) => {
  logger.system(
    `${client.user.tag} is up and ready to go!`,
  );
});
