import { category } from "utils";
import ping from "./ping.ts";

export default category(
  { name: "Debug", description: "Commands used for debugging.", emoji: "🐛" },
  [ping]
);
