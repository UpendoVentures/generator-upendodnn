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

        var name = $('#QuickSettings-' + moduleId + ' #Name').is(":checked");
        var description = $('#QuickSettings-' + moduleId + ' #Description').is(":checked");
        var assignedUserId = $('#QuickSettings-' + moduleId + ' #AssignedUserId').is(":checked");
        var createdOnDate = $('#QuickSettings-' + moduleId + ' #CreatedOnDate').is(":checked");
        var itemId = $('#QuickSettings-' + moduleId + ' #ItemId').is(":checked");

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
                $('#QuickSettings-' + moduleId + ' #CreatedOnDate').prop('checked', data.createdOnDate == "true");               
                $('#QuickSettings-' + moduleId + ' #Name').prop('checked', data.name == "true");
                $('#QuickSettings-' + moduleId + ' #Description').prop('checked', data.description == "true");
                $('#QuickSettings-' + moduleId + ' #ItemId').prop('checked', data.itemId == "true");
            },
            function (error, exception) {
                // fail
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