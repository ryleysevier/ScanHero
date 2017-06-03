/**
 * Created by Ryley Sevier on 5/23/14.
 */

var app = angular.module('ScannerApp',['ngRoute']);

app.controller('ScannerCtrl', function($scope, $timeout, getScores, addScore, $route, $routeParams){
    $scope.codes = [];

    started = false;
    $scope.ended = false;
    $scope.colors = ["green", "orange", "red", "blue", "purple", "yellow"];
    $scope.currentColor = "";
    $scope.goalColor = "red";
    $scope.goalText = "red";
    prevgoalText = "";

    $scope.score = 0;
    $scope.finalScore = 0;
    $scope.downCounter = null;
    $scope.timeleft = 30;
    $scope.timeleftCounter = null;

    $scope.highscores = [];

    (function(){
        getScores().then(function(results){
            $scope.highscores = results;
        });
    })();

    $scope.addCode = function(code){

        if(!started){
            $scope.downCounter = $timeout($scope.scoreDownTick ,1000);
            $scope.timeleftCounter = $timeout($scope.timeleftTick ,1000);

            started = true;
        }

        prevgoalText = $scope.goalText;

        $scope.currentCode = "";

        if(!$scope.ended){
            if($scope.goalText == code){
                $scope.score+=50;
                $scope.makeFlash();

            } else {
                $scope.score-=100;
                $scope.makeFlash();
            }
            var target = $scope.getRandomColor();

            if (target == prevgoalText){
                while (prevgoalText == target){
                    target = $scope.getRandomColor();
                }
            }

            if (target == "trick"){
                while (target == "trick"){
                    target = $scope.getRandomColor();

                }
                $scope.goalColor = target;

                while ($scope.goalText == "trick"){
                    $scope.goalText = $scope.getRandomColor();
                }
            } else {

            $scope.goalColor = target;
            $scope.goalText = target;}

            //$scope.goalColor = $scope.getRandomColor();
            $scope.codes.push(code);
        }
    }

    $scope.getRandomColor = function(){
        return $scope.colors[Math.floor(Math.random() * $scope.colors.length)];
    }

    $scope.scoreDownTick = function(){
        $scope.score-=10;
        $scope.downCounter = $timeout($scope.scoreDownTick ,1000);
    }

    $scope.timeleftTick = function(){
        $scope.timeleft--;
        if($scope.timeleft <= 0){
            gameOver();
        }   else    {
            $scope.timeleftCounter = $timeout($scope.timeleftTick ,1000);
        }
    }

    gameOver = function(){
        $scope.ended = true;
        $scope.submitScore = true;
        $timeout.cancel($scope.downCounter);
        $scope.timeleft = "Game Over";
        $scope.finalScore = $scope.score;
        $scope.score = "Final Score: " + $scope.score;
    }

    $scope.addScore = function(name){
        $scope.submitScore = false;
        name = name.substring(0,3);
        addScore($scope.finalScore, name).then(function(data){
            console.log(data);
            $scope.highscores.push({name: name, score: $scope.finalScore});
            $route.reload();
        });

    }

    $scope.makeFlash = function(){


    }


}).factory('getScores', ['$http', '$q', function($http, $q) {
    return function() {
        var deferred = $q.defer();

        $http({
            url: "highscore.php",
            method: "GET",
            params: {
                operation: "getScores",
            }
        }).success(function(data, status){
            deferred.resolve(angular.fromJson(data));
        });

        return deferred.promise;
    };
}]).factory('addScore', ['$http', '$q', function($http, $q){
        return function(score, name){
            var deferred = $q.defer();
            var params = {
                operation: "addScore",
                name: name,
                score: score
            };
            var url = "highscore.php";

            $http.post(url, params).success(function(data, status){
                deferred.resolve(data);
            });

            return deferred.promise;

        }
    }]);