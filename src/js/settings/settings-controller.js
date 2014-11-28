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
            }

        }]);
