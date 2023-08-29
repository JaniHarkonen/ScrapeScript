import fs from "fs";
import { compileFile } from "./ScrapeScript.js";
import execute from "./src/interpreter/interpreter.js";


const testFolder = process.cwd() + "\\tests\\";
const ssFile = testFolder + "test2.ss";

const now = performance.now();
const readFile = fs.readFileSync("D:\\javascript\\ScrapeScript\\src\\tests\\stocks4.html").toString();
const result = execute(compileFile(ssFile), readFile);
console.log("Compiled and executed in :" + (performance.now() - now) + " ms.");
console.log(result);
//fs.writeFileSync("D:\\javascript\\sketching\\parsers-again\\letsgo\\tests\\dump.json", JSON.stringify(result, null, 2));

/**
 * This function takes in a Kauppalehti page as an HTML-string
 * and scrapes all stock information available in the stock
 * listings. The stocks will be arranged in the order that they
 * are scraped from the HTML-string.
 * 
 * Options:
 * - logErrors : (Boolean) Whether errors should be printed in
 *   the output JSON.
 * - form : (JSON) A mapping of stock information fields to
 *   desired ones.
 * 
 * Following information will be scraped:
 * - company name
 * - stock symbol
 * - current price per share (€)
 * - volume (€)
 * 
 * @param {String} fileString HTML-string representing a Kauppalehti-site.
 * @param {JSON} options Contains a JSON outlining options that will influence
 * the form of the output JSON.
 * @returns An array of stocks scraped from the website. If the HTML-string
 * is NULL, the function will return NULL as well.
 */
export default function scraper(fileString, options = null) {
    
  /**
   * Finds a tag from a given string starting at a given index and advances
   * a cursor to the tag's index providing also the index where the tag ends.
   * 
   * nth allows the skipping of similar tags so that only the n:th tag will
   * be the one whose indices will be returned.
   * 
   * @param {String} str String to search the tag in.
   * @param {Integer} start Index from which to begin the search.
   * @param {String} tag Tag to search.
   * @param {Integer} nth Number of similar tags to skip.
   * 
   * @returns A JSON containing the position of the tag and the tag's ending.
   */
  const findNextTag = (str, start, tag, nth = 1) => {
      let cursorPosition = start;

      for( let i = 0; i < nth; i++ )
      {
          cursorPosition = str.indexOf(tag, cursorPosition) + 1;
          
              // Couldn't find the position of a tag, return all -1s
          if( cursorPosition - 1 < 0 )
          {
              return {
                  tagPosition: -1,
                  cursorPosition: -1
              };
          }
      }

      return {
          tagPosition: cursorPosition - 1,
          cursorPosition: cursorPosition - 1 + tag.length
      };
  };

  /**
   * Copies a substring between two given tags; the start tag and the
   * end tag. An array of start tags can also be provided, in which
   * case the final tag will act as the start tag while the other tags
   * will be found first before arriving at the final start tag. This
   * is useful when certain tags must be encountered before a valid
   * start tag.
   * 
   * @param {String} str String to copy from.
   * @param {Integer} start Index from which to begin the search for
   * start tag.
   * @param {*} startTag Tag from which to start copying.
   * @param {String} endTag Tag that signifies the end of copying (excluded).
   * 
   * @returns A JSON containing the copied string and the index immediately
   * after the copied string.
   */
  const copyBetweenTags = (str, start, startTag, endTag) => {
      let startCursorPosition = start;

          // Find the ending position (index) of the start tag
      if( startTag instanceof Array )
      {
              // The end of the start tag may be found at the end of a tag sequence
          for( let tag of startTag )
          {
              startCursorPosition = findNextTag(str, startCursorPosition, tag).cursorPosition;
              
              if( startCursorPosition < 0 )
              break;
          }
      }
      else
      startCursorPosition = findNextTag(str, startCursorPosition, startTag).cursorPosition;

          // The start tag couldn't be found, return null as the copied string
      if( startCursorPosition < 0 )
      return { copiedString: null };

          // Find the starting position of the end tag and copy the
          // contents between start and end tags
      let nextTag = findNextTag(str, startCursorPosition, endTag);
      let copiedString = str.substring(startCursorPosition, nextTag.tagPosition);

      return {
          copiedString: copiedString,
          cursorPosition: nextTag.cursorPosition
      };
  }

      // The actual main function
  const scrape = (fileString, options) => {
      const output = {
          symbols: [],
          errors: []
      };

      let cursor = fileString.indexOf("Päivitetty");  // Starting from here ensures that only stock listings will be encountered
      let copy = null;                                // Last string that was copied from the HTML-string
      const tag = '<a href="https://www.kauppalehti.fi/porssi/porssikurssit/osake/';    // Beginning of a scrapeable stock
      
      while( true )
      {
          let stockSymbol = '';       // Ticker symbol
          let companyName = '';       // Company name
          let pricePerShare = '';     // Price/share (€, stored as a number)
          let volume = '';            // Volume (€, stored as a number)

              // Attempt to read a stock symbol
              // Exit if no more stocks present
          copy = copyBetweenTags(fileString, cursor, tag, '"');
          
          if( copy.copiedString === null )
          break;

          stockSymbol = copy.copiedString;
          cursor = copy.cursorPosition;

              // Read company name
          copy = copyBetweenTags(fileString, cursor, ['>', '>'], '<');
          companyName = copy.copiedString;
          cursor = copy.cursorPosition;

              // Read price per share
          copy = copyBetweenTags(fileString, cursor, ['<span class="', '>'], '<');
          pricePerShare = copy.copiedString;
          cursor = copy.cursorPosition;

              // Skip a column (consisting of 4 identifiable elements)
          cursor = findNextTag(fileString, cursor, '<span class="', 4).cursorPosition;

              // Read volume
          let attempts = 0;
          while( true )
          {
              copy = copyBetweenTags(fileString, cursor, '>', '<');

              if( copy.copiedString === '' )
              {
                  cursor = fileString.lastIndexOf('<span class="', cursor - 2);
                  continue;
              }

              volume += copy.copiedString;
              cursor = findNextTag(fileString, copy.cursorPosition, '>').cursorPosition;
              attempts++;
          
                  // End of volume string
              if( fileString.charAt(cursor) === "&" )
              break;

                  // Log an error if number of scrapes for the volume is too high and
                  // options allow it
              if( attempts >= 10 )
              {
                  output.errors.push("ERROR: Unable to scrape the 'volume' information of stock: '" + companyName + "' at index: " + output.symbols.length);
                  break;
              }
          }

              // Symbol has been scraped -> push
          let symbol = {
              companyName,
              stockSymbol,
              pricePerShare: parseFloat(pricePerShare.replace(",", ".")),
              volume: parseFloat(volume.replace(",", "."))
          };
          
          output.symbols.push(symbol);
      }

      return output;
  }

  return scrape(fileString, options);
}

const nownow = performance.now();
//const something = scraper(readFile);
//console.log("Compiled and executed in :" + (performance.now() - nownow) + " ms.");
//fs.writeFileSync("D:\\javascript\\sketching\\parsers-again\\letsgo\\tests\\dump2.json", JSON.stringify(something, null, 2));