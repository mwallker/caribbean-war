caribbeanWarApp.factory('locale', ['$resource',
	function($resource){
		return $resource('locale/langs/:languageCode.json');
	}]);