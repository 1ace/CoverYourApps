'use strict';

var SketchyEmailController = myApp.controller('SketchyEmailController', ['$scope', '$rootScope', '$mdDialog', '$sce',
    function($scope, $rootScope, $mdDialog, $sce) {
        var ctrl = this;
        $scope.sketchyEmail = {};

        // replace USERNAME_HERE with name of user in simulation.
        $scope.module = $scope.$parent.$parent.$parent.$parent.module;
        ctrl.slide.emailData.to = ctrl.slide.emailData.to.replace("USERNAME_HERE", $scope.module.username);
        ctrl.slide.emailData.text = ctrl.slide.emailData.text.replace("USERNAME_HERE", $scope.module.username);

        // Add URL for sketchyUrl simulation if necessary, otherwise leave link
        // field blank.
        if (ctrl.slide.options[1].link != null) {
            $scope.sketchyUrl = ctrl.slide.options[1].link;
        }

        $scope.sketchyEmail.delete = function(ev) {
          if (ctrl.slide.options[0].feedback != ""){
              submitEmail(ev, ctrl.slide.options[0]);
          }
        };

        $scope.sketchyEmail.reply = function(ev) {
          if (ctrl.slide.options[1].feedback != ""){
              submitEmail(ev, ctrl.slide.options[1]);
          }
        };


        // This code sucks - I'm so sorry.
        function feedbackHtml(option) {
            var response = '<h1>' + option.header + '</h1>' +
                '<h4 class="answer">' + $scope.module.quizResponse + '</h4>' +
                '<br />';

            if ($scope.module.quizStatistics) {
                response += '<h3 class="statistics-header" ng-if="$scope.module.quizStatistics">How did you do compared to others?</h3>' +
                    '<div  class="statistics">' + $scope.module.quizStatistics + '</div>';
            }
            return $sce.trustAsHtml(response);
        }

        function submitEmail(ev, option) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            ev.preventDefault();
            $scope.module.submitQuizResponse(option, function() {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .htmlContent(feedbackHtml(option))
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                    .targetEvent(ev)
                );
            });
        };
    }
]);

myApp.component('sketchyEmail', {
    templateUrl: '/components/sketchy-email/sketchyEmail.html',
    controller: 'SketchyEmailController',
    bindings: {
        slide: '<'
    }
});
