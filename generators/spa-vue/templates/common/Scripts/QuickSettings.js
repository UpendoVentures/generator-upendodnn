var <%= extensionName %>Settings = <%= extensionName %>Settings || {};

<%= extensionName %>.services = {}; // we need a service reference for each module

jQuery(function ($) {
    <%= extensionName %>Settings.service.framework = $.ServicesFramework(0); // TODO
    <%= extensionName %>Settings.service.baseUrl = <%= extensionName %>Settings.service.framework.getServiceRoot(<%= extensionName %>Settings.service.path) + "Settings/";
});

<%= extensionName %>Settings.InitApp = function (moduleid) {
    var svc = {
        moduleid: moduleid,
        path: "<%= extensionName %>",
        framework: $.ServicesFramework(moduleid)
    };
    svc.baseUrl = svc.framework.getServiceRoot(svc.path) + "Item/";

    <%= extensionName %>Settings.services[`svc-${moduleid}`] = svc;

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
