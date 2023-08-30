import fs from "fs";
import { compileAndRun } from "./ScrapeScript.js";


const testFolder = process.cwd() + "\\tests\\";
const ssFile = testFolder + "test2.ss";

const now = performance.now();
const readFile = fs.readFileSync("D:\\javascript\\ScrapeScript\\src\\tests\\stocks4.html").toString();
const result = compileAndRun(ssFile, readFile);
console.log("Compiled and executed in :" + (performance.now() - now) + " ms.");
console.log(result);
//fs.writeFileSync("D:\\javascript\\sketching\\parsers-again\\letsgo\\tests\\dump.json", JSON.stringify(result, null, 2));
