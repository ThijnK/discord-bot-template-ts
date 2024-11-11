import { SlashCommandBuilder } from 'discord.js';
import { command, confirmationResponse, reply } from 'utils';

// NOTE: this is just an example command to demonstrate the confirmation response
// you can remove this file and the import from `src/commands/debug/index.ts`

const meta = new SlashCommandBuilder()
  .setName('confirm')
  .setDescription('Test the confirmation response.');

export default command({
  meta,
  private: true,
  exec: async ({ interaction }) => {
    await reply(
      interaction,
      confirmationResponse('example'),
    );
  },
});
