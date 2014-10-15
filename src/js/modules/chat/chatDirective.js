angular.module('caribbean-war')
    .directive('chat', function () {
        return { 
            templateUrl: 'js/modules/chat/chat-template.html',
            restrict: 'E',
            scope:{},
            controller: function ($scope, $element, $attrs, userStorage, connection, events) {
                $scope.chatHistory = [];

                $scope.recieveChatMessage = function(data){
                    if($scope.chatHistory.length >=10) $scope.chatHistory.shift();

                    $scope.chatHistory.push({
                        from:data.sender,
                        message:data.message
                    });
                };

                $scope.sendChatMessage = function(){
                    connection.send("chat", {
                        sender:userStorage.get().nickname,
                        message:$scope.message
                    });
                };

                events.subscribe("chat", $scope.recieveChatMessage, $scope);
            }           
        }
    });