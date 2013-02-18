/*
 * Tabs Outliner Addon for Firefox
 * Copyright (C)2013, Bernard `Guyzmo` Pratz <tabsoutliner at m0g dot net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict'

const { dir, getClass } = require('tools');

var TNode = require('tree');

var self = require("self")

var tabs = require('sdk/tabs');
var windows = require('sdk/windows');
var widgets = require("sdk/widget");

var events = require("sdk/system/events");

var winutils = require('sdk/window/utils');
var tabutils = require('sdk/tabs/utils');

var tabsObserver = require("sdk/tabs/observer").observer;


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
                                          }
                                        }
                                    );
    }

    this.isActive = function() {
        if (this.pane === undefined) { console.log("Pane not activated"); return false; }
        if (this.pane.document === undefined) { console.log("Pane has no document"); return false; }
        return true;
    }

    this.reset = function() {
        //console.log("resetting TOPane");
        if (! this.isActive())
            return false;
        var domTree = this.pane.document.getElementById('tabTree');
        if (! domTree)
            return false;
        while (domTree.hasChildNodes() ) {
            domTree.removeChild(domTree.firstChild);
        }
        return true;
    }

    this.update = function() {
        //console.log ("TabsOutlinerPane.update");
        if (!this.reset())
            return false;

        var walk = function (tree, domRoot, idxRoot) {
            if (tree.content === null) 
                tree.content = "root";

            // for each child of current node
            tree.children.forEach(function(node, idx, siblings) {
                var liElt = this.pane.document.createElement("li");
                var spanElt = this.pane.document.createElement("span");
                var spanClass = [];
                var liClass = [];
                var that = this;
                if (node.children.length == 0) {
                    liElt.onmouseover = function() {
                        try {
                            // if menu is on, remove it before creating a new one
                            var container = that.pane.document.getElementById('hovering_menu');
                            if (container !== null)
                                container.parentNode.removeChild(container);

                            // create the containers for the menu
                            var container = that.pane.document.createElement('span');
                            var panel = that.pane.document.createElement('span');
                            var expand = that.pane.document.createElement('div');
                            var close_btn = that.pane.document.createElement('span');

                            close_btn.onclick = function() {windows.browserWindows[idxRoot].tabs[idx].close()};

                            container.id = 'hovering_menu';
                            container.className = 'hovering_menu_container';
                            panel.className = 'hovering_menu_panel';
                            expand.className = 'hovering_menu_expand';

                            close_btn.className = 'hovering_menu_close';
                            close_btn.id = 'hovering_menu_close_action';

                            panel.appendChild(expand);
                            panel.appendChild(close_btn);
                            container.appendChild(panel);
                            liElt.appendChild(container);
                        } catch (err) {
                            console.log("EXCEPTION THROWED IN PANEL!");
                            console.log(err);
                        }
                    }

                    spanClass.push('tab');
                    var favicon = "chrome://mozapps/skin/places/defaultFavicon.png";

                    liElt.id = idxRoot + "." + idx;

                    if (node.content.linkedBrowser.contentWindow.isLoading == true)
                        favicon = "chrome://global/skin/icons/loading_16.png";
                    else if (node.content.image)
                        favicon = node.content.image;

                    if (node.content.selected)
                        spanClass.push( 'active' );

                    if (node.content.pinned == true)
                        liClass.push( 'pinned' );

                    if (tree.children.indexOf(node) == tree.children.length-1)
                        liClass.push( 'last' );

                    liElt.className = liClass.join(" ");
                    spanElt.ondblclick = function() { 
                        windows.browserWindows[idxRoot].activate();
                        windows.browserWindows[idxRoot].tabs[idx].activate();
                    };
                    spanElt.innerHTML = "<img class='favicon' src='"+ favicon +"' />"
                                                 + tabutils.getTabTitle(node.content);
                    spanElt.className = spanClass.join(" ");
                    liElt.appendChild(spanElt);
                } else {
                    var ulElt = this.pane.document.createElement("ul");
                    var divElt = this.pane.document.createElement("div");
                    var divClass = ["hitarea", "collapsable-hitarea"];
                    var titleDivElt = this.pane.document.createElement("div");
                    var titleDivClass = [];
                    var icon;
                    titleDivElt.onmouseover = function() {
                        try {
                            // if menu is on, remove it before creating a new one
                            var container = that.pane.document.getElementById('hovering_menu');
                            if (container !== null)
                                container.parentNode.removeChild(container);

                            // create the containers for the menu
                            var container = that.pane.document.createElement('span');
                            var panel = that.pane.document.createElement('span');
                            var expand = that.pane.document.createElement('div');
                            var close_btn = that.pane.document.createElement('span');

                            close_btn.onclick = function() {windows.browserWindows[idx].close()};

                            container.id = 'hovering_menu';
                            container.className = 'hovering_menu_container';
                            panel.className = 'hovering_menu_panel';
                            expand.className = 'hovering_menu_expand';

                            close_btn.className = 'hovering_menu_close';
                            close_btn.id = 'hovering_menu_close_action';

                            panel.appendChild(expand);
                            panel.appendChild(close_btn);
                            container.appendChild(panel);
                            this.appendChild(container);
                        } catch (err) {
                            console.log("EXCEPTION THROWED IN PANEL!");
                            console.log(err);
                        }
                    }

                    liClass.push("collapsable");
                    liElt.id = idx;

                    if (node.content.image)
                        icon = node.content.image;
                    else
                        icon = self.data.url("images/firefox-small.png");

                    if (node.content === winutils.getMostRecentBrowserWindow())
                        spanClass.push('active');

                    if (tree.children.indexOf(node) == tree.children.length-1) {
                        liClass.push("lastCollapsable");
                        divClass.push("last");
                        divClass.push("lastCollapsable-hitarea");
                    }

                    liElt.className = liClass.join(" ");
                    spanElt.className = spanClass.join(" ");
                    divElt.className = divClass.join(" ");
                    titleDivElt.className = titleDivClass.join("");

                    spanElt.ondblclick = function() { 
                        windows.browserWindows[idx].activate();
                    };
                    spanElt.innerHTML = "<img class='favicon' src='"+ icon +"' />"+ getClass(node.content)+"</span>"; 

                    liElt.appendChild(divElt);
                    titleDivElt.appendChild(spanElt);
                    liElt.appendChild(titleDivElt);

                    walk(node, ulElt, liElt.id);
                    liElt.appendChild(ulElt);
                }
                domRoot.appendChild(liElt);
            }, that);
        }
        var domTree = this.pane.document.getElementById('tabTree');
        walk (this.tree, domTree, 0);
    }

}

var EventHandler = function (topane) {
    console.log("EventHandler()");

    var that = this;
    this.update = function (ev) {
        if (ev === undefined)
            console.log("EventHandler.update(?)");
        else {
            console.log("EventHandler.update("+ev.type+","+ev.subject+","+ev.data+")");
            if (ev.type == "StartDocumentLoad")
                ev.subject.isLoading = true;
            if (ev.type == "EndDocumentLoad")
                ev.subject.isLoading = false;
        }
        topane.tree.clear();
        winutils.windows().forEach(
            function(win, idx, l) {
                if (winutils.isBrowser(win)) {
                    if (!(this.tree.has(win))) {
                        this.tree.add(win);
                        tabutils.getTabs(win).forEach(
                            function(tab, idx, l) {
                                if (!this.tree.get(win).has(tab) && !tab.closing)
                                    this.tree.get(win).add(tab);
                            }, topane
                        );
                    }
                }
            }, topane
        );
        topane.update();
    }   

    var widget = widgets.Widget({
        id: "tabs-outliner-link",
        label: "Tabs Outliner for Firefox",
        contentURL: self.data.url("images/favicon.ico"),
        onClick: function() {
            if (topane.pane === undefined) {
                topane.open();
                that.update();
            } else {
                topane.tree.print();
            }
        }
    });

    events.on('chrome-document-global-created', this.update );
    events.on('xul-window-registered', this.update );
    events.on('xul-window-visible', this.update );
    events.on('xul-window-destroyed', this.update );
    events.on('StartDocumentLoad', this.update);
    events.on('EndDocumentLoad', this.update);

    tabs.on("open", function()           { that.update({type: 'open', subject: '', data: ''}) });
    tabs.on("close", function()          { that.update({type: 'close', subject: '', data: ''}) });
    tabs.on("pinned", function()         { that.update({type: 'pinned', subject: '', data: ''}) });
    tabs.on("unpinned", function()       { that.update({type: 'unpinned', subject: '', data: ''}) });
    tabsObserver.on("move", function()   { that.update({type: 'move', subject: '', data: ''}) });
    tabsObserver.on("select", function() { that.update({type: 'select', subject: '', data: ''}) });
    
};

let start = function() {
    new EventHandler( new TabsOutlinerPane(new TNode(null)) );
}
 
start();

