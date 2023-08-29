/**
 * Messages of the errors that may be thrown by any component of the ScrapeScript compiler.
 * The error messages of each component are placed under the appropriate field.
 * 
 * Some messages contain percentage-signs which are followed by a character or a word.
 * These are stand-ins for the variable values that will be pasted into the message when 
 * an error is thrown.
 */
export const ERRORS = {
  tokenizer: {
    errorPrefix: "TOKENIZER ERROR",
    missingQuote: "Reading string. Failed to find the end of a string starting at %f",
    extraDecimal: "Reading number. Number at %f has more than one decimal points!",
    numberIsNaN: "Reading number. Unable to read number at %f",
    unclosedComment: "Parsing multi-line comment. Comment starting at %f is never closed!"
  },
  parser: {
    errorPrefix: "PARSER ERROR",
    expression: {
      fieldNameExpected: "Expected a field name, received a token {%type, %value}!"
    },
    import: {
      pathExpected: "Filepath expected after 'import'!"
    },
    functionDeclaration: {
      bodyExpected: "Function body expected after function declaration!"
    },
    variableDeclaration: {
      initializationExpected: "Variable initialization expected before comma (,)!",
      initializeConstants: "Constants must be initialized upon declaration!",
      assignmentExpected: "Assignment expression expected after = in initialization!"
    },
    loop: {
      bodyExpected: "For loop body expected!"
    },
    makeJson: {
      fieldNameExpected: "JSON field name expected!",
      valueExpected: "JSON field value expected after field separator (:)!"
    },
    sequence: {
      itemExpected: "Expected an item before a sequence separator (,)!"
    },
    case: {
      bodyExpected: "Case-body expected!"
    }
  },
  compiler: {
    errorPrefix: "COMPILER ERROR",
    nonOperation: "Attempting to compile a non-operation!",
    variableAlreadyExists: "Memory: Trying to declare a variable that already exists: '%f'"
  },
  generator: {
    errorPrefix: "GENERATOR ERROR",
    nullASTNode: "Attempting to compile a null AST node!"
  },
  runtime: {
    errorPrefix: "RUNTIME ERROR",
    nullExecutable: "Trying to execute a null executable!",
    operations: {
      length: {
        typeMismatch: "Attempting to calculate length of a value that is not a string nor an array!"
      },
      parseNumber: {
        typeMismatch: "Attempting to parse a number from a value that is not a string!"
      },
      parseBoolean: {
        typeMismatch: "Attempting to parse a boolean from a value that is not a string!"
      }
    }
  }
};

export const throwFatalError = (component, error, formattings) => {
  if( formattings )
  {
    for( const f of Object.keys(formattings) )
    error = error.replaceAll("%" + f, formattings[f]);
  }

  throw Error(component["errorPrefix"] + ": " + error);
};
