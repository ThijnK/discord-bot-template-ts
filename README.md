## To do

- README

## Environment variables

You should provide at least the following environment variables:

- `BOT_TOKEN`: the token of your bot
- `TEST_GUILD`: the ID of the guild to register slash commands in during development

In case you want to use a separate bot token for development, you can provide a token to use during development in the `TEST_TOKEN` environment variable.
If no `TEST_TOKEN` is provided, the `BOT_TOKEN` will be used for development as well.

If you want to use a database, you should also provide the following environment variables:
[...]

## Future work

- [ ] Add support for running an express server (separate /src/server folder, with subfolders for routes, middleware, etc.)
