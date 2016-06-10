/*jslint browser:true, nomen: true */
/*global mx, define, require, console, logger, MutationObserver */
/*
    TemplateGridSingleItemWidget
    ========================

    @file      : TemplateGridSingleItemWidget.js
    @version   : 1.0
    @author    : Marcel Groeneweg
    @date      : Sat, 16 Jan 2016 13:22:56 GMT
    @copyright : 
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/query",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/event"
], function (declare, _WidgetBase, dom, dojoQuery, dojoStyle, dojoClass, dojoArray, dojoLang, dojoEvent) {
    "use strict";

    // Declare widget"s prototype.
    return declare("TemplateGridSingleItemWidget.widget.TemplateGridSingleItemWidget", [ _WidgetBase ], {

        // DOM elements
        inputNodes: null,
        colorSelectNode: null,
        colorInputNode: null,
        infoTextNode: null,

        // Parameters configured in the Modeler.
        newButtonClass: "",
        editButtonClass: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        observer: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            // Uncomment the following line to enable debug messages
            //logger.level(logger.DEBUG);
            logger.debug(this.id + ".constructor");
            this._handles = [];
            this.observer = new MutationObserver(dojoLang.hitch(this, this.handleObserverEvent));
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            this._updateRendering();
            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering();

            callback();
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        },

        // We want to stop events on a mobile device
        _stopBubblingEventOnMobile: function (e) {
            logger.debug(this.id + "._stopBubblingEventOnMobile");
            if (typeof document.ontouchstart !== "undefined") {
                dojoEvent.stop(e);
            }
        },

        // Attach events to HTML dom elements
        _setupEvents: function () {
            logger.debug(this.id + "._setupEvents");

        },

        // Rerender the interface.
        _updateRendering: function () {
            logger.debug(this.id + "._updateRendering");
            
            var templateGrid,
                thisObj = this;
            
            if (this.domNode.previousSibling) {
                templateGrid = this.domNode.previousSibling;
                if (!dojoClass.contains(templateGrid, "mx-templategrid")) {
                    console.warn("TemplateGridSingleItemWidget: Previous sibling is not a template grid");
                    return;
                }
            } else {
                console.warn("TemplateGridSingleItemWidget: No previous sibling found");
                return;
            }
			
            this.observer.disconnect();
            dojoQuery("div.mx-templategrid-content-wrapper", templateGrid).forEach(function (node, index, arr) {
                console.dir(node);
                thisObj.observer.observe(node, { attributes: false, childList: true, characterData: false });
            });

        },
        
        handleObserverEvent: function (mutations) {

            var isEmptyGrid,
                thisObj = this;

            mutations.forEach(function (mutation) {
                console.dir(mutation);
                isEmptyGrid = false;
                dojoQuery("div.mx-templategrid-empty", mutation.target).forEach(function (node, index, arr) {
                    console.dir(node);
                    isEmptyGrid = true;
                });
                
                // The buttons are children of the template grid, not the reported node. 
                // We can only get here when it has been confirmed that the previous sibling is a template grid.

                dojoQuery("." + thisObj.newButtonClass, thisObj.domNode.previousSibling).forEach(function (node, index, arr) {
                    console.dir(node);
                    if (isEmptyGrid) {
                        dojoStyle.set(node, "display", "inline-block");
                    } else {
                        dojoStyle.set(node, "display", "none");
                    }
                });

                dojoQuery(" ." + thisObj.editButtonClass, thisObj.domNode.previousSibling).forEach(function (node, index, arr) {
                    console.dir(node);
                    if (isEmptyGrid) {
                        dojoStyle.set(node, "display", "none");
                    } else {
                        dojoStyle.set(node, "display", "inline-block");
                    }
                });
            });
            
        },

        // Reset subscriptions.
        _resetSubscriptions: function () {
            logger.debug(this.id + "._resetSubscriptions");
            // Release handles on previous object, if any.
            if (this._handles) {
                dojoArray.forEach(this._handles, function (handle) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }

            // When a mendix object exists create subscribtions.
            if (this._contextObj) {
                var objectHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojoLang.hitch(this, function (guid) {
                        this._updateRendering();
                    })
                });

                this._handles = [ objectHandle ];
            }
        }
    });
});

require(["TemplateGridSingleItemWidget/widget/TemplateGridSingleItemWidget"], function () {
    "use strict";
});
