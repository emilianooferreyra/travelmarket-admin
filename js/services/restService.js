(function () {
    var app = angular.module('store-factories', []);

    app.factory('rest', ['$resource', '$location', '$rootScope', '$injector', 'jwtHelper', function ($resource, $location, $rootScope, $injector, jwtHelper) {
            return function ($url) {
                var token = $rootScope.adminglob.currentUser.token;
                $url = ($url == null) ? $rootScope.url + '/:type' : $url;

                if (jwtHelper.isTokenExpired(token)) {
                    $location.path('login');
                }

                return $resource($url, {
                    type: ''
                }, {
                    count: {
                        url: $url + "/count?:params",
                        method: 'GET',
                        transformResponse: function (data) {
                            if (data) {
                                var json = JSON.parse(data);
                                return angular.fromJson(json);
                            }
                        },
                        interceptor: {
                            responseError: handError
                        }
                    },
                    countClient: {
                        url: $url + "/findByClient/count?:params",
                        method: 'GET',
                        transformResponse: function (data) {
                            if (data) {
                                var json = JSON.parse(data);
                                return angular.fromJson(json);
                            }
                        },
                        interceptor: {
                            responseError: handError
                        }
                    },
                    countProvider: {
                        url: $url + "/findProvider/count?:params",
                        method: 'GET',
                        transformResponse: function (data) {
                            if (data) {
                                var json = JSON.parse(data);
                                return angular.fromJson(json);
                            }
                        },
                        interceptor: {
                            responseError: handError
                        }
                    },
                    get: {
                        url: $url + "?:params",
                        method: 'GET',
                        transformResponse: function (data) {
                            return angular.fromJson(data);
                        },
                        isArray: true,
                        interceptor: {
                            responseError: handError
                        }
                    },
                    getClient: {
                        url: $url + "/findByClient?:params",
                        method: 'GET',
                        transformResponse: function (data) {
                            return angular.fromJson(data);
                        },
                        isArray: true,
                        interceptor: {
                            responseError: handError
                        }
                    },
                    getProvider: {
                        url: $url + "/findProvider?:params",
                        method: 'GET',
                        transformResponse: function (data) {
                            return angular.fromJson(data);
                        },
                        isArray: true,
                        interceptor: {
                            responseError: handError
                        }
                    },
                    findOne: {
                        url: $url + "/:id?:params",
                        method: 'GET',
                        transformResponse: function (data) {
                            if (data) {
                                var json = JSON.parse(data);
                                return angular.fromJson(json);
                            }
                        },
                        interceptor: {
                            responseError: handError
                        }
                    },
                    'save': {
                        url: $url,
                        method: 'POST',
                        headers: {
                            'authorization': 'JWT ' + token,
                        },
                        interceptor: {
                            responseError: handError
                        },
                        transformResponse: function (data) {
                            if (data) {
                                return angular.fromJson(data);
                            }
                        }
                    },
                    'delete': {
                        url: $url + "/:id",
                        method: 'DELETE',
                        headers: {
                            'authorization': 'JWT ' + token,
                        },
                        interceptor: {
                            responseError: handError
                        },
                        transformResponse: function (data) {
                        }
                    },
                    'update': {
                        url: $url + "/:id",
                        method: 'PUT',
                        headers: {
                            'authorization': 'JWT ' + token,
                        },
                        interceptor: {
                            responseError: handError
                        },
                        transformResponse: function (data) {
                            if (data) {
                                return angular.fromJson(data);
                            }
                        }
                    }
                });
            }


            function handError(e) {
                params = JSON.stringify(e.data) || " "
                if (!!e.data) {
                    if (e.data.code == "E_VALIDATION") {
                        params = validationErrors(e.data);
                    }
                    if (e.data.code == "E_INTERNAL_SERVER_ERROR" && (e.data.message == "jwt expired" || e.data.message == "invalid signature")) {
                        $location.path('login');
                    }
                }
            }

            function validationErrors(data) {
                var data = data.data;
                var returntext = "";
                for (d in data) {
                    for (r in data[d]) {
                        returntext = "<b>SERVER VALIDATIONS: </b> <br><p>Rule: " + data[d][r].rule + " <br>Message: " + data[d][r].message + " </p>";
                    }
                }

                return returntext
            }
        }]);
})();


///fdfasdf@dfdf.c
