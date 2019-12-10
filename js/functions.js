function buildAxes( length ) {
  var axes = new THREE.Object3D();

  axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
  axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
  axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
  axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
  axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
  axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

  return axes;

}

function buildAxis( src, dst, colorHex, dashed ) {
  var geom = new THREE.Geometry(),
    mat; 

  if(dashed) {
    mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
  } else {
    mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
  }

  geom.vertices.push( src.clone() );
  geom.vertices.push( dst.clone() );
  geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

  var axis = new THREE.Line( geom, mat, THREE.LinePieces );

  return axis;

}

var is_retina = window.devicePixelRatio > 1;


window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

Math.Random = function( min, max, round ) {
	var num = ( ( Math.random() * ( max - min ) ) + min ); 
	return ( round ) ? Math.round( num ) : num;
}

Math.dist = function( x1, y1, x2, y2 ) {
	var dx = x1 - x2;
	var dy = y1 - y2;
	return Math.sqrt( dx*dx + dy*dy );
}

Array.prototype.do = function( act ) {
  for( var i = 0 ; i < this.length ; i ++ ) {
    this[i][act]();
  };
}

// Physix
var	TO_RADIANS = Math.PI / 180,
	  TO_DEGREES = 180 / Math.PI;

		
/*************************************************************************************************************************/
function _site() {
  if( !window.site) {
    window.site = new Site();
    return window.site;
  }
  
  else return window.site;
}

function google_push( pseudo_url) {
  xx( "google push: " + pseudo_url );
  return _gaq.push(['_trackPageview', pseudo_url]);
}

Math.map = function ( value, a, b, A, B ) {
  // a: min,        b: max
  // A: target.min, B: target.max
  var res = A + ( value - a )*(B - A)/(b - a);
  return res;
}

function is_debug() {
  var url = window.location + '';
  var debug = url.indexOf('debug');
  
  if( debug != -1 ) return true;
  return false;
}

function is_static() {
  var url   = window.location + '';
  var debug = url.indexOf('static');
  
  if( debug != -1 ) return true;
  return false;
}

var KEY_ENTER   = 13,
    KEY_ESC     = 27,
    KEY_SPACE   = 32,
    KEY_P_UP    = 33,
    KEY_P_DOWN  = 34,
    KEY_P_RIGHT = 35,
    KEY_P_LEFT  = 36,
    KEY_LEFT    = 37,
    KEY_UP      = 38,
    KEY_RIGHT   = 39,
    KEY_DOWN    = 40,
    KEY_DEBUG   = 192;

function xx(t) {
  if ( window.console && console.log ) { 
    if( !t && t != 0 ) return console.log('----------');
    return console.log(t); 
  }
  if ( ! document.getElementById('xx') ) return;
  document.getElementById('xx').value += t + '';
}

function appleDevice () {
  return /iPhone|iPad|iPod/.test(window.navigator.userAgent);
}

if (!Function.prototype.bind) {  
  
  Function.prototype.bind = function (oThis) {  
  
    if (typeof this !== "function") // closest thing possible to the ECMAScript 5 internal IsCallable function  
      throw new TypeError("Function.prototype.bind - what is trying to be fBound is not callable");  
  
    var aArgs = Array.prototype.slice.call(arguments, 1),   
        fToBind = this,   
        fNOP = function () {},  
        fBound = function () {  
          return fToBind.apply(this instanceof fNOP ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));      
        };  
  
    fNOP.prototype = this.prototype;  
    fBound.prototype = new fNOP();  
  
    return fBound;  
  
  };  
  
}

// function msie() {
//   return $.browser.msie;
// }

// (function($){
// $.fn.disableSelection = function() {
//   return this.each(function() {           
//     $(this).attr('unselectable', 'on')
//        .css({
//          '-moz-user-select':'none',
//          '-webkit-user-select':'none',
//          'user-select':'none',
//          '-ms-user-select':'none'
//        })
//        .each(function() {
//          this.onselectstart = function() { return false; };
//        });
//   });
// };

// })(jQuery);