(function () {
    var myApp = angular.module("myApp.controllers", []);

    myApp.controller("MyController", function($scope) {
        $scope.login = {};
        $scope.login.website = "Facebook";
    });
})();
