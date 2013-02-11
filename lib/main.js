var dir = require('tools').dir;
var TNode = require('tree');

var self = require("self")

var tabs = require('sdk/tabs');
var windows = require('sdk/windows');
var widgets = require("sdk/widget");

var winutils = require('sdk/window/utils');
var tabutils = require('sdk/tabs/utils');

var TabsOutlinerPane = function (tree) {
    this.tree = tree;
    this.pane = undefined;
    var that = this;

    this.open = function() {
        console.log("open TOPane");
        this.pane = winutils.open(self.data.url("panel.html"),
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

    this.isActive = function() {
        if (this.pane === undefined) { console.log("Pane not activated"); return false; }
        if (this.pane.document === undefined) { console.log("Pane has no document"); return false; }
        return true;
    }

    this.reset = function() {
        console.log("resetting TOPane");
        if (! this.isActive())
            return false;
        var domTree = this.pane.document.getElementById('tabTree');
        while (domTree.hasChildNodes() ) {
            domTree.removeChild(domTree.firstChild);
        }
        return true;
    }

    this.update = function() {
        console.log ("update TOPane");
        if (!this.reset())
            return false;

        var walk = function (tree, domRoot) {
            if (tree.content === null) 
                tree.content = "root";

            // for each child of current node
            for (var node in tree.children) {
                node = tree.children[node];
                var liElt = that.pane.document.createElement("li");
                if (node.children.length == 0) {
                    liElt.innerHTML = "<span>"+tabutils.getTabTitle(node.content)+"</span>";
                } else {
                    if (tree.children.indexOf(node) == (tree.children.length-1)) {
                        liElt.className = "last";
                    } else {
                        liElt.className = "collapsable";
                    }
                    liElt.innerHTML = "<div class='hitarea collapsable-hitarea'></div><span>"+node.content+"</span>"; 
                    var ulElt = that.pane.document.createElement("ul");
                    ulElt.style = "display: block";
                    walk(node, ulElt);
                    liElt.appendChild(ulElt);
                }
                domRoot.appendChild(liElt);
            }
        }
        var domTree = this.pane.document.getElementById('tabTree');
        walk (this.tree, domTree);
    }
    var widget = widgets.Widget({
        id: "tabs-outliner-link",
        label: "Tabs outliner",
        contentURL: self.data.url("images/favicon.ico"),
        onClick: function() {
            if (that.pane === undefined)
                that.open();
            else
                tree.print();
        }
    });


    var windowDelegate = {
        onTrack: function (win) {
            console.log("window.onTrack");
            if (winutils.isBrowser(win)) {
                console.log("tracking a window: " + win);
                if (!(that.tree.has(win))) {
                    console.log("win not in tabTree");
                    that.tree.add(win);
                    for (var index = 0; index < tabutils.getTabs(win).length; index++) {
                        var tab = tabutils.getTabs(win)[index];
                        if (!that.tree.get(win).has(tab))
                            that.tree.get(win).add(tab);
                    }
                }
            }
            that.tree.print();
            that.update();
        },
        onUntrack: function (win) {
            console.log("window.onUntrack");
            if (winutils.isBrowser(win)) {
                console.log("Untracking a window: " + win);
                for (var tab in win.getBrowser().tabContainer.tabbrowser.tabs) {
                    that.tree.get(win).del(tab);
                };
                that.tree.del(win);
            }
            that.tree.print();
            that.update();
        }
    };
    var tabsDelegate = {
        onTrack: function (tab) {
            console.log("tracking a tab: " + tab + " from window " + tabutils.getOwnerWindow(tab));
            var tabList = that.tree.get(tabutils.getOwnerWindow(tab));
            if (tabList)
                if (!tabList.has(tab))
                    tabList.add(tab);
            that.tree.print();
            that.update();
        },
        onUntrack: function (tab) {
            console.log("Untracking a tab: " + tab);
            var tabList = that.tree.get(tabutils.getOwnerWindow(tab));
            if (tabList) tabList.del(tab);
            that.tree.print();
            that.update();
        }
    };
    new require("window-utils").WindowTracker(windowDelegate);
    new require("tab-browser").TabTracker(tabsDelegate);

};

start = function() {
    new TabsOutlinerPane(new TNode(null));
}
 
start();

