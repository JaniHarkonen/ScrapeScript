import { getArgument, print, floor, round, ceil, random, sqrt, max, min, abs, sign, clamp, indexOf, lastIndexOf, substring, length, parseNumber, parseBoolean, push, pop, remove, insert, shift, unshift, concat, replace, replaceAll, split, typeOf, isNaN, keys, stringify, includes, combine, stringify, timeNow } from "./STD.js";

function findNextTag(str, start, tag, nth) {
  let cursorPosition = start;

  for( let i = 0; i < nth; i++ )
  {
    cursorPosition = indexOf(str, tag, cursorPosition) + 1;
    
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
    cursorPosition: cursorPosition - 1 + length(tag)
  };
};


function copyBetweenTags(str, start, startTag, endTag) {
  let startCursorPosition = start;

  if( typeOf(startTag) == "array" )
  {
    for( let i = 0; i < length(startTag); i++ )
    {
      const tag = startTag[i];
      const nextTag = findNextTag(str, startCursorPosition, tag, 1);
      startCursorPosition = nextTag.cursorPosition;
      
      if( startCursorPosition < 0 )
      { break; }
    }
  }
  else
  {
    const nextStartTag = findNextTag(str, startCursorPosition, startTag, 1);
    startCursorPosition = nextStartTag.cursorPosition;
  }

  if( startCursorPosition < 0 )
  { return { copiedString: null }; }

  let nextTag = findNextTag(str, startCursorPosition, endTag, 1);
  let copiedString = substring(str, startCursorPosition, nextTag.tagPosition);

  return {
    copiedString: copiedString,
    cursorPosition: nextTag.cursorPosition
  };
}

const INPUT = getArgument(0);
const output = {
  symbols: [],
  errors: []
};

let cursor = indexOf(INPUT, "Päivitetty", 1);
let copy = null;
const tag = '<a href="https://www.kauppalehti.fi/porssi/porssikurssit/osake/';
while( true )
{
  let stockSymbol = '';
  let companyName = '';
  let pricePerShare = '';
  let volume = '';

  copy = copyBetweenTags(INPUT, cursor, tag, '"');
  
  if( copy.copiedString == null )
  { break; }

  stockSymbol = copy.copiedString;
  cursor = copy.cursorPosition;

  copy = copyBetweenTags(INPUT, cursor, ['>', '>'], '<');
  companyName = copy.copiedString;
  cursor = copy.cursorPosition;

  copy = copyBetweenTags(INPUT, cursor, ['<span class="', '>'], '<');
  pricePerShare = copy.copiedString;
  cursor = copy.cursorPosition;

  const columnSkip = findNextTag(INPUT, cursor, '<span class="', 4);
  cursor = columnSkip.cursorPosition;

  let attempts = 0;
  while( true )
  {
    copy = copyBetweenTags(INPUT, cursor, '>', '<');

    if( copy.copiedString == '' )
    {
      cursor = lastIndexOf(INPUT, '<span class="', cursor - 2);
      continue;
    }

    volume += copy.copiedString;

    const volumeEnd = findNextTag(INPUT, copy.cursorPosition, '>', 1);
    cursor = volumeEnd.cursorPosition;
    attempts++;

    if( charAt(INPUT, cursor) == "&" )
    { break; }

    if( attempts >= 10 )
    {
      push(output.errors, "ERROR: Unable to scrape the 'volume' information of stock: '" + companyName + "' at index: " + length(output.symbols));
      break;
    }
  }

      // Symbol has been scraped -> push
  const symbol = {
    companyName: companyName,
    stockSymbol: stockSymbol,
    pricePerShare: parseNumber(replace(pricePerShare, ",", ".")),
    volume: parseNumber(replace(volume, ",", "."))
  };

  push(output.symbols, symbol);
}

yield output;