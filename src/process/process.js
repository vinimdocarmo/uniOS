(function () {

    var id = 0;

    angular
        .module('process', [])
        .service('Process', Process);

    function Process() {
        function Process() {
            this.id = ++id;
        }

        return Process;
    }

})();