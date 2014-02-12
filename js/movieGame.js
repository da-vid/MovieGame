var quicklist = angular.module('movieGame', ['ui.bootstrap']);

quicklist.controller('gameController', function($scope, $http){

    // // Game configuration
    // $scope.maxRounds = 5;    
    // numOptions = 3;    
  
    // $scope.startGame = function() {
    //     $scope.round = 0;
    //     $scope.score = 0;
    //     shownCities.length = 0;
    //     $scope.beginRound();
    // };

    // function getTodaysWeather (city){
    //     ajaxLoading = true;
    //     $http({method: 'GET', 
    //         url: "https://george-vustrey-weather.p.mashape.com/api.php?location=" + encodeURIComponent(city), 
    //         headers: {
    //             "X-Mashape-Authorization":"Olg4sdyWgN698QCZ7BPD5OEOkJ0XiluN"
    //         }
    //     })
    //     .success(function(data, status, headers, config) {
    //         nextCityWeather = data[0];
    //         nextCityWeather.high = Math.round(nextCityWeather.high);            
    //         nextCityWeather.low = Math.round(nextCityWeather.low);
    //         ajaxLoading = false;
    //         $scope.waitForAjax = false;
    //     })
    //     .error(function(data, status, headers, config) {
    //         $scope.status=status;
    //         //TODO more intelligent error handling
    //     });
    // }
});