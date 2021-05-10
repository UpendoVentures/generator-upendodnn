const <%= moduleName %>Vue = {
    baseUrl: "/API/<%= moduleName %>",

    service: {
        baseUrl : "/API/<%= moduleName %>",
        setModuleHeaders : function(request, moduleid, tabid) {
            request.setRequestHeader("moduleid", moduleid);
            request.setRequestHeader("tabid", tabid);
        }
    },

    GetItemList(tabid, moduleid, onDone) {
        $.ajax({
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
    },
    
    SaveItem (tabid, moduleid, editItem, onDone, onFail) {
        $.ajax({
            method: "POST",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(editItem),
            url: <%= moduleName %>Vue.service.baseUrl + "/Item/" + editItem.id,
            beforeSend: function(request) {
                TestVueVue.service.setModuleHeaders(request, moduleid, tabid);
            },
            dataType: "json"
        }).done(function (data) {
            if (typeof (onDone) === "function") {
                onDone(data);
            }
        }).fail(function () {
            if (typeof (onFail) === "function") {
                onFail();
            }
        }).always(function () {
        });
    },
    
    DeleteItem (tabid, moduleid, id, onDone, onFail) {
        $.ajax({
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
            if (typeof (onFail) === "function") {
                onFail();
            }
        }).always(function () {
        });
    },
    
    GetUserList (tabid, moduleid, onDone) {
        $.ajax({
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
        }).always(function () {
        });
    },
    
    GetResxList (tabid, moduleid, filename, onDone) {
        $.ajax({
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
        }).always(function () {
        });
    },
};

export default <%= moduleName %>Vue;