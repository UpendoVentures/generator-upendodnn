'use strict';
define(['jquery', 'knockout'],
    function ($, ko) {
        var utility, resx, $panel, viewModel;

        var initViewModel = function () {
            viewModel = {
                resx: utility.resx["<%= friendlyName %>"]
            };
        };

        var fileExists = function (url) {
            return $.ajax({
                type: "HEAD",
                url: url,
                cache: true
            });
        };

        var loadScript = function (url, successCallback) {
            fileExists(url)
                .done(function () {
                    $.ajax({
                        dataType: "script",
                        cache: true,
                        url: url,
                        success: successCallback,
                        error: function () {
                            console.error(`${url} could not be loaded`);
                        }
                    });
                })
        };

        var loadCss = function (url) {
            fileExists(url)
                .done(function () {
                    $.ajax({
                        url: url,
                        success: function (data) {
                            $("head").append("<style>" + data + "</style>");
                        },
                        error: function () {
                            console.error(`${url} could not be loaded`);
                        }
                    });
                })
        };

        return {
            init: function (wrapper, util, params, callback) {
                utility = util;
                resx: utility.resx["<%= friendlyName %>"]
                $panel = wrapper;
                initViewModel();
                ko.applyBindings(viewModel, $panel[0]);

                loadScript("modules/<%= fullNamespace %>/scripts/chunk-vendors.js", function () {
                    loadScript("modules/<%= fullNamespace %>/scripts/app.js", function () {
                        loadCss("modules/<%= fullNamespace %>/css/chunk-vendors.css");
                        loadCss("modules/<%= fullNamespace %>/css/app.css");
                    });
                });

                if (typeof callback === 'function') {
                    callback();
                }
            },

            initMobile: function (wrapper, util, params, callback) { },

            load: function (params, callback) {
                if (typeof callback === 'function') {
                    callback();
                }
            },

            loadMobile: function (params, callback) { }
        };
    });
