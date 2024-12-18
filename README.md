# Discord bot template

[![Stars](https://img.shields.io/github/stars/ThijnK/discord-bot-template-ts)](https://github.com/ThijnK/discord-bot-template-ts/stargazers)
[![discord.js](https://img.shields.io/badge/discord.js-%5E14.16.3-blue)](https://discord.js.org/)
[![GitHub release](https://img.shields.io/github/v/release/ThijnK/discord-bot-template-ts?label=version)](https://github.com/ThijnK/discord-bot-template-ts/releases)
[![Checks](https://img.shields.io/github/actions/workflow/status/ThijnK/discord-bot-template-ts/check.yml?label=checks)](https://github.com/ThijnK/discord-bot-template-ts/actions)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

A _TypeScript_ template for a **Discord bot**, now powered by **Deno**!

## Features

- 🟦 TypeScript
- 💬 Slash commands
- 📆 Event handlers
- 📄 Built-in pagination
- ❔ Automatic help command
- ⏳ Command cooldowns
- 🚗 Support for autocomplete
- 🆔 Interaction ID handling
- 🗞️ Advanced logging
- ✅ Action confirmations

## Prerequisites

Some knowledge of TypeScript and Discord.js is recommended, and you'll need the following installed:

- [Deno](https://deno.com/) (v2.0 or higher)

If you are unaware, Deno is an alternative to Node.js, and is used in this template to run the bot.
If you want to know more about Deno and how it compares to Node.js, you can read the [Deno documentation](https://deno.land/manual).

You will need a Discord bot token, which you can get by creating a new application in the [Discord developer portal](https://discord.com/developers/applications) by following the steps outlined in the [Discord developer documentation](https://discord.com/developers/docs/getting-started).

## Getting started

To get started, create a new repository from this template, as explained in the [GitHub docs](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template).

Set the required environment variables (see section [Environment variables](#environment-variables)).
Then run the following commands to install the dependencies and start the bot (in development mode):

```sh
deno install
deno task dev
```

## Environment variables

An example `.env` file is provided under [`example.env`](./.env.example). You can copy this file and rename it to `.env` to get started.

Environment variables are encapsulated in the `ENV` object, located in the `src/env.ts` file.
When adding a new environment variable, you should add it to the `ENV` object as well.
This will check that the environment variable is set, and throw an error if it is not.

You should provide at least the following environment variables:

- `BOT_TOKEN`: the token of your bot
- `TEST_GUILD`: the ID of the guild to register slash commands in during development

In case you want to use a separate bot token for development, you can provide it in the `TEST_TOKEN` environment variable.
If no `TEST_TOKEN` is provided, the `BOT_TOKEN` will be used for development as well.

## Styling

To ensure consistent styling throughout the bot's embeds and messages, some definitions are provided in the [`src/utils/style.ts`](./src/utils/style.ts) file.
Currently, this includes the following:

- `COLORS`: common colors used for specific purposes (e.g. to make sure embeds always have the same color)
- `EMOJIS`: common emojis for specific purposes (e.g. to indicate success or error)

The `EMOJIS` constant is currently being used to add emojis to the reply messages created through the `reply()` function (see the [Interaction replies](#interaction-replies) section), as well as some of the log messages sent to Discord wehbooks (if enabled; see the [Logging](#logging) section).
The `COLORS` constant is only being used to give the same color to every embed the bot sends out, namely `COLORS.embed`. The `warn` and `error` colors are not being used anywhere, but are provided as examples.

You are, of course, free to change these, or add new ones and new fields to the existing ones, to customize the bot to your liking.

## Commands

Commands are located in the [`src/commands`](./src/commands) folder.

Commands are grouped into _categories_, each of which has its own folder.
The `index.ts` file in each folder exports the commands in that category and provides some metadata about the category, which includes at least the name of the category, and optionally a description and emoji (which will be used for example in the `/help` commmand).
The [index.ts](./src/commands/index.ts) file imports the categories from the various folders and exports them as a single array, which is used to register them in the [`src/events/interactionCreate/commands.ts`](./src/events/interactionCreate/commands.ts) file.

Each command gets its own file, and consists of a `meta` object, built using a `SlashCommandBuilder` from `discord.js`, and an `exec` function, which is invoked when the command is executed.
This `exec` function is passed a context containing the bot client, a Logger instance (instantiated with the command name; see the [Logging](#logging) section), and the interaction itself.
Note that errors thrown in the `exec` function will be caught and logged automatically, so you don't have to worry about catching them yourself (unless you want to customize the message shown to the user upon an error, for which the default is imply "Oops. Something went wrong!").
_Do, however, make sure that you await asynchronous functions, such that errors thrown inside such functions will be caught as well!_

You can add additional fields to the command context by modifying the `CommandContext` type in the [`src/types/commands.ts`](./src/types/commands.ts) file and adding the new fields to the call to `command.exec(...)` call in the [`src/events/interactionCreate/command.ts`](./src/events/interactionCreate/command.ts) file.
You may ask yourself why you would propagate a context like this through the event and command executions.
The reason, essentially, is to avoid having to import the client and logger in every file, but you are free to import them in every file if you prefer.

A command file should look something like this:

```ts
import { SlashCommandBuilder } from 'discord.js';
import { command, reply } from 'utils';

const meta = new SlashCommandBuilder()
  .setName('example')
  .setDescription('Example command.');

export default command({
  meta,
  exec: async ({ interaction }) => {
    await reply(interaction, {
      ephemeral: true,
      content: 'Hello world!',
    });
  },
});
```

### Help command

A `/help` command which automatically generates an embed that allows for navigating through all of the commands (and their subcommands and subcommand groups!) is provided out of the box.
More information about this command can be found in the [Help menu](#help-menu) section.

### Command options

The `command()` function takes an object containing at least the `meta` object created using the `SlashCommandBuilder` from `discord.js` and the `exec` function responsible for executing the command.
There's some optional fields that can be passed into the object to further configure the command.
The following optional fields are available:

- `private`: whether the command should be private to the test guild (default: `false`)
- `adminOnly`: whether the command should only be available to users with the `ADMINISTRATOR` permission (default: `false`)
- `guildOnly`: whether the command should only be available in guilds and not in DMs (default: `false`)
- `cooldown`: the cooldown of the command, in seconds, or as an object with `seconds` and `scope` (user-specific or guild-wide) fields (see the [Command cooldowns](#command-cooldowns) section)

When a command is _private_, it will only be registered in the test guild, never in any other servers. This could be useful for commands that you, as the bot creator, want to use, but do not want others to use.

### Subcommands

Subcommands are supported by the `SlashCommandBuilder` from `discord.js`, and can be added to a command by calling the `addSubcommand()` or `addSubcommandGroup()` methods on the `SlashCommandBuilder` object.
The `addSubcommand()` method takes a `SlashCommandSubcommandBuilder` object, which is created in the same way as the `SlashCommandBuilder` object, and the `addSubcommandGroup()` method takes a `SlashCommandSubcommandGroupBuilder` object, which is created in the same way as the `SlashCommandBuilder` object, but with the addition of the `addSubcommand()` method.

Determining which subcommand was used is done by using `interaction.options.getSubcommand()` and `interaction.options.getSubcommandGroup()`, which return the name of the subcommand or subcommand group, respectively.
An example of the usage of subcommands can be found in the [`src/commands/general/info.ts`](./src/commands/general/info.ts) file.

Remember, subcommands will be picked up automatically by the help command, however deep they are nested in subcommand groups!

### Command cooldowns

Command cooldowns can be set using the `cooldown` field in the command's [options](#command-options), as shown in the below snippet.
This can be a number, representing the cooldown in seconds, or an object with `seconds` and `scope` fields.
The `scope` field can be either `'user'` or `'guild'`, and determines whether the cooldown is user-specific or guild-wide.
If the `scope` field is not provided, the cooldown will be user-specific by default.

```ts
export default command(
  // This command has a cooldown of 30 seconds, and works on a per-user basis
  { meta, cooldown: 30 /* ... */ },
);

export default command(
  // This command has a cooldown of 60 seconds, and works on a guild-wide basis
  { meta, cooldown: { seconds: 60, scope: 'guild' } /* ... */ },
);
```

When a command is on cooldown, the bot will reply with a message indicating this, and the command will not be executed.
Notably, server members with the admin permission automatically bypass the cooldown, but their command usage will still be recorded.
That is, if the cooldown is guild-wide, an admin may use the command however often they want, but after an admin uses the command, it will still be on cooldown for non-admin members.

The logic for command cooldowns is located in the [`src/events/interactionCreate/commands.ts`](./src/events/interactionCreate/commands.ts) file, in the `checkCooldown` function.

### Autocomplete

Support for autocomplete, as described in [this](https://discordjs.guide/slash-commands/autocomplete.html) `discord.js` guide, is provided in the template.
You can simply enable autocomplete for a command option by using [`setAutocomplete(true)`](https://discord.js.org/docs/packages/builders/1.8.1/SlashCommandStringOption:Class#setAutocomplete) on a `SlashCommandStringOption`.
You have to provide the autcompletion yourself (see the guide linked above), in an event handler specified under the `autocomplete` field in the argument of the `command()` function (similar to how you would define the `exec` function).

For instance:

```ts
const meta = new SlashCommandBuilder()
  .setName('example')
  .setDescription('Example command.')
  .addStringOption((option) =>
    option
      .setName('example-option')
      .setDescription('Example option.')
      .setRequired(true)
      .setAutocomplete(true),
  );

export default command({
  meta,
  exec: () => {
    // ...
  },
  autocomplete: async ({ interaction }) => {
    const focusedValue = interaction.options.getFocused();
    const choices = [
      'Popular Topics: Threads',
      'Sharding: Getting started',
      'Library: Voice Connections',
      'Interactions: Replying to slash commands',
      'Popular Topics: Embed preview',
    ];
    const filtered = choices.filter((choice) =>
      choice.toLowerCase().startsWith(focusedValue.toLowerCase()),
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice })),
    );
  },
});
```

The logic to delegate autocomplete interactions to their respective event handlers is located in the [`src/events/interactionCreate/commands.ts`](./src/events/interactionCreate/commands.ts) file.

## Events

Events are located in the [`src/events`](./src/events) folder.
The [index.ts](./src/events/index.ts) file exports all event handlers, which is used to register them in the [`src/index.ts`](./src/index.ts) file, which in turn calls the `registerEvents` function from [`src/utils/event.ts`](./src/utils/event.ts).

All `interactionCreate` events are grouped together in the [`src/events/interactionCreate`](./src/events/interactionCreate) folder, and are exported in the corresponding [`index.ts`](./src/events/interactionCreate/index.ts) file.
When adding new events, it is recommended to group them in a similar way.

Each event handler consists of the event name and a listener function, which is called when the event is triggered.
The listener function recieves a context with the bot client and a Logger instance (instantiated with the event name; see the [Logging](#logging) section), as well as a list of arguments specific to the event.

An event handler file should look something like this:

```ts
import { event } from 'utils';

export default event('ready', ({ logger }, client) => {
  logger.system(
    `\x1b[4m${client.user.tag}\x1b[0m\x1b[36m is up and ready to go!`,
  );
});
```

## Help menu

A `/help` command is provided in the [`src/commands/general/help.ts`](./src/commands/general/help.ts) file, which automatically generates an embed that allows for navigating through all of the commands (and their subcommands and subcommand groups!).
It uses the pagination functionality described in section [Pagination](#pagination).

The command takes into account the options set on the commands, such as whether they are private (restricted to test guild) or admin-only, and only shows the commands that are applicable to the user using the command.
If a command is private or admin-only, this will be shown in the help menu.

## Bot status

There are two options to set the bot's activity and status:
1. Set the desired activity and status in the `presence` object inside the `Client` constructor in the [`src/client/index.ts`](./src/client/index.ts) file:
```ts
import { Client, ActivityType } from 'discord.js';

const client = new Client({
  // ...
  presence: {
    activities: [
      {
        name: 'your commands',
        type: ActivityType.Listening,
      },
    ],
    status: 'online', // online, idle, dnd, invisible
  },
});
```
2. Set the desired activity and status through the `client.user.setActivity()` and `client.user.setStatus()` methods wherever you want in your code:
```ts
client.user.setActivity('your commands', { type: ActivityType.Listening });
client.user.setStatus('online');
```

Generally, if you want to set the activity and status once on startup, you should use the first option, but if you want to change the activity and status dynamically, you should use the second option.
Remember that the client object is included in the context of every event handler, including commands, so you can easily change the activity and status when a command is executed.
For example, for the `/ping` command in the [`src/commands/debug/ping.ts`](./src/commands/debug/ping.ts) file:
```ts
import { SlashCommandBuilder, ActivityType } from 'discord.js';

// ...

export default command({
  meta,
  private: true,
  exec: async ({ client, interaction }) => {
    // ...

    client.user?.setActivity(`Pinging ${interaction.user.username}`, {
      type: ActivityType.Custom,
    });

    // ...
  },
});
```
This example will set the bot's activity to "Pinging {username}" when the `/ping` command is executed.

## Logging

The [`src/utils/log.ts`](./src/utils/log.ts) file exports a `Logger` class, which can be used to log messages to the _console_, to a _file_, to a Discord _webhook_, or all of the above.
It is instantiated with a `category` string, which is used to prefix the log messages.
The file also exports a `log()` function which can be used to directly log messages without having to instantiate a `Logger` object.

The different types of log messages are color-coded when printed to the console, and can be used to easily distinguish between important and less important messages.
A separate method is provided for each log type, e.g. `log.error()`, `log.warn()`, etc. (or, in the case of the `Logger` class, `logger.error()`, `logger.warn()`, etc.).
The following log message types are currently supported:

- `info`: default log message (white text)
- `error`: error messages (red text)
- `warn`: warning messages (yellow text)
- `debug`: debug messages (gray text)
- `system`: system messages, such as startup messages (cyan text)

The `Logger` class is used in the contexts of events and commands to automatically prefix every logged message in specific commands or events with the corresponding command or event name.
By default, a `Logger` instance will only print log messages to the console.
If you want a specific `Logger` instance to write to a file or Discord webhook (i.e. send the log messages to a Discord channel), then you can provide a config object to the constructor:

```ts
type LoggerConfig = {
  /**
   * Whether to log messages to the console.
   * @default true
   */
  console?: boolean;
  /**
   * Whether to log messages to a file.
   *
   * If it does not yet exist, a file will be created in the `/logs` directory, with the ISO formatted date in the name (so `<YY-MM-DD>.log`).
   * Optionally, you may overwrite the file name by providing a string.
   * @default false
   */
  file?: boolean | string;
  /**
   * Discord webhook to log messages to (i.e. send messages to a Discord channel).
   *
   * The webhook must be a Discord webhook.
   * If is not set (i.e. `undefined`), which is the default, messages will not be logged to a webhook.
   * @default undefined
   * @example 'https://discord.com/api/webhooks/...'
   * @see https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks
   */
  webhook?: string;
  /**
   * Log types to ignore when logging to the webhook.
   *
   * If not set (i.e. `undefined`), which is the default, all log types will be logged to the webhook.
   * @default undefined
   */
  webhookIgnore?: LogType[];
};
```

To adjust the existing `Logger` instances in the code, just search for `new Logger` and add the desired configuration object as the second argument.
The webhook option is particularly useful, as it allows you to send logs to a Discord channel (even one which the bot itself does not have access to), where you can easily view them and set up alerts for certain log messages.
The messages sent to the webhook are formatted nicely using Discord's markdown and emojis.
If you want to send only specific types of log messages to the webhook, you can provide a list of types to ignore in the `webhookIgnore` field of the config object.
You can customize the message sent to the webhook by editing the code in the `Logger.log()` method in the [`src/utils/logger.ts`](./src/utils/logger.ts) file.

## Interaction replies

The [`src/utils/reply.ts`](./src/utils/reply.ts) file exports a `reply` class, which can be used to send replies to interactions, without having to worry about whether you should be using `interaction.reply()` or `interaction.editReply()`, as it automatically uses the correct method.

The function takes the interaction to reply to, the options for the reply (meaning you can provide the same options as you would to `interaction.reply()` or `interaction.editReply()`), and optionally a reply type.
The reply will be made ephemeral by default, but it can be overwritten by providing a value for it yourself in the options (second argument).
The reply type can be one of the following:

- `default`: send a normal reply
- `success`: send a success reply, which is prepended with a success emoji
- `error`: send an error reply, which is prepended with an error emoji
- `warn`: send a warning reply, which is prepended with a warning emoji
- `deny`: send a reply that denies the interaction, which is prepended with a deny emoji
- `wait`: send a reply that indicates a waiting state, which is prepended with an hourglass emoji

Similar to the `log()` function (see the [Logging](#logging) section), the `reply()` function provides easy-to-use sub-functions for each type, e.g. `reply.error()`, `reply.warn()` and `reply.deny()`.

If you want these replies to use embeds by default (instead of simply sending a text message), this can be easily changed by modifying the `getOptions()` function in the [`src/utils/reply.ts`](./src/utils/reply.ts) file.

## Pagination

There is built-in support for pagination of content using embeds.
Currently, this is only used in the `/help` command, but you can create your own pagination by following these steps:

1. Create a paginator in the [`src/utils/paginators.ts`](./src/utils/paginators) folder, using the constructor of the `Paginator` class defined in [`src/utils/pagination.ts`](./src/utils/pagination.ts).
2. Add the paginator you created to the `paginators` array in the [`src/utils/paginators/index.ts`](./src/utils/paginators/index.ts) file.
3. Use the `paginationReply()` function from the utils to create an embed that can be used to navigate through the pages. Don't forget to await this function!

### Help command pagination

The pagination for the `/help` command uses a separate paginator for each category of commands, which are defined in the [`src/utils/paginators/help.ts`](./src/utils/paginators/help.ts) file.
The pagination embed for a selected category is created in the [`src/events/interactionCreate/help.ts`](./src/events/interactionCreate/help.ts) file.

### Caching pagination data

The `Paginator` class takes a `getData()` function to fetch the data to paginate.
It is passed a context object, whose type is defined in the [`src/types/pagination.ts`](./src/types/pagination.ts) file as `PaginationContext`, which extends the `BaseContext` defined in [`src/types/context.ts`](./src/types/context.ts).
The context object currently contains the bot client, the interaction and a logger, but you can add additional fields to it if you need to.

To avoid having to fetch the data every time the page is changed, the `Paginator` class offers the option to cache the data by setting `cacheData` to `true` in the constructor.
When you set this to `true`, you must also specify the `getCacheKey()` function in the constructor, which takes the context object and returns a string that is used as the key for the cache.
The `getData()` function is then only called when the data is not yet cached, and the cached data is used otherwise.
This allows you to cache the data for a specific user (and guild), for example, by using the user ID as the cache key.

### Customizing pagination message

The pagination uses embed fields to display the content, and thus the limit of items to show on a single page is 25 (the maximum number of fields allowed in an embed).
You can customize the components of the embed being sent using the optional `embedData` prop, except the fields and footer, since those are set by the pagination.
Additionally, you can change the options of the reply message using the optional `replyOptions` prop.
The pagination embed, the _next_ and _back_ buttons and the page selector will be added onto the given reply options to compose the final message.
The reply is made ephemeral by default, so if you want it to not be ephemeral, you have to explicitly pass `ephemeral: false` to the `replyOptions`.

_Note_: both the `embedData` and `replyOptions` props can either be the actual data, or a function that returns the data. The function is passed the context object, so you can use the context to determine the data to return (e.g. make it user-specific).

## Interaction IDs

Discord interaction IDs are used to identify interactions, such as slash commands, buttons, and select menus.
This allows the bot to differentiate between multiple interactions of the same type.
For example, if you have a slash command that sends a message with a button, and you click that button, the bot needs to know which button was clicked.
This is done by setting a custom ID on that button.

This template uses a concept of *namespaces* to distinguish between different interactions.
By using a string that separates different pieces of data using `;`, we can create a custom interaction ID that can be parsed to retrieve the namespace and custom arguments.
The namespace is an enum that identifies the type of interaction, while the arguments are a list of strings that provide additional data (e.g. the name of the paginator and the current offset).
Thus, the general structure of a custom interaction ID under the hood will be as follows:

```
<namespace>;<arg1>;<arg2>;<...>
```

The namespaces can be used to filter out other interactions in the `interactionCreate` event handler, and the arguments can be used to pass specific data along with the interaction.
For example, the pagination (see the [Pagination](#pagination) section) uses the `Pagination` namespace, and passes the paginator name and current offset as arguments.
The event handler for the pagination buttons can then filter out other interactions by checking the namespace, and use the arguments to determine which paginator to use and what the current offset is.
In particular, it looks something like this:

```ts
import { Namespace, parseId } from 'utils';

// ...

if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
const [namespace] = parseId(interaction.customId);
if (namespace !== Namespace.Pagination) return;
```

The first line filters out other types of interactions, such as slash commands, and the second line parses the interaction ID to retrieve the namespace, which is then used to check that the interaction is indeed a pagination interaction.
Notice the use of the `Namespace` object to make sure we always use a valid namespace.

There are two utility functions available in the [`src/utils/interaction.ts`](./src/utils/interaction.ts) file:

- `createId()`: create an interaction ID from a namespace and a list of arguments
- `parseId()`: parse an interaction ID into a namespace and a list of arguments

If you want to add new namespaces, you can simply add them to the `Namespace` enum in the [`src/utils/interaction.ts`](./src/utils/interaction.ts) file.

## Action confirmations

A common occurrence in Discord bots is the need to confirm an action, such as deleting a message or banning a user.
This template provides a simple way to set up such a confirmation for any action.
![Default confirmation embed](images/confirmation.png)

To set up a confirmation flow, follow these steps:
1. Create a new file in the [`src/utils/confirmations`](./src/utils/confirmations) directory.
2. Export a function to handle a confirmation, wrapped inside the `confirmation()` function (to type check the function signature you provide). The handler function receives a boolean indicating whether the action was confirmed or not, as well as the interaction and event context. An example is provided in the [`src/utils/confirmations/example.ts`](./src/utils/confirmations/example.ts) file.
3. Import the function you created in the [`src/utils/confirmations/index.ts`](./src/utils/confirmations/index.ts) file.
4. Add the function to the `confirmationHandlers` object, using the name you want to use to trigger the confirmation flow.
5. Use the `confirmationResponse()` function wherever you want to create an interaction reply options object (i.e. a message) that contains an embed alongside the `Cancel` and `Confirm` buttons. This function takes three arguments:
  - The first argument is the name of the confirmation handler to use (i.e. the key which your confirmation function is stored under in the `confirmationHandlers` object).
  - The second argument is optional and can contain your own reply options, allowing you to customize the message.
  By default, the `confirmationResponse()` function adds an embed with the title "Confirmation" and a description that asks the user to confirm the action, but this will be overwritten if you provide your own embed object.
  - The third argument can contain additional (short) arguments, which will be passed through the flow using custom IDs on the buttons (see the [Interaction IDs](#interaction-ids) section).
  These arguments will be passed along to your confirmation function, so you can use them to pass data like a user id or message id.

Essentially, this setup allows you to skip the step of setting up your own event handler for the confirmation buttons.
Such an event handler is provided in the [`src/events/interactionCreate/confirmation.ts`](./src/events/interactionCreate/confirmation.ts) file, which will automatically call the confirmation function you set up with the boolean value of the button clicked, as well as the interaction and event context.

The `/confirm` command implements an example of this setup, which simply sends the default confirmation embed and edits the message to show the result of the confirmation flow.
(You can remove this command if you so desire.)

## Other utility functions

- [`splitSend`](./src/utils/split.ts): split a a list of lines over multiple embeds, respecting Discord's embed description length limit.
- [`chunk`](./src/utils/chunk.ts): split an array into chunks of a given size (jagged array / matrix).

## Database

If you wish to use a database, you can add a `src/client/db.ts` file, which exports a `db` object, and re-export it in [`src/client/index.ts`](./src/client/index.ts).
This `db` object should be imported in [`src/index.ts`](./src/index.ts) and passed to the `registerEvents` function.
In the `registerEvents` function (located in [`src/utils/event.ts`](./src/utils/event.ts)), you can then add it to the context for the event handlers, giving your commands and events access to the database.
Note that passing the database in the context like this is recommended over importing a database object in every file.

For example, the following snippet initializes a database connection using the `firebase-admin` package and would be added to the `src/client/db.ts` file:

```ts
import admin from 'firebase-admin';
import ENV from 'env';

const serviceAccount = JSON.parse(ENV.FIREBASE_SDK);

// Initialize Firebase with the realtime database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ENV.DB_URL,
});

export const db = admin.database();
```

Don't forget to add the `FIREBASE_SDK` and `DB_URL` environment variables to your `.env` and `env.ts` files if you use the above snippet.
You'll also have to install the `firebase-admin` package using `deno add firebase-admin`.

## Server

If you need to run a server alongside the bot, for example to create an API which you can use to control the bot from a dashboard, you can add a `src/server` folder.
Create an `index.ts` file in this folder, and add the following snippet to run an Express server:

```ts
import express from 'express';
import { log } from 'utils';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(process.env.PORT || 3000, () => {
  log.system('server', 'Listening on port 3000!');
});
```

In this snippet, you can access the bot client by importing it from [`src/client/index.ts`](./src/client/index.ts).
The process.env.PORT environment variable is usually provided by the hosting service and defaults to 3000 if not provided.

You can do whatever you want with this Express server, including adding routes, middleware, etc. (see the [Express documentation](https://expressjs.com/)).
Folder structure is up to you, but you can use the following as a starting point:

```
src
├── server
│   ├── index.ts
│   ├── routers
│   │   ├── index.ts
│   │   └── ...
│   ├── middleware
│   │   ├── index.ts
│   │   └── ...
├── ...
```

## Code style

This template uses the Deno built-in code formatter to automatically format the code.
A command, `deno task fmt`, is provided to run the Deno formatter on all files in the `src` folder and immediately fix any issues.
You can also use the Deno extension, with some [VS Code settings](https://stackoverflow.com/questions/66207931/how-to-format-on-save-with-the-deno-vscode-extension) to automatically format the code on save.

If you prefer to use [Prettier](https://prettier.io/), you may include a `.prettierrc` file in the root of the project.
The file will be ignored by git.
To achieve the same formatting as the current settings in [deno.json](./deno.json), you can use the following configuration:

```json
{
  "endOfLine": "auto",
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all"
}
```

The linter used is also the Deno built-in linter, which can be run using the `deno task lint` command (which is really just `deno lint --fix`).

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

Try to make sure the code is formatted correctly, as specified in the [Code style](#code-style) section. A GitHub Action will automatically check this for you when you open a pull request. You can make sure that everything is formatted correctly by running the `deno task fmt` command.

Please make sure to use [semantic commit messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) to keep the commit history clean and readable.

## License

This project is licensed under the [MIT license](./LICENSE).
