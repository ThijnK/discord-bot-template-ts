import example from './example.ts';

export const confirmationHandlers = {
  // NOTE: this is just an example handler to demonstrate the confirmation response
  // This handler is used by the `/confirm` command in `src/commands/debug/confirm.ts`
  'example': example,
  // Add more confirmation handlers here
};
