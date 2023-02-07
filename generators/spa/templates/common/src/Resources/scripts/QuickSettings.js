var dnnspamodule = dnnspamodule || {};

dnnspamodule.quickSettings = function (root, moduleId) {
    console.log(moduleId);
    let utils = new common.Utils();
    let alert = new common.Alert();
    let parentSelector = "[id='" + root + "']";
    // Setup your settings service endpoint
    let service = {
        baseUrl: "DesktopModules/React7/API/",
        framework: $.ServicesFramework(moduleId),
        controller: "Settings"
    };

    let SaveSettings = function () {

        let name = $("#Name").is(":checked");
        let description = $("#Description").is(":checked");
        let assignedUserId = $("#AssignedUserId").is(":checked");
        let createdOnDate = $("#CreatedOnDate").is(":checked");
        let itemId = $("#ItemId").is(":checked");

        let deferred = $.Deferred();
        let params = {
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
                let deferred = $.Deferred();
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

    let CancelSettings = function () {
        let deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    };

    let LoadSettings = function () {
        let params = {};

        utils.get("GET", "LoadSettings", service, params,
            function (data) {
                $("#CreatedOnDate").prop("checked", data.createdOnDate == "true");               
                $("#Name").prop("checked", data.name == "true");
                $("#Description").prop("checked", data.description == "true");
                $("#ItemId").prop("checked", data.itemId == "true");
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

    let init = function () {
        // Wire up the default save and cancel buttons
        $(root).dnnQuickSettings({
            moduleId: moduleId,
            onSave: SaveSettings,
            onCancel: CancelSettings
        });
        LoadSettings();
    };

    return {
        init: init
    };
};