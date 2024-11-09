import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { COLORS } from 'utils';

/** The maximum character length of an embed to send */
const MAX_EMBED_LENGTH = 2048 as const;

/**
 * Function to split an array of lines into multiple embeds (when necessary) and send them in the channel of the interaction
 * @param interaction The interaction to reply to
 * @param input The array of lines to split
 * @param seperator The seperator to use between lines
 * @param title The title of the embed
 * @param msg The message to send before the embeds
 */
export async function splitSend(
  interaction: CommandInteraction,
  input: string[],
  seperator: string,
  title: string,
  msg: string,
) {
  if (!interaction.channel) throw new Error('No channel found');
  if (!interaction.channel.isSendable()) {
    throw new Error('Channel is not sendable');
  }
  if (interaction.replied) throw new Error('Interaction already replied');
  if (!interaction.deferred) await interaction.deferReply();

  // Split the input into multiple embed descriptions
  const descriptions: string[][] = [];
  let charCount = 0;
  for (let i = 0; i < input.length; i++) {
    charCount += input[i].length + seperator.length;
    const index = Math.floor(charCount / MAX_EMBED_LENGTH);
    if (index === descriptions.length) {
      descriptions.push([]);
    }
    descriptions[index].push(input[i]);
  }

  // Create the embeds
  const messageEmbeds: EmbedBuilder[][] = [];
  for (let i = 0; i < descriptions.length; i++) {
    const index = Math.floor(i / 2);
    if (index === messageEmbeds.length) messageEmbeds.push([]);
    const description = descriptions[i].join(seperator);
    const embed = new EmbedBuilder()
      .setColor(COLORS.embed)
      .setTitle(
        `${title} ${
          descriptions.length > 1 ? `(${i + 1}/${descriptions.length})` : ``
        }`,
      )
      .setDescription(description);
    messageEmbeds[index].push(embed);
  }

  // Send the embeds
  if (messageEmbeds.length > 1) {
    await interaction.editReply(msg);
    for (let i = 0; i < messageEmbeds.length; i++) {
      await interaction.channel
        .send({ embeds: messageEmbeds[i] })
        .catch(console.log);
    }
  } else {
    await interaction.editReply({ embeds: messageEmbeds[0], content: msg });
  }
}
