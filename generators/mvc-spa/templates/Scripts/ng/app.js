"use strict";

$("body").attr("ng-app", "exampleApp");

var exampleApp = angular.module("exampleApp", ["ngRoute", "ngAnimate", "ui.bootstrap", "ui.sortable", "angularMoment", "flow", "exampleControllers"]);

var exampleControllers = angular.module("exampleControllers", []);

exampleApp.config(["$routeProvider", 
	function ($routeProvider) {

		$routeProvider
		.when("/update", {
			templateUrl: templatePath + "Templates/_default/update.html",
			controller: "exampleController"
        })
        .when("/update/:exampleId", {
            templateUrl: templatePath + "Templates/_default/update.html",
            controller: "exampleController"
        })
		.when("/examples", {
            templateUrl: templatePath + "Templates/_default/examples.html",
			controller: "exampleController"
		})
		.otherwise({
			redirectTo: "/examples"
		});
	}]);