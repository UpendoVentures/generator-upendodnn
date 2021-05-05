var <%= moduleName %>SettingsVue = <%= moduleName %>SettingsVue || {};

<%= moduleName %>SettingsVue.baseUrl = "/API/<%= moduleName %>";
<%= moduleName %>SettingsVue.service = {
    baseUrl : "/API/<%= moduleName %>",
    setModuleHeaders : function(request, moduleid, tabid) {
        request.setRequestHeader("moduleid", moduleid);
        request.setRequestHeader("tabid", tabid);
    }
};

<%= moduleName %>SettingsVue.InitApp = function(moduleid) {
    new Vue({
        el: `#settings-${moduleid}`,
        computed: {
        },
        data: {
            message: "From Vue"
        },
        methods: {
        },
        mounted: function() {
        }
    });
}