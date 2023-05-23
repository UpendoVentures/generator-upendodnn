var <%= moduleName %>Settings = <%= moduleName %>Settings || {};

<%= moduleName %>Settings.quickSettings = function (root, moduleId) {
    console.log(moduleId);
    var utils = new common.Utils();
    var alert = new common.Alert();
    var parentSelector = "[id='" + root + "']";
    // Setup your settings service endpoint
    var service = {
        baseUrl: "DesktopModules/<%= moduleName %>/API/",
        framework: $.ServicesFramework(moduleId),
        controller: "Settings"
    }

    var SaveSettings = function () {

        var name = $('#Name').is(":checked");
        var description = $('#Description').is(":checked");
        var assignedUserId = $('#AssignedUserId').is(":checked");
        var createdOnDate = $('#CreatedOnDate').is(":checked");
        var itemId = $('#ItemId').is(":checked");

        var deferred = $.Deferred();
        var params = {
            name: name,
            description: description,
            assignedUserId: assignedUserId,
            createdOnDate: createdOnDate,
            itemId: itemId
        };

        utils.get("POST", "save", service, params,
            function (data) {

                deferred.resolve();
                location.reload();
            },
            function (error, exception) {
                // fail
                var deferred = $.Deferred();
                deferred.reject();
                alert.danger({
                    selector: parentSelector,
                    text: error.responseText,
                    status: error.status
                });
            },
            function () {
            });

        return deferred.promise();
    };

    var CancelSettings = function () {
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    };

    var LoadSettings = function () {
        var params = {};

        utils.get("GET", "LoadSettings", service, params,
            function (data) {
                $('#CreatedOnDate').prop('checked', data.createdOnDate == "true");               
                $('#Name').prop('checked', data.name == "true");
                $('#Description').prop('checked', data.description == "true");
                $('#ItemId').prop('checked', data.itemId == "true");
            },
            function (error, exception) {
                // fail
                console.log("12345657897");
                console.log(error);
                alert.danger({
                    selector: parentSelector,
                    text: error.responseText,
                    status: error.status
                });
            },
            function () {
            });
    };

    var init = function () {
        // Wire up the default save and cancel buttons
        $(root).dnnQuickSettings({
            moduleId: moduleId,
            onSave: SaveSettings,
            onCancel: CancelSettings
        });
        LoadSettings();
    }

    return {
        init: init
    }
};