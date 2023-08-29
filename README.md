# ScrapeScript v.1.0.0

ScrapeScript is a small scripting language that was designed to be bundled with DumpEm Suite where it is used for writing
website scrapers. Because the websites that DumpEm Suite scrapes information from change rather frequently, an update – as 
well as a new build of the application – would have to be issued each time the scraper would become obsolete. To solve this
issue, ScrapeScript was developed. Now, only the source code of the scraper needs to be updated along with the DumpEm Suite
scraper configuration.

The current version – v.1.0.0 – of ScrapeScript is rather crude suffering from many design and performance issues as well as
bugs, however, it has proven to be functional enough to write even complex scrapers with. The language itself is powered by
JavaScript, and thus, shares many similarities, including dynamic types, JSONs, functions and the ability to store functions 
in variables along with all the basic structures found in programming languages, such as loops, if- and switch-statements, 
recursion, imports, arrays and complex expressions. The language is centered around scrapes and, as such, provides built-in
functions for string, JSON and array handling. ScrapeScript is a procedural language although functional programming is 
technically possible, at least to some extent.

A full re-write is to be expected later on as this project serves as more of an experiment in writing a scripting language
with the complex features of a procedural programming language rather than a good stand-alone project due to its many 
issues.

## Updates

Version 1.0.0 has now been released which comes with the following features:
