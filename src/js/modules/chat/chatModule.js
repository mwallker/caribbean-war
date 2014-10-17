angular.module('caribbean-war')
    .directive('chat', ['userStorage', 'connection', function (userStorage, connection) {
        return { 
            templateUrl: 'js/modules/chat/chat-template.html',
            restrict: 'E',
            scope:{},
            link:function($scope){
                $scope.displayChat = false;
            },
            controller: function ($scope, $rootScope) {
                $scope.chatHistory = [];

                $scope.clearChatHistory = function(){
                    $scope.chatHistory = [];
                };

                $scope.toggleChat = function(event, flag){
                    if(!flag) $scope.clearChatHistory();
                    $scope.displayChat = !!flag;
                    console.log($scope.displayChat);
                }

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
                            sender: userStorage.get().nick,
                            message: text
                        });
                        $scope.message = '';
                    }
                };

                $rootScope.$on("chat", $scope.recieveChatMessage);
                $rootScope.$on("toggleChat", $scope.toggleChat);
            }           
        }
    }]);