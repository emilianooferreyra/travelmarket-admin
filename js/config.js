/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config(
  $routeProvider,
  $ocLazyLoadProvider,
  jwtOptionsProvider,
  $httpProvider,
  $middlewareProvider,
  usSpinnerConfigProvider
) {
  $ocLazyLoadProvider.config({
    // Set to true if you want to see what and when is dynamically loaded
    debug: false,
  });

  jwtOptionsProvider.config({
    unauthenticatedRedirectPath: "/login",
    whiteListedDomains: ["localhost"],
  });

  $httpProvider.interceptors.push("jwtInterceptor");

  usSpinnerConfigProvider.setDefaults({
    lines: 10, // The number of lines to draw

    length: 40, // The length of each line

    width: 20, // The line thickness

    radius: 49, // The radius of the inner circle

    scale: 0.35, // Scales overall size of the spinner

    corners: 1, // Corner roundness (0..1)

    color: "#1ab394", //Odin: '#ff386a'  MarcaBA: '#19c3e3'

    opacity: 0.3, // Opacity of the lines

    rotate: 5, // The rotation offset

    direction: 1, // 1: clockwise, -1: counterclockwise

    speed: 1, // Rounds per second

    trail: 63, // Afterglow percentage

    fps: 20, // Frames per second when using setTimeout() as a fallback for CSS

    zIndex: 2e9, // The z-index (defaults to 2000000000)

    className: "spinner", // The CSS class to assign to the spinner

    top: "50%", // Top position relative to parent

    left: "50%", // Left position relative to parent

    shadow: false, // Whether to render a shadow

    hwaccel: false, // Whether to use hardware acceleration

    position: "fixed", // Element positioning
  });

  $routeProvider
    .when("/", {
      templateUrl: "views/main.html",
      controller: HomeController,
    })
    .when("/login", {
      templateUrl: "views/login.html",
      controller: LoginController,
    })
    //Packages
    .when("/packages", {
      templateUrl: "views/package/list.html",
      controller: PackageListController,
      data: {
        pageTitle: "Paquetes",
      },
    })
    .when("/packages/new", {
      templateUrl: "views/package/add.html",
      controller: PackageCreateController,
      data: {
        pageTitle: "Creación de paquete",
      },
    })
    .when("/packages/:id/view", {
      templateUrl: "views/package/view.html",
      controller: PackageViewController,
      data: {
        pageTitle: "Detalle de paquete",
      },
    })
    .when("/packages/:id/edit", {
      templateUrl: "views/package/edit.html",
      controller: PackageEditController,
      data: {
        pageTitle: "Edición de paquete",
      },
    }) //Clients
    .when("/clients", {
      templateUrl: "views/client/list.html",
      controller: ClientListController,
      data: {
        pageTitle: "Clientes",
      },
    })
    .when("/clients/new", {
      templateUrl: "views/client/add.html",
      controller: ClientCreateController,
      data: {
        pageTitle: "Creación de cliente",
      },
    })
    .when("/clients/:id/view", {
      templateUrl: "views/client/view.html",
      controller: ClientViewController,
      data: {
        pageTitle: "Detalle de cliente",
      },
    })
    .when("/clients/:id/edit", {
      templateUrl: "views/client/edit.html",
      controller: ClientEditController,
      data: {
        pageTitle: "Edición de cliente",
      },
    })
    //Post
    .when("/posts", {
      templateUrl: "views/post/list.html",
      controller: PostListController,
      data: {
        pageTitle: "Post",
      },
    })
    .when("/posts/new", {
      templateUrl: "views/post/add.html",
      controller: PostCreateController,
      data: {
        pageTitle: "Creación de post",
      },
    })
    .when("/posts/:id/view", {
      templateUrl: "views/post/view.html",
      controller: PostViewController,
      data: {
        pageTitle: "Detalle de post",
      },
    })
    .when("/posts/:id/edit", {
      templateUrl: "views/post/edit.html",
      controller: PostEditController,
      data: {
        pageTitle: "Edición de post",
      },
    })
    //Providers
    .when("/providers", {
      templateUrl: "views/provider/list.html",
      controller: ProviderListController,
      data: {
        pageTitle: "Proveedores",
      },
    })
    .when("/providers/new", {
      templateUrl: "views/provider/add.html",
      controller: ProviderCreateController,
      data: {
        pageTitle: "Creación de proveedor",
      },
    })
    .when("/providers/:id/view", {
      templateUrl: "views/provider/view.html",
      controller: ProviderViewController,
      data: {
        pageTitle: "Detalle de proveedor",
      },
    })
    .when("/providers/:id/edit", {
      templateUrl: "views/provider/edit.html",
      controller: ProviderEditController,
      data: {
        pageTitle: "Edición de proveedor",
      },
    })
    //Ventas
    .when("/sales", {
      templateUrl: "views/sale/list.html",
      controller: SaleListController,
      data: {
        pageTitle: "Ventas",
      },
    })
    .when("/sales/new", {
      templateUrl: "views/sale/add.html",
      controller: SaleCreateController,
      data: {
        pageTitle: "Creación de venta",
      },
    })
    .when("/sales/:id/view", {
      templateUrl: "views/sale/view.html",
      controller: SaleViewController,
      data: {
        pageTitle: "Detalle de venta",
      },
    })
    .when("/sales/:id/edit", {
      templateUrl: "views/sale/edit.html",
      controller: SaleEditController,
      data: {
        pageTitle: "Edición de venta",
      },
    })

    //Pagos
    .when("/pays/:id/:typePay", {
      templateUrl: "views/pay/list.html",
      controller: PayListController,
      data: {
        pageTitle: "Pagos",
      },
    })
    .when("/pays/new/:id/:typePay", {
      templateUrl: "views/pay/add.html",
      controller: PayCreateController,
      data: {
        pageTitle: "Creación de pago",
      },
    })
    .when("/pays/:id/view", {
      templateUrl: "views/pay/view.html",
      controller: PayViewController,
      data: {
        pageTitle: "Detalle de pago",
      },
    })
    .when("/pays/:id/edit", {
      templateUrl: "views/pay/edit.html",
      controller: PayEditController,
      data: {
        pageTitle: "Edición de pago",
      },
    })

    //Pagos a proveedores
    .when("/providerpayments", {
      templateUrl: "views/providerpayment/list.html",
      controller: ProviderPaymentListController,
      data: {
        pageTitle: "Pagos a proveedores",
      },
    })
    .when("/providerpayments/new", {
      templateUrl: "views/providerpayment/add.html",
      controller: ProviderPaymentCreateController,
      data: {
        pageTitle: "Creación de pago",
      },
    })
    .when("/providerpayments/:id/view", {
      templateUrl: "views/providerpayment/view.html",
      controller: ProviderPaymentViewController,
      data: {
        pageTitle: "Detalle de pago",
      },
    })
    .when("/providerpayments/:id/edit", {
      templateUrl: "views/providerpayment/edit.html",
      controller: ProviderPaymentEditController,
      data: {
        pageTitle: "Edición de pago",
      },
    })
    .otherwise({ redirectTo: "/" });

  $middlewareProvider.map({
    /** Let everyone through */
    everyone: [
      "$cookieStore",
      "$rootScope",
      "$http",
      "$location",
      "jwtHelper",
      function everyoneMiddleware(
        $cookieStore,
        $rootScope,
        $http,
        $location,
        jwtHelper
      ) {
        if ($location.path() == "/login") {
          this.next();
        } else {
          $rootScope.adminglob = $cookieStore.get("adminglob") || {};
          if ($rootScope.adminglob.currentUser) {
            if (
              jwtHelper.isTokenExpired($rootScope.adminglob.currentUser.token)
            ) {
              this.redirectTo("login");
            } else {
              $http.defaults.headers.common["authorization"] =
                $rootScope.adminglob.currentUser.token; // jshint ignore:line
              this.next();
            }
          } else {
            var restrictedPage = $.inArray($location.path(), ["/login"]) === -1;
            var loggedIn = $rootScope.adminglob.currentUser;
            if (restrictedPage && !loggedIn) {
              this.redirectTo("login");
            } else {
              this.next();
            }
          }
        }
      },
    ],
  });

  $middlewareProvider.global(["everyone"]);
}
angular
  .module("inspinia")
  .config(config)
  .run(function (
    $rootScope,
    authManager,
    $cookieStore,
    AuthenticationService,
    $location
  ) {
    $rootScope.logged = sessionStorage.getItem("logged") || false;
    $rootScope.adminglob = $cookieStore.get("adminglob") || {};

    $rootScope.url = "https://travelmarket-admin-2.onrender.com/api";
    authManager.redirectWhenUnauthenticated();

    $rootScope.logout = function () {
      sessionStorage.removeItem("logged");
      AuthenticationService.ClearCredentials();
      $location.url("/login");
    };

    $rootScope.$on("$routeChangeSuccess", function (e, current, pre) {
      $rootScope.actualUrl = current.$$route.originalPath;
    });

    $rootScope.isActive = function (viewLocation) {
      return viewLocation === $rootScope.actualUrl;
    };
    $rootScope.isActiveEdit = function (viewLocation) {
      return "/" + viewLocation + "/:id/edit" === $rootScope.actualUrl;
    };
  });
