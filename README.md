# Discord bot template

This is a template for a Discord bot written in TypeScript, using the [discord.js](https://discord.js.org/) library.

## Features

- [x] TypeScript
- [x] Slash commands
- [x] Event handlers
- [x] Built-in pagination
- [x] Automatic help command
- [x] Fancy logging
- [x] Easy handling of interaction IDs

## Getting started

To get started, create a new repository from this template, as explained in the [GitHub docs](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template).

Add the required environemnt variables, as explained in the [Environment variables](#environment-variables) section.
Then run the following commands to install the dependencies and start the bot:

```sh
npm i
npm run dev
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

## Commands

Commands are located in the [`src/commands`](./src/commands) folder. The [index.ts](./src/commands/index.ts) file exports all command categories, which is used to register them in the [`src/events/interactionCreate/commands.ts`](./src/events/interactionCreate/commands.ts) file.

Commands are grouped into _categories_, each of which has its own folder. The `index.ts` file in each folder exports the commands in that category and provides some metadata about the category, which includes at least the name of the category.

Each command gets its own file, and consists of a `meta` object, built using a `SlashCommandBuilder` from `discord.js`, and a `exec` function, which is called when the command is executed. This `exec` function is passed a context containing the bot client, a Logger instance (instantiated with the command name; see the [Logging](#logging) section), and the interaction itself.

A command file should look something like this:

```ts
import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';

const meta = new SlashCommandBuilder()
  .setName('example')
  .setDescription('Example command.');

export default command(meta, async ({ interaction }) => {
  return interaction.reply({
    ephemeral: true,
    content: 'Hello world!',
  });
});
```

A `/help` command is already provided in the [`src/commands/general/help.ts`](./src/commands/general/help.ts) file, which automatically generates an embed that allows for navigating through all of the commands and their descriptions, using the pagination functionality described in section [Pagination](#pagination).

## Events

## Logging

## Replies

## Pagination

## Interaction IDs

## Other utilities

- [`splitSend`](./src/utils/split.ts): split a a list of lines over multiple embeds, respecting Discord's embed description length limit
- [`chunk`](./src/utils/chunk.ts): split an array into chunks of a given size (jagged array / matrix)

## Database

If you wish to use a database, you can add a `src/client/db.ts` file, which exports a `db` object, and re-export it in [`src/client/index.ts`](./src/client/index.ts).
This `db` object should be imported in [`src/index.ts`](./src/index.ts) and passed to the `registerEvents` function.
In the `registerEvents` function (located in [`src/utils/event.ts`](./src/utils/event.ts)), you can then add it to the context for the event handlers, giving your commands and events access to the database.
Note that passing the database in the context like this is recommended over importing a database object in every file.

For example, the following snippet initializes a database connection using the `firebase-admin` package and would be added to the `src/client/db.ts` file:

```ts
const serviceAccount = JSON.parse(ENV.FIREBASE_SDK);

// Initialize Firebase with the realtime database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL,
});

export const db = admin.database();
```

## Server

If you need to run a server alongside the bot, for example to create an API which you can use to control the bot from a dashboard, you can add a `src/server` folder.
Create an `index.ts` file in this folder, and add the following snippet to run an Express server:

```ts
import express from 'express';
import { log } from '../utils';
import { ENV } from '../env';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(process.env.PORT || 3000, () => {
  log.system('server', 'Listening on port 3000!');
});
```

In this snippet, you can access the bot client by importing it from [`src/client/index.ts`](./src/client/index.ts).
The process.env.PORT environment variable is usually provided by the hosting service, such as Heroku, and defaults to 3000 if not provided.

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

## Future work

- [ ] Add support for running an express server (separate /src/server folder, with subfolders for routes, middleware, etc.)

```

```
