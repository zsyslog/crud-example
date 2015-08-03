app.service('fileUpload', ['$http', function ($http) {
  this.uploadFileToUrl = function(file, uploadUrl){
    var fd = new FormData();
    fd.append('file', file);
    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity
    })
    .success(function(response){
      console.log("sucess:",response);
    })
    .error(function(error, code, c, d){
      console.log("error:",error,code);
      console.log(c);
      console.log(d);
    });
  }
}]);