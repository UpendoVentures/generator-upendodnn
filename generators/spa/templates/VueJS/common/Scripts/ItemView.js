var <%= moduleName %>Vue = <%= moduleName %>Vue || {};

<%= moduleName %>Vue.baseUrl = "/API/<%= moduleName %>";
<%= moduleName %>Vue.service = {
    baseUrl : "/API/<%= moduleName %>",
    setModuleHeaders : function(request, moduleid, tabid) {
        request.setRequestHeader("moduleid", moduleid);
        request.setRequestHeader("tabid", tabid);
    }
};
<%= moduleName %>Vue.GetItemList = function (tabid, moduleid, onDone) {
    var jqXHR = $.ajax({
        url: <%= moduleName %>Vue.service.baseUrl + "/Item/",
        beforeSend: function(request) {
            <%= moduleName %>Vue.service.setModuleHeaders(request, moduleid, tabid);
        },
        dataType: "json"
    }).done(function (data) {
        if (typeof (onDone) === "function") {
            onDone(data);
        }
    });
}

<%= moduleName %>Vue.SaveItem = function (tabid, moduleid, editItem, onDone, onFail) {
    var jqXHR = $.ajax({
        method: "POST",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(editItem),
        url: <%= moduleName %>Vue.service.baseUrl + "/Item/" + editItem.id,
        beforeSend: function(request) {
            <%= moduleName %>Vue.service.setModuleHeaders(request, moduleid, tabid);
        },
        dataType: "json"
    }).done(function (data) {
        if (typeof (onDone) === "function") {
            onDone(data);
        }
    }).always(function (data) {
    });
};

<%= moduleName %>Vue.DeleteItem = function (tabid, moduleid, id, onDone, onFail) {
    var jqXHR = $.ajax({
        method: "DELETE",
        url: <%= moduleName %>Vue.service.baseUrl + "/Item/" + id,
        beforeSend: function(request) {
            <%= moduleName %>Vue.service.setModuleHeaders(request, moduleid, tabid);
        },
    }).done(function () {
        if (typeof (onDone) === "function") {
            onDone();
        }
    }).fail(function () {
    }).always(function (data) {
    });
};

<%= moduleName %>Vue.GetUserList = function (tabid, moduleid, onDone) {
    var jqXHR = $.ajax({
        url: <%= moduleName %>Vue.service.baseUrl + "/User/",
        beforeSend: function(request) {
            <%= moduleName %>Vue.service.setModuleHeaders(request, moduleid, tabid);
        },
        dataType: "json",
        async: false
    }).done(function (data) {
        if (typeof (onDone) === "function") {
            onDone(data);
        }
    }).always(function (data) {
    });
};

<%= moduleName %>Vue.GetResxList = function (tabid, moduleid, filename, onDone) {
    var jqXHR = $.ajax({
        url: <%= moduleName %>Vue.service.baseUrl + "/Resx/?filename=" + filename,
        beforeSend: function(request) {
            <%= moduleName %>Vue.service.setModuleHeaders(request, moduleid, tabid);
        },
        dataType: "json",
        async: false
    }).done(function (data) {
        if (typeof (onDone) === "function") {
            onDone(data);
        }
    }).always(function (data) {
    });
};