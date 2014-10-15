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

                    console.log(data);

                    $scope.chatHistory.push({
                        from:data.sender,
                        message:data.message
                    });

                    $scope.$apply();

                    console.log($scope.chatHistory);
                    return $scope.chatHistory;
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