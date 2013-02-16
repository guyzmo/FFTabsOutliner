The Tabs Outliner Addon for Firefox
===================================

This addon aims to implement for firefox the feature provided by
the [TabsOutliner plugin](https://chrome.google.com/webstore/detail/tabs-outliner/eggkanocgddhmamlbiijnphhppkpkmkl) in Chromium.

Here is a screenshot of what it looks like at the time of the first
revision in this repository:

![Tabs Outliner Screenshot](http://m0g.net/TabsOutliner20120216.png)

For the time being it is only a work in progress. That plugin is
aimed to be compatible with Firefox 18+, and uses the jetpack/addon
API. 

TODO
----
 * `[x]` refresh the tree on every window and tabs events (new, close, ready, refresh, 
     tab movement...), _(in v0.4)_ 
 * `[#]` _select_, open/_close_, destroy support from the tabs outliner panel, _(will be v0.5)_
 * `[ ]` drag and drop support for the tabs in the tree, _(should be v0.6)_
 * `[ ]` create new level of tree when opening tabs from a tab and support groups of windows, _(should be v0.7)_
 * `[ ]` session state saving support, _(might be v0.8)_
 * `[ ]` sidebar integration, _(may be v0.9)_
 * `[ ]` better UI style, _(may be v0.10)_
 * `[ ]` no bugs, no glitches _(v1.0)_

If you want a taboutliner for firefox, don't hesitate to help me 
implement that plugin and send patches!

How it works
============

As of version v0.4, the algorithm of the addon is far from being good.
At each event, it (re)builds a two level tree of all opened windows and tabs,
and (re)generates the DOM tree in the tabsoutliner tab.
Though, it is not time and space efficient, the result is still (astonishly) fast.

For v0.7, the algorithmic model might have to be rewritten to support a n-level
tree representing the tabs opened while browsing, and also the creation of groups
of windows.

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

License
=======

All the code of the addon is (c)2013, Bernard Guyzmo Pratz, under the WTFPL <http://wtfpl.net>.

Some images are borrowed from the Chromium Tabs Outliner Addon, for development purposes. If
the creator of those images does not want to share his images, I'll replace them before v1.0.

The tree script is [jquery-treeview](https://github.com/jzaefferer/jquery-treeview) under the MIT and GPL
licences. It will be certainly be replaced for v0.6 to have a more updated tree plugin, with enhanced drag'n drop support.

```
DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
Version 2, December 2004 

Copyright (C) 2004 Sam Hocevar <sam@hocevar.net> 

Everyone is permitted to copy and distribute verbatim or modified 
copies of this license document, and changing it is allowed as long 
as the name is changed. 

DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 

0. You just DO WHAT THE FUCK YOU WANT TO.
```


