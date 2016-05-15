angular.module("display", ['ngMap', 'ngMaterial', 'lfNgMdFileInput'])
    .controller("displayController", function ($scope, $http, NgMap) {
        // setTimeout(function(){
               $('.parallax').parallax();
        // },500);
      
        $scope.loggedin = false;
        $scope.loggedout = true;
        //COde for image upload----------------------------------//
        $scope.selectedFile = {};
        $scope.$watch('files.length', function (newVal, oldVal) {

            $scope.selectedFile = $scope.files;
        });
        // $scope.onFileSelect = function ($files) {
        //     for (var i = 0; i < $files.length; i++) {
        //         var file = $files[i];
        //         $scope.upload = $upload.upload({
        //             url: '/upload',
        //             method: 'POST',
        //             data: { myObj: $scope.myModelObj },
        //             file: file,
        //             fileFormDataName: myFile,
        //         }).progress(function (evt) {
        //             console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        //         }).success(function (data, status, headers, config) {
        //             //console.log(data);
        //         });
        //     }
        // };
        //-------------------------------------------------------///
        // $scope.display = false;
        // $scope.show_tabs = true;
        $scope.eventCards = [];
        $scope.MyeventCards = [];
        var vm = this;
        $scope.render = true;
        $scope.dynMarkers = [];
        $scope.points = [
            { "name": "Canberra", "latitude": -35.282614, "longitude": 149.127775, "index": 0 },
            { "name": "Melbourne", "latitude": -37.815482, "longitude": 144.983460, "index": 1 },
            { "name": "Sydney", "latitude": -33.869614, "longitude": 151.187451, "index": 2 }
        ];
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
            // $scope.display = true;
            // $scope.show_tabs = false;
            $('#createEvent').openModal();

        };

        // $scope.create_Event = function () {
        //     $('#createEvent').openModal();

        // };
        $scope.open_signup = function () {
            $('#signup').openModal();

        };

        $scope.join_now = function (eventCard) {
            //$('#join_now').openModal();
            $("#" + eventCard._id).openModal();

        }

        $('ul.tabs').tabs();
        $('ul.tabs').tabs('select_tab', 'show_card');
        $('ul.tabs').tabs('select_tab', 'view_map');


        $scope.deleteEvent = function (eventCard) {
            console.log("Delete called.");
            console.log(eventCard);
            $http({
                method: "POST",
                url: "/deleteEvent",
                data: eventCard
            }).then(function successCallback(response) {
                //console.log(response);
                //console.log($scope.eventCards.indexOf(eventCard));
                console.log(response.data);
                $scope.eventCards.splice($scope.eventCards.indexOf(eventCard), 1);
                $scope.MyeventCards.splice($scope.MyeventCards.indexOf(eventCard), 1);


            }, function errorCallback(response) {
                console.log("Error");
            });
        };
        //console.log($scope.eventCards);
var uploaded_file;
        $scope.uploadImage = function () {
            console.log("Upload Image called.");
            var formData = new FormData();
            angular.forEach($scope.selectedFile, function (obj) {
                //console.log(obj);
                formData.append('files', obj.lfFile);
            });
            //console.log(formData);
            $http({
                method: "POST",
                url: "/upload",
                data: formData,
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function successCallback(response) {
                //console.log(response.data);
                uploaded_file = response.data;
                console.log(uploaded_file);
                $scope.imguploaded = true;
                //$scope.dataBlock = response.data;
            }, function errorCallback(response) {
                console.log("Error.");
            });
        };

        $scope.joinEvent = function (eventCard) {
            console.log("Join Event called.");
            console.log(eventCard._id);
            $http({
                method: "POST",
                url: "/joinEvent",
                data: eventCard,
                dataType: "application/json"
            }).then(function successCallback(response) {
                console.log(response);
                console.log("You joined the event.");
                //$('.modal_for_join').closeModal();
                $("#" + eventCard._id).closeModal();

            }, function errorCallback(response) {
                console.log("Errror.");
            }

                )
        };

        $scope.loginDetails = {
            username: "",
            pwd: ""
        }
        console.log($scope.loginDetails);
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
                        $('#signin').closeModal();
                        console.log("Welcome " + response.data);
                        $http({
                            method: "POST",
                            url: "/getEvents",
                            data: { username: response.data }
                        }).then(function successCallback(response) {
                            console.log(response.data[0].addedBy);
                            $scope.eventCards = response.data;
                            angular.forEach($scope.eventCards, function (item) {
                                console.log(item);
                                if (item.addedBy == $scope.loginDetails.username) {
                                    console.log(item);
                                    $scope.MyeventCards.push(item);
                                }
                            });
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
            $scope.eventDetails.imageURL=uploaded_file;
            $http({

                method: "POST",
                data: $scope.eventDetails,
                url: "/createEvent",
                dataType: "application/json"
            }).then(function successCallback(response) {
                console.log(response);
                $scope.eventCards.push(response.data);
                $scope.MyeventCards.push(response.data);
                // $scope.show_tabs=true;
                $('#createEvent').closeModal();
                //   $scope.display=false;
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
                $('#signup').closeModal();
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


        $scope.pinClicked = function (events, marker) {
            var pos = marker.$eventID;
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var directionsService = new google.maps.DirectionsService();
            directionsDisplay.setMap(null);
            directionsDisplay.setMap($scope.map);
            alert(pos);
            window.setTimeout(function () {
                google.maps.event.trigger($scope.map, 'resize');
            }, 100);
            function calcRoute(pos) {
                google.maps.event.trigger($scope.map, 'resize');
                //$scope.map.setCenter(0);
                //var start = $ + "," + $scope.points[0].longitude;
                //               var end = $scope.eventCards.locLat+ "," + $scope.eventCards[$scope.].locLong;
                var request = {
                    origin: start,
                    destination: end,
                    optimizeWaypoints: true,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        console.log('enter!');
                    }
                });
            }
            calcRoute(pos)
        }


        NgMap.getMap().then(function (map) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.$timeout(function () {
                        $scope.position = position;
                        var myLatLng = new google.maps.LatLng($scope.position.coords.latitude, $scope.position.coords.longitude);
                        $scope.map.setCenter(myLatLng);
                    });
                });
            }
        });

        // NgMap.getMap().then(function (map) {
        //     if (navigator.geolocation) {
        //         navigator.geolocation.getCurrentPosition(function (position) {
        //             $scope.$apply(function () {
        //                 $scope.position = position;
        //                 var myLatLng = new google.maps.LatLng($scope.position.coords.latitude, $scope.position.coords.longitude);
        //                 $scope.map.setCenter(myLatLng);
        //             });
        //         });
        //     }
        //     window.setTimeout(function () {
        //         google.maps.event.trigger($scope.map, 'resize');
        //     }, 100);
        // });

        // NgMap.getMap().then(function (map) {
        //     window.setTimeout(function () {
        //         google.maps.event.trigger($scope.map, 'resize');
        //     }, 100);
        // });

        $scope.resizeMap = function ($scope) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.$apply(function () {
                        $scope.position = position;
                        var myLatLng = new google.maps.LatLng($scope.position.coords.latitude, $scope.position.coords.longitude);
                        $scope.map.setCenter(myLatLng);
                    });
                });
            }
            window.setTimeout(function () {
                google.maps.event.trigger($scope.map, 'resize');
            }, 100);
        }

        // $scope.resizeMap = function () {
        //     //  alert("refresh");

        //     window.setTimeout(function () {

        //         google.maps.event.trigger($scope.map, 'resize');
        //     }, 100);

        // }
    });
