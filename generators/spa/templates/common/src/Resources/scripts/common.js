var common = common || {};

common.Utils = function () {

    let get = function (httpMethod, action, service, params, success, fail, always) {
        let jqxhr = $.ajax({
            url: service.baseUrl + service.controller + "/" + action,
            beforeSend: service.framework.setModuleHeaders,
            type: httpMethod,
            async: true,
            data: httpMethod == "GET" ? "" : JSON.stringify(params),
            dataType: httpMethod == "GET" ? "" : "json",
            contentType: httpMethod == "GET" ? "" : "application/json; charset=UTF-8"
        }).done(function (data) {
            if (typeof (success) === "function") {
                success(data);
            }
        }).fail(function (error, exception) {
            if (typeof (fail) === "function") {
                fail(error, exception);
            }
        }).always(function () {
            if (typeof (always) === "function") {
                always();
            }
        });
    };

    let addRewriteQueryString = function (hash, decode) {
        let path = location.pathname;
        let queryString = path.substring(path.search("/ctl/") + 1);
        let keyValues = queryString.split("/");

        for (let i = 0; i < keyValues.length; i += 2) {
            hash[decode(keyValues[i])] = decode(keyValues[i + 1]);
        }
        return hash;
    };

    let getQueryStrings = function () {
        let assoc = {};
        let decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
        let queryString = location.search.substring(1);
        let keyValues = queryString.split("&");

        for (let i = 0; i < keyValues.length; i++) {
            let key = keyValues[i].split("=");
            if (key.length > 1) {
                assoc[decode(key[0])] = decode(key[1]);
            }
        }
        return addRewriteQueryString(assoc, decode);
    };

    let loading = function (icon, cssClass) {
        $(icon).toggleClass(cssClass).toggleClass("fa-refresh fa-spin");
    };

    return {
        get: get,
        getQueryStrings: getQueryStrings,
        addRewriteQueryString: addRewriteQueryString,
        loading: loading
    };
};


common.Alert = function () {

    let success = function (message) {
        message.redirect = typeof (message.redirect) !== "undefined" ? message.redirect : false;

        $("<div class='alert alert-success alert-panel' style='display:none;'>" + message.text + "</div>")
            .appendTo($(message.selector))
            .slideDown(800, function () {
                if (message.redirect) {
                    setTimeout(function () {
                        location.href = typeof (message.postBack) !== "undefined" ? message.postBack : "/";
                    }, 3000);
                }
            });
    };

    let info = function (message) {
        message.redirect = typeof (message.redirect) !== "undefined" ? message.redirect : false;

        $("<div class='alert alert-danger alert-panel' style='display:none;'>" + message.text + "</div>")
            .appendTo($(message.selector))
            .slideDown(800, function () {
                if (message.redirect) {
                    setTimeout(function () {
                        location.href = typeof (message.postBack) !== "undefined" ? message.postBack : "/";
                    }, 3000);
                }
            });
    };

    let warning = function (message) {
        message.redirect = typeof (message.redirect) !== "undefined" ? message.redirect : false;

        $("<div class='alert alert-warning alert-panel' style='display:none;'>" + message.text + "</div>")
            .appendTo($(message.selector))
            .slideDown(800, function () {
                if (message.redirect) {
                    setTimeout(function () {
                        location.href = typeof (message.postBack) !== "undefined" ? message.postBack : "/";
                    }, 3000);
                }
            });
    };

    let danger = function (message) {
        message.redirect = typeof (message.redirect) !== "undefined" ? message.redirect : false;

        $("<div class='alert alert-danger alert-panel' style='display:none;'>" + message.text + "</div>")
            .prependTo($(message.selector))
            .slideDown(800, function () {
                if (message.redirect) {
                    setTimeout(function () {
                        location.href = typeof (message.postBack) !== "undefined" ? message.postBack : "/";
                    }, 3000);
                }
            });
    };

    let dismiss = function (alert, callback) {
        let alertPanel = $(alert.selector).find(".alert-panel");

        $.each(alertPanel, function (index, el) {

            $(el).slideUp(800, function () {
                $(el).remove();

                if (typeof (callback) === "function") {
                    callback();
                }
            });
        });

        if (alertPanel.length == 0 && typeof (callback) === "function") {
            callback();
        }
    };

    return {
        success: success,
        info: info,
        warning: warning,
        danger: danger,
        dismiss: dismiss
    };
};
