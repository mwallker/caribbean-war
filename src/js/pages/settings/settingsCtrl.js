angular.module('caribbean-war')
	.controller('settingsCtrl', ['$scope', '$rootScope', '$translate', 'audioControl', 'appConfig',
		function($scope, $rootScope, $translate, audioControl, appConfig){

            $scope.musicVolume = 100;
            $scope.languages = appConfig.languages;
            $scope.locale= localStorage.locale || appConfig.languages[0].code;

            //locale
            $scope.$watch('locale', function(newVal, oldVal){
                console.log(newVal);
                if(newVal != oldVal){
                    $translate.use(newVal);
                }
            });

            $scope.saveConfigurations = function () {
                localStorage.locale = $scope.locale;
            };

            $scope.changeVolume = function(target){
                audioControl.changeVolume($scope.musicVolume/100, target);
            };

        }]);
/*
(function () {
    var root = $(document.getElementsByTagName('body'));
    var watchers = [];
    var f = function (element) {
        if (element.data().hasOwnProperty('$scope')) {
            angular.forEach(element.data().$scope.$$watchers, function (watcher) {
                watchers.push(watcher);
            });
        }
        angular.forEach(element.children(), function (childElement) {
            f($(childElement));
        });
    };
    f(root);
    console.log(watchers.length);
})();
*/
