var EmptyModuleVueSettings = EmptyModuleVueSettings || {};

EmptyModuleVueSettings.baseUrl = "/API/<%= moduleName %>";
EmptyModuleVueSettings.service = {
    baseUrl : "/API/<%= moduleName %>",
    setModuleHeaders : function(request, moduleid, tabid) {
        request.setRequestHeader("moduleid", moduleid);
        request.setRequestHeader("tabid", tabid);
    }
};

EmptyModuleVueSettings.InitApp = function(moduleid) {
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
