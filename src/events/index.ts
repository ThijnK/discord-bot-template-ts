import ready from './ready.ts';
import interactionCreate from './interactionCreate/index.ts';

const events = [...interactionCreate, ready];

export default events;
