"use strict";

exampleApp.controller("DeleteExampleModalController", ["$scope", "$rootScope", "$modalInstance", "$location", "exampleId", "exampleServiceFactory", function ($scope, $rootScope, $modalInstance, $location, exampleId, exampleServiceFactory) {

    var factory = exampleServiceFactory;
    factory.init(appModuleId, appModuleName);

    $scope.example = {};

    factory.callGetService("GetExample?exampleId=" + exampleId)
        .then(function (response) {
            var fullResult = angular.fromJson(response);
            var serviceResponse = JSON.parse(fullResult.data);

            $scope.example = serviceResponse.Content;

            LogErrors(serviceResponse.Errors);
        },
        function (data) {
            console.log("Unknown error occurred calling GetExample");
            console.log(data);
        });

    $scope.ok = function () {
        factory.callDeleteService("DeleteExample?exampleId=" + exampleId)
            .then(function (response) {
                var fullResult = angular.fromJson(response);
                var serviceResponse = JSON.parse(fullResult.data);

                $scope.goToPage('examples');

                LogErrors(serviceResponse.Errors);
            },
            function (data) {
                console.log("Unknown error occurred calling DeleteExample");
                console.log(data);
            });

        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss("cancel");
    };

    $scope.goToPage = function (pageName) {
        $location.path(pageName);
        $scope.LoadData();
    }
}]);