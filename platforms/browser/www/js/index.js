(function () {
    'use strict';
    var module = angular.module('myApp', ['ngCordova'])

    module.controller('appController', ['$scope','$timeout', '$http', '$cordovaFile', function($scope,$timeout,$http,$cordovaFile) {

      document.addEventListener('deviceready',deviceReady, false);

      $scope.appMessage = "deviceready";
      $scope.greenButtonEnable = true;
      $scope.redButtonEnable = true;
      $scope.greenButtonMessage = 'Working Example';
      $scope.redButtonMessage = 'Reproduce Bug';
      $scope.processStep = 1;
      $scope.finalOutput = '';

      function deviceReady() {
        receivedEvent('deviceready')
      }

      function receivedEvent(id) {

          console.log('Received Event :: ' + id);
          console.log(cordova.file);
          console.log(cordova.file.dataDirectory);
          $scope.$apply();
      }

      $scope.handleButtonClick = function(type){
        var filePath;
        alert(type +" :: "+ $scope.processStep);
        if($scope.processStep === 1){
          if(type == 'bad'){
            filePath = 'BadMember.json';
            $scope.greenButtonEnable = false;

          }else{
            filePath = 'Member.json';
            $scope.redButtonEnable = false;

          }

          $http.get(filePath)
            .success(function(data, status, headers, config) {
              $scope.finalOutput = data;
              $scope.greenButtonMessage = 'Click again to read from the file created on device.';
              $scope.redButtonMessage = 'Click again to read from the file created on device.';
              //$scope.processStep = 2;
              //Writing the output to the file
              jsonFileWriter('AllMember.json', data);
            })
            .error(function(e){
              console.log(e);
            });//end of file read
        }else {

          $cordovaFile.readFile(cordova.file.dataDirectory + 'AllMember.json').then(function(result){
            var data = JSON.parse(content);
            $scope.finalOutput = data;
            $scope.appMessage = "Successfull read from the created file.";
          }).then(function(error){
            $scope.finalOutput = error;
            $scope.appMessage = "Can't read the file.";
          })
        }

      }//end of handleButtonClick function

      function jsonFileWriter(fileName, data) {
              $cordovaFile.writeFile(cordova.file.dataDirectory, fileName, JSON.stringify(data), true)
              .then(function (success) {
                $scope.appMessage = "Successfully created and wrote the result to the file.";
                $scope.processStep = 2;
              }, function (error) {
                  $scope.finalOutput = error;
                  $scope.appMessage = "Oops! Something went wrong while creating and writing a file.";
              });
          };


    }]);

})();
