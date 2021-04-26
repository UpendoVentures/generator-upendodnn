var <%= moduleName %>Settings = <%= moduleName %>Settings || {};

<%= moduleName %>.services = {}; // we need a service reference for each module

jQuery(function ($) {
    <%= moduleName %>Settings.service.framework = $.ServicesFramework(0); // TODO
    <%= moduleName %>Settings.service.baseUrl = <%= moduleName %>Settings.service.framework.getServiceRoot(<%= moduleName %>Settings.service.path) + "Settings/";
});

<%= moduleName %>Settings.InitApp = function (moduleid) {
    var svc = {
        moduleid: moduleid,
        path: "<%= moduleName %>",
        framework: $.ServicesFramework(moduleid)
    };
    svc.baseUrl = svc.framework.getServiceRoot(svc.path) + "Item/";

    <%= moduleName %>Settings.services[`svc-${moduleid}`] = svc;

    new Vue({
        el: `#settings-${moduleid}`,
        computed: {
        },
        data: {
            message: "From Vue"
        },
        methods: {
        },
        mounted: function () {
        }
    });
}
