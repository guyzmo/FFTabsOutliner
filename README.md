The Tabs Outliner Addon for Firefox
===================================

This addon aims to implement for firefox the feature provided by
the [TabsOutliner plugin](https://chrome.google.com/webstore/detail/tabs-outliner/eggkanocgddhmamlbiijnphhppkpkmkl) in Chromium.

Here is a screenshot of what it looks like at the time of the first
revision in this repository:

![Tabs Outliner Screenshot](http://m0g.net/TabsOutliner20120213.png)

For the time being it is only a work in progress. That plugin is
aimed to be compatible with Firefox 18+, and uses the jetpack/addon
API. 

TODO
----
 * `[x]` refresh the tree on every window and tabs events (new, close, ready, refresh, 
     tab movement...), _(in v0.4)_ 
 * `[#]` select, open/close, destroy support from the tabs outliner panel,
 * `[ ]` create new level of tree when opening tabs from a tab,
 * `[ ]` drag and drop support for the tabs in the tree,
 * `[ ]` better UI style,
 * `[ ]` sidebar integration

If you want a taboutliner for firefox, don't hesitate to help me 
implement that plugin and send patches!

How to test it and hack
=======================

Download the SDK over [the addons page at Mozilla's](https://addons.mozilla.org/en-US/developers/builder).
Follow the instructions over there, i.e.:

```
    % wget https://ftp.mozilla.org/pub/mozilla.org/labs/jetpack/jetpack-sdk-latest.zip
    % unzip jetpack-sdk-latest.zip
    % cd addon-sdk-1.13.1
    % source bin/activate
    % git clone https://github.com/guyzmo/FFTabsOutliner.git
    % cd FFTabsOutliner
    % cfx run
```

Code tree
=========

```
.
|-- README.md ............  this file
|-- data .................  data resources included with the addon
|   |-- images ...........  images included
|   |   `-- favicon.ico ..  a logo I have drawn and rendered using gimp, 
|   |                           beautiful, isn't it ? :-)
|   |-- panel.html .......  the tabs outliner panel base DOM
|   |-- screen.css .......  the tabs outliner panel's style
|   `-- tree .............  the 'tree' JS module used to render the window/tabs tree
|-- doc ..................  documentation folder: to be written ;-)
|   `-- main.md
|-- lib ..................  directory containing all the JS code
|   |-- main.js ..........  entry point for the javascript module
|   |-- tools.js .........  simple utils for object introspection, useful to dig through the APIs
|   `-- tree.js ..........  implementation of a N-Tree in javascript
|-- package.json .........  package specification
`-- test .................  tests: to be written
    `-- test-main.js .....  bunch of tests for the tree.js file, that is failing

```

