(function () {

    angular
        .module('common', [])
        .factory('common', function () {

            let common = {};

            /**
             *
             * @param {Scope} scope - angular scope to run $apply from
             * @param {Function} fn
             * @returns {Function}
             */
            common.mustApply = function (scope, fn) {
                let self = this;

                return function () {
                    scope.$apply(fn.apply(self, arguments));
                };
            };

            return common;
        });

})();