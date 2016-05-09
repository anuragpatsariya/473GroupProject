angular.module("display", [])
    .controller("displayController", function ($scope, $http) {
        $scope.loggedin = false;
        $scope.loggedout = true;
        $scope.eventCards = [];
        $http({
            method: "POST",
            url: "/getEvents",
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.eventCards = response.data;
        }, function errorCallback(response) {
            console.log("Error.");
        });
       // $('.modal-trigger').leanModal();


        $scope.open_login = function () {
            $('#signin').openModal();

        };
        $scope.create_Event = function () {
            $('#createEvent').openModal();

        };
        $scope.open_signup = function () {
            $('#signup').openModal();

        };

        $scope.join_now = function (eventCard) {
            //$('#join_now').openModal();
            $("#" + eventCard._id).openModal();

        }



        $scope.deleteEvent = function(eventCard){
            console.log("Delete called.");
            console.log(eventCard);
            $http({
                method:"POST",
                url:"/deleteEvent",
                data:eventCard
            }).then(function successCallback(response){
                //console.log(response);
                //console.log($scope.eventCards.indexOf(eventCard));
                console.log(response.data);
                $scope.eventCards.splice($scope.eventCards.indexOf(eventCard), 1);
                
                
                
            },function errorCallback(response){
                console.log("Error");
            });
        };
        //console.log($scope.eventCards);
        $scope.loginDetails = {
            username: "",
            pwd: ""
        }

        $scope.login = function () {
            console.log("Login Called.");
            console.log($scope.loginDetails);
            loginDetails = $scope.loginDetails;
            if (loginDetails.username.length == 0 || loginDetails.pwd.length == 0) {
                window.alert("Enter valid username and password.");
            } else {
                $http({
                    method: "POST",
                    data: loginDetails,
                    url: "/login",
                    dataType: "application/json"
                }).then(function successCallback(response) {

                    console.log(response);
                    if (response.data != "failure") {
                        $scope.loggedin = true;
                        $scope.loggedout = false;
                        console.log("Welcome " + response.data);
                        $http({
                            method: "POST",
                            url: "/getEvents",
                            data: { username: response.data }
                        }).then(function successCallback(response) {
                            console.log(response.data);
                            $scope.eventCards = response.data;
                        }, function errorCallback(response) {
                            console.log("error");
                        });
                    } else {
                        window.alert("Incorrect username or password.");
                    }
                }, function errorCallback(response) {
                    console.log("Error");
                    console.log(response);
                });
            }
        };


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
                url: "/createEvent",
                dataType: "application/json"
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(response) {
                console.log("Error");
            });
        };

        $scope.user = {
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            dob: "",
            email: ""
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

        $scope.logout = function () {
            console.log("Logout called.");
            $scope.user = {};
            $http({
                method: "POST",
                url: "/logout"
            }).then(function successCallback(response) {
                $scope.loggedin = false;
                $scope.loggedout = true;
                $http({
                    method: "POST",
                    url: "/getEvents",
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.eventCards = response.data;
                }, function errorCallback(response) {
                    console.log("Error.");
                });
            }, function errorCallback(response) {
                console.log("Error");
            });
        };

    });