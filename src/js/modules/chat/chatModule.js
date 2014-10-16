angular.module('caribbean-war')
    .directive('chat', function () {
        return { 
            templateUrl: 'js/modules/chat/chat-template.html',
            restrict: 'E',
            scope:{},
            controller: function ($scope, $rootScope, $element, userStorage, connection) {
                $scope.chatHistory = [];

                $scope.clearChatHistory = function(){
                    $scope.chatHistory = [];
                    $scope.$apply();
                };

                $scope.recieveChatMessage = function(event, data){
                    if($scope.chatHistory.length >= 50) $scope.chatHistory.shift();

                    $scope.chatHistory.push({
                        from:data.sender,
                        message:data.message
                    });

                    $scope.$apply();
                };

                $scope.sendChatMessage = function(){
                    var text = $scope.message;

                    if(text){
                        connection.send("chat", {
                            sender: userStorage.get().nickname,
                            message: text
                        });
                        $scope.message = '';
                    }
                };

                $rootScope.$on("chat", $scope.recieveChatMessage);
            }           
        }
    });