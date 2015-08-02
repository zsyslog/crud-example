angular.module('app', ['ngRoute', 'ngResource'])

.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'List',
			templateUrl: 'views/list.html'
		})
		.when('/edit/:id', {
			controller: 'Edit',
			templateUrl: 'views/edit.html'
		})
})

.controller('List', function($scope, $http) {

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
	})

.controller('Edit', function($scope, $http, $routeParams) {

		$scope.user = [];

		$http.get('/crud/api/user/' + $routeParams.id)
				.success(function(response) {
					$scope.user = response;
					console.log($scope.user)
				})

		
	});

