import fs from "fs";
import { compileAndRun } from "./ScrapeScript.js";
import { testConfig } from "./tests/testConfig.js";


// WARNING!! testConfig.js IS GITIGNORED AS IT IS CONSIDERED TO BE USER-SPECIFIC!
// IN ORDER TO RUN THIS CONFIGURATION OF ScrapeScript, DOWNLOAD THE KAUPPALEHTI
// WEBPAGE AS AN HTML-FILE AND CREATE THE FOLLOWING FILE
// src/tests/testConfig.js : 
// 
// export const testConfig = {
//   scraper: "test2.ss",
//   dataset: "path to the downloaded Kauppalehti webpage"
// }

const testFolder = process.cwd() + "\\tests\\";
const ssFile = testFolder + testConfig.scraper;

const now = performance.now();
const readFile = fs.readFileSync(testConfig.dataset).toString();

const result = compileAndRun(ssFile, readFile);
console.log("Compiled and executed in :" + (performance.now() - now) + " ms.");
console.log(result);
