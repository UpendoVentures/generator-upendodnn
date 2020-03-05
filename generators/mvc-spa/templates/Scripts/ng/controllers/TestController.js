"use strict";

exampleControllers.controller("testController", ["$scope", "$routeParams", "$http", "exampleServiceFactory", function ($scope, $routeParams, $http, exampleServiceFactory) {

    var factory = exampleServiceFactory;
    factory.init(appModuleId, appModuleName);

    factory.callGetService("Ping")
        .then(function (response) {
            var fullResult = angular.fromJson(response);

            var serviceResponse = JSON.parse(fullResult.data);

            $scope.Ping = serviceResponse.Content;

            LogErrors(serviceResponse.Errors);
        },
        function (data) {
            console.log("Unknown error occurred calling Ping");
            console.log(data);
        });

    factory.callGetService("PingError")
        .then(function (response) {
            var fullResult = angular.fromJson(response);

            var serviceResponse = JSON.parse(fullResult.data);

            $scope.PingError = serviceResponse.Content;

            LogErrors(serviceResponse.Errors);
        },
        function (data) {
            console.log("Unknown error occurred calling PingError");
            console.log(data);
        });

    factory.callGetService("PingException")
        .then(function (response) {
            var fullResult = angular.fromJson(response);

            var serviceResponse = JSON.parse(fullResult.data);

            $scope.PingException = serviceResponse.Content;

            LogErrors(serviceResponse.Errors);
        },
        function (data) {
            console.log("Unknown error occurred calling PingException");
            console.log(data);
        });

    factory.callGetService("PingNotFound")
        .then(function (response) {
            var fullResult = angular.fromJson(response);

            var serviceResponse = JSON.parse(fullResult.data);

            $scope.PingNotFound = serviceResponse.Content;

            LogErrors(serviceResponse.Errors);
        },
        function (data) {
            console.log("Unknown error occurred calling PingNotFound");
            console.log(data);
        });

    factory.callGetService("PingSecurityCheck")
        .then(function (response) {
            var fullResult = angular.fromJson(response);

            var serviceResponse = JSON.parse(fullResult.data);

            $scope.PingSecurityCheck = serviceResponse.Content;

            LogErrors(serviceResponse.Errors);
        },
        function (data) {
            console.log("Unknown error occurred calling PingSecurityCheck");
            console.log(data);
        });

}]);