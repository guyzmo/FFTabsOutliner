var dir = require('tools').dir;
var TNode = require('tree');

//require("sdk/tabs").on("ready", logURL);
 
var self = require("self")

var tabs = require('sdk/tabs');
var windows = require('sdk/windows');
var widgets = require("sdk/widget");

var winutils = require('sdk/window/utils');
var tabutils = require('sdk/tabs/utils')

// one and only global
var tabTree = {}
var TOPane

function createTOPane(tree) {
    console.log("creation of TOPane")
        return winutils.open(self.data.url("panel.html"),
                { name: "Tab Outliner",
                    features: {
                        left: 0,
                        top: 0,
                        width: 200,
                        height: 600,
                        menubar: false,
                        resizable: true,
                        toolbar: false,
                        location: false,
                        personalbar: false,
                        status: false,
                        scrollbars: false,
                        dialog: true
                    }});
}

function refreshTOPane(tree, pane) {
    console.log("refreshing TOPane")
    if (pane.document === undefined) {
        if (pane === undefined) {
            console.log("Pane not activated");
            return;
        }
        console.log("Pane has no document");
        return;
    }
    var tabTree = pane.document.getElementById('tabTree');
    while (tabTree.hasChildNodes() ) {
        tabTree.removeChild(tabTree.firstChild);
    }

    for (var widx in tree) {
        var win_elt = pane.document.createElement("li");
        win_elt.innerHTML = "window " + widx
        var tabs_elt = pane.document.createElement("ul");

        for (var tidx in tree[widx]) {
            var tab = tree[widx][tidx];
            var tab_elt = pane.document.createElement("li");
            tab_elt.innerHTML = "<img src='"+tab.favicon+"' />" + tab.title + " <" + tab.url + ">";
            tabs_elt.appendChild(tab_elt);
        }
        
        win_elt.appendChild(tabs_elt);
        tabTree.appendChild(win_elt);
    }


}
            else
                console.log("    Tab #"+ tidx + ": " + tree[win][tidx].title);
        }
    }
}

console.log("Initiates whole tree");

// initiates the tree

tabs.on('open', function(tab) {
    pushTabInTree(tab, tabTree);
});
tabs.on('close', function(tab) {
    delTabFromTree(tab, tabTree);
});
tabs.on('ready', function(tab) {
    refreshTOPane(tabTree, TOPane);
});
tabs.on('activate', function(tab) {
    refreshTOPane(tabTree, TOPane);
});
tabs.on('deactivate', function(tab) {
    refreshTOPane(tabTree, TOPane);
});



//var winutils = require("window/utils")
//var tabutils = require("tabs/utils")
//var windowDelegate = {
//  onTrack: function (window) {
//    if (winutils.isBrowser(window)) {
//        console.log("tracking a window: " + window.title);
//    }
//  },
//  onUntrack: function (window) {
//    if (winutils.isBrowser(window)) {
//        console.log("Untracking a window: " + window.title);
//    }
//  }
//};
//
//var tabsDelegate = {
//    onTrack: function (tab) {
//        console.log("tracking a tab: " + tab + " from window " + tabutils.getOwnerWindow(tab));
//        tabTree[tabutils.getOwnerWindow(tab)].push(tab);
//    },
//    onUntrack: function (tab) {
//        console.log("Untracking a tab: " + tab);
//        idx = tabTree[tabutils.getOwnerWindow(tab)].indexOf(tab);
//        tabTree.splice(idx,1);
//    }
//};
//
//;
//var tracker = new require("window-utils").WindowTracker(windowDelegate);
//var tabtracker = new require("tab-browser").TabTracker(tabsDelegate)
