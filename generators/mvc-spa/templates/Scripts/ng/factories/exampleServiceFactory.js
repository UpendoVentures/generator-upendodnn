"use strict";

exampleApp.factory("exampleServiceFactory", ["$http", function ($http) {

        var $self = this;

        return {
            init: function (appModuleId, moduleName) {
                if ($.ServicesFramework) {
                    var _sf = $.ServicesFramework(appModuleId);
                    $self.ServiceRoot = "/DesktopModules/MVC/<%= fullNamespace %>/API/";
                    $self.ServicePath = $self.ServiceRoot + "Example/";
                    $self.Headers = {
                        "ModuleId": appModuleId,
                        "TabId": _sf.getTabId(),
                        "RequestVerificationToken": _sf.getAntiForgeryValue()
                    };
                }
            },
            callGetService: function (method) {
                return $http({
                    method: "GET",
                    url: $self.ServicePath + method,
                    headers: $self.Headers
                });
            },
            callPostService: function (method, data) {
                return $http({
                    method: "POST",
                    url: $self.ServicePath + method,
                    headers: $self.Headers,
                    data: data
                });
            },
            callDeleteService: function (method) {
                return $http({
                    method: "DELETE",
                    url: $self.ServicePath + method,
                    headers: $self.Headers
                });
            }
        }
    
}]);