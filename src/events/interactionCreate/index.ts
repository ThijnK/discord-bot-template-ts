import commands from "./commands.ts";
import help from "./help.ts";
import pagination from "./pagination.ts";

const events = [commands, help, pagination];

export default events;
