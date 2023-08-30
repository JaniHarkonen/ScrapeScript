import generate from "./src/compiler/generator.js";
import Executable from "./src/interpreter/Executable.js";
import execute from "./src/interpreter/interpreter.js";
import link from "./src/parser/linker.js";

/**
 * Compiles a given ScrapeScript source file into an `Executable`-
 * instance that can then be interpreted.
 * 
 * @param {String} sourceFile Path to the file that is to be 
 * compiled.
 * 
 * @returns An `Executable` that can be interpreted by the 
 * ScrapeScript interpreter.
 */
export const compileFile = (sourceFile) => {
  const ast = link(sourceFile);
  const program = generate(ast);
  
  return new Executable(program);
};

/**
 * Compiles a ScrapeScript source file and begins interpreting
 * the resulting `Executable`. Arguments can also be passed onto
 * the program that it can then utilize during execution.
 * 
 * @param {String} sourceFile Path to the file that is to be 
 * compiled and ran.
 * @param  {...any} programArguments Program arguments to be 
 * passed onto the program.
 * 
 * @returns The result yielded by the program or `undefined` if
 * `yield` was not called.
 */
export const compileAndRun = (sourceFile, ...programArguments) => {
  const executable = compileFile(sourceFile);
  return execute(executable, programArguments);
};
