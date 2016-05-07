var myapp = angular.module("display",[]);
myapp.controller("displayController", function ($scope, $http) {
     $scope.eventCards = [];
     $http({
        method: "GET",
        url: "/getEvents",
    }).then(function successCallback(response) {
        console.log(response.data);
        $scope.eventCards = response.data;
    }, function errorCallback(response) {
        console.log("Error.");
    });
    $('.modal-trigger').leanModal();
   

    $scope.open_login = function () {
        $('#signin').openModal();

    };
    $scope.open_signup = function () {
        $('#signup').openModal();

    };

    $scope.join_now = function (eventCard) {
        //$('#join_now').openModal();
         $("#"+ eventCard._id).openModal();

    }
    
   
    //console.log($scope.eventCards);
    
    
    $scope.eventDetails = {
        eventCapacity: "",
        eventDate: "",
        eventDesc: "",
        eventID: "",
        imageURL: "",
        eventVerified: "",
        eventVisible: "",
        locLat: "",
        locLong: "",
        eventName: "",
        eventType: "",
        visibility: "",
        eventTime: "",
        tenure: ""
    };
    $scope.createEvent = function () {
        console.log($scope.eventDetails);
        $http({

            method: "POST",
            data: $scope.eventDetails,
            url: "/addEvent",
            dataType: "application/json"
        }).then(function successCallback(response) {
            console.log(response);
        }, function errorCallback(response) {
            console.log("Error");
        });
    };
    
    $scope.user = {
        firstName : "",
        lastName : "",
        username : "",
        password : "",
        dob : "",
        email : ""
    };
    $scope.register = function () {
        console.log("User register called.");
        console.log($scope.user);
        $http({

            method: "POST",
            data: $scope.user,
            url: "/registerUser",
            dataType: "application/json"
        }).then(function successCallback(response) {
            console.log(response.data);
        }, function errorCallback(response) {
            console.log("Error");
        });
    };
});