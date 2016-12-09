var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

//Routes
weatherApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.htm',
            controller: 'homeController'
        })
        .when('/forecast', {
            templateUrl: 'pages/forecast.htm',
            controller: 'forecastController'
        })
        .when('/forecast/:days', {
            templateUrl: 'pages/forecast.htm',
            controller: 'forecastController'
        });


});
//$apply is used when some data is modified inside non angular method.dshamava
//Controllers
weatherApp.controller('homeController', ['$scope','$location','cityWeather', function ($scope,$location,cityWeather) {
    $scope.city = cityWeather.city;

    $scope.$watch('city', function () {
        cityWeather.city = $scope.city;
    });
    
    $scope.submit = function(){
        $location.path('/forecast');
    }

}]);

weatherApp.controller('forecastController', ['$scope', '$resource','$routeParams','cityWeather', function ($scope, $resource, $routeParams,cityWeather) {
    $scope.city = cityWeather.city;
    $scope.days = $routeParams.days || 2;
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", {
        callback: "JSON_CALLBACK"
    }, { get: { method: "JSONP" } }
    );
    
    $scope.weatherResult = $scope.weatherAPI.get({q: $scope.city, cnt:$scope.days,appid:'c945425ac4358b0db6e33f1536ee3fbe'});

    $scope.convertToFahrenheit = function(degK) {
        
        return Math.round((1.8 * (degK - 273)) + 32);
        
    }
    
    $scope.convertToDate = function(dt) { 
      
        return new Date(dt * 1000);
        
    };

}]);

//Service
weatherApp.service('cityWeather', function () {
    this.city = 'Chicago, CH'
});

//Directives

weatherApp.directive('weatherReport',function(){
    return{
        restrict : 'AECM',
        templateUrl: 'directives/weatherReport.htm',
        replace : true,
        scope: {
            weatherDay: '=', //object,
            convertToStandard: '&',
            convertToDate: '&',
            dateFormat: '@'
        }
    }
});