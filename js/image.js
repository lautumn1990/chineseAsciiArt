(function(){
var ns = "Source";

window[ns] = function(site) {
  this.site=site;
  this.prepare();
  this.observe();
};

window[ns].prototype = {
  observe: function() {
    this.site.window.bind('resize', this.resize.bind(this) );
  },

  prepare: function() {
    this.step = this.site.step;
    console.log(this.step);
    this.charStep  = new CharStep(this.step);
    this.canvas = document.createElement('canvas');
    this.ctx    = this.canvas.getContext('2d');
  },

  load: function( src ) {

    this.site.load();


    var img = new Image();


    img.onload = function( event ) {
      this.root  = event.currentTarget;
      this.ratio = this.root.width / this.root.height;
      this.resize();
    }.bind(this);

    img.src = src;

  },

  resize: function() {
    if( !this.root || this.drawing ) return;
    this.drawing = true;
    this.save_dimension();
    this.site.resize();
    this.redraw();
    this.site.xx('loaded!');
    this.site.loaded();
  },

  redraw: function() {
    this.drawImage();
    this.getGrayData();
    this.wordup();
    this.drawing = false;
  },

  save_dimension: function() {
    var r = is_retina ? 2 : 1;
    var w, h;
    var padding = 50, scale = 1 - padding*2 / window.innerWidth;

    if( this.ratio > this.site.ratio ) {
      w = ( window.innerWidth * scale );
      h =  w / this.ratio;
    } else {
      h = ( window.innerHeight * scale );
      w = h * this.ratio;
    }
    w = Math.round( w ) * r;
    h = Math.round( h ) * r;
    
    this.width  = w;
    this.height = h;

    this.col = Math.floor( w / this.site.size );
    this.row = Math.floor( h / this.site.size );

    this.canvas.width  = w;
    this.canvas.height = h;
  },

  drawImage: function() {
    this.ctx.drawImage(this.root, 0, 0, this.width, this.height);
    this.imageData = this.ctx.getImageData( 0, 0, this.width, this.height );
  },

  getGrayData: function() {
    this.grayData = [];

    var data = this.imageData.data,
        col  = this.col,
        row  = this.row,
        size = this.site.size,
        start, gray, point;
        
    for( var i = 0 ; i < col * row ; i ++ ) {
      gray = 0;

      start = {
        x: i % col * size,
        y: Math.floor( i / col ) * size
      };

      for( var y = start.y ; y < start.y + size ; y ++ ) {
        for( var x = start.x ; x < start.x + size ; x ++ ) {
          point = ( y * this.width + x );
          gray += data.getGray(point * 4);
        }
      }

      this.grayData.push( gray / (size * size) );
    }

    this.grayData = this.grayData.map( 0, this.site.step - 1, true );
  },

  wordup: function() {
    var size = this.site.size,
        row  = this.row,
        col  = this.col;

    var i    = this.grayData.length;
    var word, level, start;


    this.words = "";
    for ( var i = 0 ; i < this.grayData.length ; i ++ ) {
      level = this.site.step - 1 - this.grayData[i];
      word  = this.charStep.getRandomWord( level );
      start = {
        x: i % col
      };

      this.words += word;
      if( start.x == this.col - 1 ) this.words += "<br />";
    }

    while( i-- ) {
      level = this.site.step - 1 - this.grayData[i];

      word  = this.charStep.getRandomWord( level );
      start = {
        x: i % col * size,
        y: Math.floor( i / col ) * size
      };

      this.site.ctx.font  = "normal "+ size +"px sans-serif";
      this.site.ctx.fillStyle = site.frontColor;
      this.site.ctx.fillText(word, start.x, start.y - 3);
    }
  }
};

})();
