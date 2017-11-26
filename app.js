var _ = require('lodash');

var translationsEng = {
    title: 'Lists App',
    leftName: 'Left list',
    rightName: 'Right list',
    langEng: 'en',
    langPl: 'pl'
};
var translationsPl = {
    title: 'Listy',
    leftName: 'Lista lewa',
    rightName: 'Lista prawa',
    langEng: 'en',
    langPl: 'pl'
};

var myApp = angular.module('myapp', ['ui.tree', 'pascalprecht.translate']);

(function(app){
    "use strict";
    app.controller("getJsonCtrl", function($translate, $scope, $http){
        $http.get('MOCK_DATA.json').then(function(info){
            var objectsArray = info.data;
            $scope.models = {
                lists: {"A": [], "B": []}
            };

            var codeLetterRE = /[a-m]\b/;

            function modelPush (destinationList) {
                _.get($scope.models.lists, destinationList).push(objectsArray[i]);
            }

            for(var i = 0; i < objectsArray.length; i++) {
                if(objectsArray[i]){
                    if (codeLetterRE.test(objectsArray[i].code[0])) {
                        modelPush('A');
                    } else {
                        modelPush('B');
                    }
                } else {
                    alert('wrong JSON file formatting');
                }
            }
        }, function(error) {
            alert('No JSON file loaded.');
        });
    });

    app.controller("langChangeCtrl", function($translate, $scope){
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        }
    });

    app.controller('checkTree', function($scope) {
        $scope.treeOptions = {
            beforeDrop: function(element) {
                var destParent = element.dest.nodesScope;
                var result = true;

                function siblingChecker() {
                    if(element.source.cloneModel && destParent.$$childTail.$modelValue){
                        for(var i = 0; i < destParent.$$childTail.$modelValue.length; i++) {
                            if (destParent.$$childTail.$modelValue[i] && element.source.cloneModel.code === destParent.$$childTail.$modelValue[i].code) {
                                result = false;
                                return result;
                            }
                        }
                    }
                }

                function parentChecker() {

                    destParent = destParent.$parent;
                    if (siblingChecker() === false){
                        return false;
                    }
                    if ((element.source.cloneModel && destParent.$modelValue) && element.source.cloneModel.code === destParent.$modelValue.code){
                        result = false;
                        return result;
                    }else{
                        if(!destParent.$modelValue){
                            result = true;
                            return result;
                        }

                        parentChecker();
                        return result;
                    }
                }
                return parentChecker();
            }
    }});
})(myApp);

myApp.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', translationsEng)
        .preferredLanguage('en');
    $translateProvider.translations('pl', translationsPl);
}]);

myApp.directive("contenteditable", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {
            function read() {
                ngModel.$setViewValue(element.html());
            }
        ngModel.$render = function() {
            element.html(ngModel.$viewValue || "");
        }
        element.bind("blur keyup change", function() {
            scope.$apply(read);
        });
      }
    }
});



