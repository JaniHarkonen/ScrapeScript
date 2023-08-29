export default class Snippet {
  constructor(line = null, next = null, previous = null) {
    this.next = next;
    this.previous = previous;

    if( line )
    this.lines = [line];
    else
    this.lines = [];
  }

  attachNext(nextSnippet) {
    if( this.lines.length <= 0 )
    nextSnippet.previous = this.previous;
    else
    nextSnippet.previous = this;
    
    this.next = nextSnippet;
    return nextSnippet;
  }

  printLines() {
    for( const line of this.lines )
    console.log(line);

    if( this.next )
    this.next.printLines();
  }
}
