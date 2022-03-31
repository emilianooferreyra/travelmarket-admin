angular
    .module('postController', ['store-factories']);

function PostListController($scope, rest, $window, usSpinnerService, modelFactory) {
  usSpinnerService.spin('spinner');
    $scope.module = 'posts';
    $scope.paginate = {
        page: 1,
        skip: 0,
        limit: 15,
        countTotal: 0,
        orderBy: 'createdAt',
        populate: '',
        conditions: ''
    };

    $scope.filtersView = {
      model: $scope.module,
      input: [{
        name: 'Título', //placeholder filter
        model: $scope.module, //model filter, usually same model
        key: 'title', //attribute on model filter
        type: 'text',
        like: true
      }],
      dropdown: []
    };

    //get countTotal for paginate
    modelFactory.count($scope.module, setCount);

    var loadModel = function(skip) {
      var skip_pg = skip || $scope.paginate.skip;
      var condition = '';

      condition = setCond(condition, skip_pg);

      rest().get({
          type: $scope.module,
          params: condition
        }, function(resp) {
            $scope.data = resp;
            //$scope.paginate.countTotal = resp.length;
            usSpinnerService.stop('spinner');
        }, function(error) {
            $scope.data = [];
            usSpinnerService.stop('spinner');
        });
    };

    loadModel();

    $scope.delete = function(id) {
        if (confirm('¿Está seguro de realizar esta acción?')) {
          usSpinnerService.spin('spinner');
            rest().delete({
                id: id,
                type: $scope.module
            }, function(resp) {
                $window.location.reload();
            }, function(error) {
                alert('Hubo un error al eliminar el post.');
                usSpinnerService.stop('spinner');
            });
        }
    };

   $scope.paging = function (event, page, pageSize, total) {
       var skip = (page - 1) * $scope.paginate.limit;
       $scope.paginate.page = page;
       loadModel(skip);
   };

   function setCount(count) {
     $scope.paginate.countTotal = count;
   };

   function setCond(cond, skip_pg) {
     if(!!$scope.paginate.orderBy) {
       cond += 'orderBy=' + $scope.paginate.orderBy + '&';
     } else {
       cond += 'orderBy=createdAt&';
     }

     cond += 'sort=-1&';

     if(!!$scope.paginate.populate) {
       cond += 'populate=' + $scope.paginate.populate + '&';
     }

     cond += 'skip=' + skip_pg + '&';

     if(!!$scope.paginate.limit) {
       cond += 'limit=' + $scope.paginate.limit;
     }

     if(!!$scope.paginate.conditions) {
       cond += '&' + $scope.paginate.conditions;
     }

     return cond;
   }
};

function PostViewController($scope, $routeParams, rest, $location, $sce, usSpinnerService) {
  usSpinnerService.spin('spinner');
    $scope.module = 'posts';

    var loadModel = function() {
        rest().findOne({
            id: $routeParams.id,
            type: $scope.module,
            params: 'populate=front,images'
        }, function(resp) {
            $scope.info = resp;
            usSpinnerService.stop('spinner');
        }, function(error) {
            $scope.info = {};
            usSpinnerService.stop('spinner');
        });
    };

    loadModel();

    $scope.delete = function(id) {
        if (confirm('¿Está seguro de realizar esta acción?')) {
          usSpinnerService.spin('spinner');
            rest().delete({
                id: id,
                type: $scope.module
            }, function(resp) {
              usSpinnerService.stop('spinner');
                $location.path('/' + $scope.module);
            }, function(error) {
                alert('Hubo un error al eliminar el post.');
                usSpinnerService.stop('spinner');
            });
        }
    };

    $scope.getHtml = function(html) {
        return $sce.trustAsHtml(html);
    };
};

function PostCreateController($scope, rest, $location, Upload, $rootScope, usSpinnerService) {
    $scope.module = 'posts';
    $scope.info = {};

    $scope.clearFront = function() {
        $scope.info.front = null;
    };

    $scope.clearImage = function(index) {
        //alert('jeje');
        if ($scope.info.gallery.indexOf(index) === -1) {
            $scope.info.gallery.splice(index, 1);
        }
    };

    $scope.save = function() {
      usSpinnerService.spin('spinner');
        var data = {
            title: $scope.info.title,
            description: $scope.info.description,
            body: $scope.info.body,
            front: $scope.info.front
        };

        if (!!$scope.info.gallery && $scope.info.gallery.length > 0) {
            data.gallery = $scope.info.gallery;
        }
        Upload.upload({
            url: $rootScope.url + "/posts",
            arrayKey: '',
            data: data,
            headers: {
                'Authorization': 'JWT ' + $rootScope.adminglob.currentUser.token
            }
        }).then(function(resp) {
          usSpinnerService.stop('spinner');
            $location.url('/' + $scope.module);
        }, function(error) {
          usSpinnerService.stop('spinner');
        }, function(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log(progressPercentage);
        });
    };
};

function PostEditController($scope, $routeParams, $location, rest, Upload, $rootScope, usSpinnerService) {
  usSpinnerService.spin('spinner');
    $scope.module = 'posts';
    $scope.info = {};
    var deletedImages = [];

    $scope.clearFront = function() {
        $scope.info.front = null;
    };

    $scope.clearImage = function(index) {
        //alert('jeje');
        if ($scope.info.gallery.indexOf(index) === -1) {
            $scope.info.gallery.splice(index, 1);
        }
    };

    $scope.deleteImages = function(index, id) {
      deletedImages.push(id);
      if ($scope.info.images.indexOf(index) === -1) {
          $scope.info.images.splice(index, 1);
      }
    }

    var loadModel = function() {
        rest().findOne({
            id: $routeParams.id,
            type: $scope.module,
            params: 'populate=front,images'
        }, function(resp) {
            $scope.info = resp;
            usSpinnerService.stop('spinner');
        }, function(error) {
            $scope.info = {};
            usSpinnerService.stop('spinner');
        });
    };

    loadModel();

    $scope.save = function() {
        var data = {
            title: $scope.info.title,
            description: $scope.info.description,
            body: $scope.info.body,
        };

        if(!!$scope.info.front && !$scope.info.front.source) {
            data.front = $scope.info.front;
        }
        if(!!deletedImages && deletedImages.length > 0) {
          data.deletedImages = deletedImages;
        }
        if (!!$scope.info.gallery && $scope.info.gallery.length > 0) {
            data.gallery = $scope.info.gallery;
        }

        Upload.upload({
            url: $rootScope.url + "/" + $scope.module + "/" + $routeParams.id,
            method: 'PUT',
            data: data,
            arrayKey: '',
            headers: {
                'Authorization': 'JWT ' + $rootScope.adminglob.currentUser.token
            }
        }).then(function(resp) {
          usSpinnerService.stop('spinner');
            $location.url('/' + $scope.module);
        }, function(error) {
          usSpinnerService.stop('spinner');
        }, function(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log(progressPercentage);
        });
    };
};
