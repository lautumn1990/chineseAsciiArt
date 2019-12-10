Uint8ClampedArray.prototype.getAlpha = function( point ){
  return this[ point + 3 ];
}

Uint8ClampedArray.prototype.getGray = function( point ){
  return (this[ point + 0 ] + this[ point + 1 ] + this[ point + 2 ]) / 3;
}

Array.prototype.max = function() {
  return Math.max.apply( null, this );
}

Array.prototype.min = function() {
  return Math.min.apply( null, this );
}

Array.prototype.map = function( bottom, top, round ) {
  var min = this.min(),
      max = this.max(),
      num;

  for( var i = 0 ; i < this.length ; i ++ ) {
    num = this[i];
    num = Math.map( num, min, max, bottom, top );
    if( round ) num = Math.round( num );
    this[i] = num;
  };
  
  return this;
}

Array.prototype.randomGet = function() {
  return this[ Math.floor( Math.random() * this.length ) ];
}