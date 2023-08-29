import Compilation from "../Compilation.js";
import Snippet from "../Snippet.js";


export default function compileSingleInstruction(instruction) {
  const compilation = new Compilation();
  compilation.add(new Snippet(instruction));

  return compilation;
};
