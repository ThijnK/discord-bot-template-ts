## To do

- README

## Getting started

## Environment variables

Environment variables are encapsulated in the `ENV` object, located in the `src/env.ts` file.
When adding a new environment variable, you should add it to the `ENV` object as well.
This will check that the environment variable is set, and throw an error if it is not.

You should provide at least the following environment variables:

- `BOT_TOKEN`: the token of your bot
- `TEST_GUILD`: the ID of the guild to register slash commands in during development

In case you want to use a separate bot token for development, you can provide it in the `TEST_TOKEN` environment variable.
If no `TEST_TOKEN` is provided, the `BOT_TOKEN` will be used for development as well.

If you want to use a database, you should also provide the following environment variables:
[...]

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
