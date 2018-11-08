/**
 * Created by jollzy on 13/08/2015.
 */
var MyModule = ( function() {

    var privateHello = 'hello twat';

    function doPrivateShit() {
        alert('awww yeaaaa');
    }



    return function() {
        this.myMethod = function() {
            doPrivateShit();
        };

        this.myOtherMethod = function() {
            alert( privateHello );
        };

    };

} )();

var module = new MyModule();
module.myMethod();
module.myOtherMethod();
