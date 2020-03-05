"use strict";

exampleControllers.controller("exampleController", ["$scope", "$routeParams", "$location", "$http", "$uibModal", "exampleServiceFactory", function ($scope, $routeParams, $location, $http, $uibModal, exampleServiceFactory) {

    $scope.example = {};
    $scope.HasSuccess = false;
    $scope.HasErrors = false;
    $scope.ExampleId = $routeParams.exampleId;

    var factory = exampleServiceFactory;
    factory.init(appModuleId, appModuleName);
    $scope.exampleFilter = "";

    $scope.userCanEdit = false;

    $scope.LoadData = function () {
        factory.callGetService("GetCurrentUserId")
            .then(function (response) {
                var fullResult = angular.fromJson(response);
                var serviceResponse = JSON.parse(fullResult.data);

                $scope.currentUserId = serviceResponse.Content;

                $scope.LoadEditPermissions();

                if ($scope.ExampleId > -1) {
                    $scope.LoadExample();
                }
                else
                {
                    $scope.LoadExamples();
                }

                LogErrors(serviceResponse.Errors);
            },
            function (data) {
                console.log("Unknown error occurred calling GetCurrentUserId");
                console.log(data);
            });
    }

    $scope.LoadExamples = function () {
        factory.callGetService("GetExamples")
            .then(function (response) {
                var fullResult = angular.fromJson(response);
                var serviceResponse = JSON.parse(fullResult.data);

                $scope.examples = serviceResponse.Content;

                if ($scope.examples === null) {
                    $scope.hasExamples = false;
                } else {
                    $scope.hasExamples = true;
                }

                LogErrors(serviceResponse.Errors);
            },
                function (data) {
                    console.log("Unknown error occurred calling GetExamples");
                    console.log(data);
                });
    }

    $scope.LoadExample = function () {
        factory.callGetService("GetExample?exampleId=" + $scope.ExampleId)
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
    }

    $scope.LoadEditPermissions = function () {
        factory.callGetService("UserCanEditExample")
            .then(function(response) {
                    var fullResult = angular.fromJson(response);
                    var serviceResponse = JSON.parse(fullResult.data);

                    $scope.userCanEdit = (serviceResponse.Content == "Success");

                    LogErrors(serviceResponse.Errors);
                },
                function(data) {
                    console.log("Unknown error occurred calling UserCanEditExample");
                    console.log(data);
                });
    }

    $scope.UpdateExample = function () {
        var action = "CreateExample";

        if ($scope.example.ExampleId > 0) {
            action = "UpdateExample";
        }

        factory.callPostService(action, $scope.example)
            .success(function (data) {
                $scope.HasSuccess = true;

                var serviceResponse = angular.fromJson(data);

                $scope.LoadData();

                LogErrors(serviceResponse.Errors);
            })
            .error(function (data, status) {
                $scope.HasErrors = true;
                console.log("Unknown error occurred calling " + action);
                console.log(data);
            });
    }

    $scope.CanDelete = function (exampleId) {
        return (exampleId > -1);
    }

    $scope.DeleteExample = function (exampleId) {
        var modalInstance = $uibModal.open({
            templateUrl: "DeleteExampleModal.html",
            controller: "DeleteExampleModalController",
            size: "sm",
            backdrop: "static",
            scope: $scope,
            resolve: {
                exampleId: function () {
                    return exampleId;
                }
            }
        });

        modalInstance.result.then(function () {
            $scope.goToPage('examples');
        }, function () {
            console.log("Modal dismissed at: " + new Date());
        });
    }

    $scope.goToPage = function (pageName) {
        $location.path(pageName);
        $scope.LoadData();
    }

    $scope.LoadData();

}]);