var datepicker = {
	years: [],
	months: [],
	days: []
}

for (i=2015; i>=1900; i--) datepicker.years.push({"key":i, "value":i})
for (i=0; i<=11; i++) datepicker.months.push({"key":i, "value":i})
for (i=1; i<=31; i++) datepicker.days.push({"key":i, "value":i})

var app = angular.module('app', ['ngRoute', 'ngResource', 'ngFileUpload'])

.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'List',
			templateUrl: 'views/list.html'
		})
		.when('/add/', {
			controller: 'Add',
			templateUrl: 'views/add.html'
		})
		.when('/edit/:id', {
			controller: 'Edit',
			templateUrl: 'views/edit.html'
		})
		.when('/view/:id', {
			controller: 'View',
			templateUrl: 'views/view.html'
		})
		.when('/photos/:id', {
			controller: 'Upload',
			templateUrl: 'views/upload.html'
		})
		.when('/photos/', {
			controller: 'Upload',
			templateUrl: 'views/upload.html'
		})
})

.controller('List', function($scope, $http, $location) {

		$scope.users = [];

		$http.get('/crud/api/users')
				.success(function(response) {
					$scope.users = response;
				})

		$scope.userdel = function(id, index) {
			$http.delete('/crud/api/user/' + id, {"userid": id})
				.success(function(response){
					$scope.users.splice(index, 1);
				})
		}

		$scope.useredit = function(id) {
			$location.url('/edit/' + id);
		}

		$scope.userview = function(id) {
			$location.url('/view/' + id);
		}

		$scope.add = function(){
			$location.url('/add/')
		}

	})

.controller('Add', function($scope, $http, $routeParams, $location) {

		$scope.user = {};

		$scope.datepicker = datepicker;

		// datepicker initialization
		$scope.byear = $scope.datepicker.years[21];
		$scope.bmonth = $scope.datepicker.months[0];
		$scope.bday = $scope.datepicker.days[0];


		$scope.save = function() {
			$scope.user.bdate = new Date($scope.byear.value, $scope.bmonth.value, $scope.bday.value);

			$scope.errors = [];
			if (typeof $scope.user.name === 'undefined') {
				$scope.errors.push("falta su nombre");
			}
			if (typeof $scope.user.password === 'undefined') {
				$scope.errors.push("error en password");
			}
			if ($scope.user.password != $scope.user.rpassword) {
				$scope.errors.push("passwords no coinciden");
			}
			if ($scope.errors.length > 0) {
				return false;
			}
			
			$http.post('/crud/api/user/', $scope.user)
				.success(function(response){
					console.log(response);
					alert("Usuario agregado :)");
					$location.url('/');
				})
		}

		
	})

.controller('Edit', function($scope, $http, $routeParams, $location, Upload) {

		function getKey(elem, indx, array) {

		}

		$scope.datepicker = datepicker;
		$http.get('/crud/api/user/' + $routeParams.id)
				.success(function(response) {
					$scope.user = response;
					$scope.images = $scope.user.avatars;
					var d = new Date($scope.user.bdate);
					var year = d.getFullYear();
					var month = d.getMonth();
					var day = d.getDate() - 1;

					$scope.byear = $scope.datepicker.years[($scope.datepicker.years.length) - (year - 1900) - 1];
					$scope.bmonth = $scope.datepicker.months[month];
					$scope.bday = $scope.datepicker.days[day];
					
					console.log($scope.datepicker.months[month], $scope.user.bdate, year, month, day);

				})

		$scope.save = function() {
			$scope.user.bdate = new Date($scope.byear.value, $scope.bmonth.value, $scope.bday.value);
			$scope.errors = [];
			if ($scope.user.name == '') {
				$scope.errors.push("falta su nombre");
			}
			if ($scope.user.byear == '' || $scope.user.bmonth == '' || $scope.user.bday == '') {
				$scope.errors.push("error en fecha de nacimiento");
			}

			if (typeof $scope.user.password != '' && $scope.user.password != $scope.user.rpassword) {
				$scope.errors.push("passwords no coinciden");
			}
			if ($scope.errors.length > 0) {
				return false;
			}

			$http.put('/crud/api/user/' + $scope.user._id, $scope.user)
				.success(function(response){
					console.log(response);
					alert("Datos actualizados :)");
					$location.url('/');
				})
		};

		$scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/crud/api/upload/' + $routeParams.id,
                    fields: {'_id': $routeParams.id},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                	$scope.images.push(data.file);
                }).error(function (data, status, headers, config) {
                	console.log(data);
                  console.log('error status: ' + status);
                })
            }
        }
    };

    $scope.back = function() {
			$location.url('/')
		}	
		
	})

.controller('View', function($scope, $http, $routeParams, $location) {
	$http.get('/crud/api/user/' + $routeParams.id)
		.success(function(response){
			$scope.user = response;
			$scope.images = $scope.user.avatars ? $scope.user.avatars : [];
		})

	$scope.back = function() {
		$location.url('/')
	}	
})

.controller('Upload', function($scope, $http, $routeParams, Upload) {
		$scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
		// $scope.images = []
    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/crud/api/upload/' + $routeParams.id,
                    fields: {'_id': $routeParams.id},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                	$scope.images.push(data.file);
                }).error(function (data, status, headers, config) {
                	console.log(data);
                  console.log('error status: ' + status);
                })
            }
        }
    };	

	});

