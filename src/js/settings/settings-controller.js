angular.module('caribbean-war')
	.controller('settingsCtrl', ['$scope', '$rootScope', 'audioControl', 'locale',
		function($scope, $rootScope, audioControl, locale){
            console.log("-");
            //Localization
            $scope.languages = [
				{id: 0, label:'English', code:'en-EN'},
				{id: 1, label:'Русский', code:'ru-RU'}
			];


            $scope.$watch('langId', function(nVal, oVal){
                if(nVal !== oVal){
                    console.log("DA");
                    localStorage.lang = $scope.lang;
                    locale.get({languageCode:code}, function(data){
                        $scope.localeData = data;
				    });
                }
            });

            $scope.musicVolume = 100;

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
