
var Site = function() {
};

Site.prototype = {
  setup: function() {
    this.window     = $(window);
    this.html       = $("html");
    this.body       = this.html.find('body');
    this.loader     = this.body.find('#loader');
    this.initImage  = ['gradient', 'nya', 'nya2', 'nya3', 'albert-einstein', 'haha', 'v', 'chicken' ];
    this.size       = 12;
    this.step       = 15;
    this.backColor  = "#ffffff";
    this.frontColor = "#000000";
    this.prepare();
    this.resize();
    this.init();
    this.observe();
    this.mousemove();
  },

  prepare: function() {
    this.container     = this.body.find('#scene');
    this.canvas        = $('<canvas />').appendTo( this.container );
    this.ctx           = this.canvas[0].getContext('2d');

    this.resultWrapper = this.body.find('#result-wrapper');
    this.result        = this.resultWrapper.find('#result');
    this.close         = this.resultWrapper.find('#close');

    this.source    = new Source(this);
    this.uploader  = new Uploader();
  },

  init: function() {
    this.mypic = true;
    if( this.loading ) return;
    if( this.showResult ) this.hideResult();
    var url = this.initImage.randomGet();
    this.xx('loading');
    this.source.load( 'images/' + url + '.jpg' );
  },

  load: function() {
    this.loading = true;
    this.html.addClass('loading');
  },

  loaded: function() {
    this.loading = false;
    this.html.removeClass('loading');
  },

  xx: function( t ) {
    this.loader.html( t );
  },

  observe: function() {
    this.window.bind("keydown", this.keydown.bind( this ));
    this.body.bind("mousemove", this.mousemove.bind( this ) );
    // this.body.bind("click", this.click.bind( this ) );
    // this.body.bind("touchend", this.touchend.bind( this ) );
    this.canvas[0].addEventListener("drop", this.drop.bind( this ));
    this.canvas[0].addEventListener("dragover", function (event) {
      event.preventDefault();
    }, false);
  },

  mousemove: function( event ) {
    this.html.addClass('move');
    if( this.checkmove ) clearTimeout( this.checkmove );

    this.checkmove = setTimeout( function(){
      this.html.removeClass('move');
    }.bind( this ), 2000)
  },

  // click:function(event){
  //   if(this.html.hasClass("move")){
  //     this.html.removeClass('move');
  //   }else{
  //     // this.html.addClass('move');
  //     this.mousemove();
  //   }
  // },

  // touchend:function(event){
  //   if(this.html.hasClass("move")){
  //     this.html.removeClass('move');
  //   }else{
  //     // this.html.addClass('move');
  //     this.mousemove();
  //   }
  // },

  keydown: function( event ) {
    var key = event.which;
    // xx( key );
    switch( key ) {
      case 82: //r
        this.init();
      break;

      case 83: //s
        this.dosave();
      break;

      case 79: //o
      this.output();
      break;

      case 70: //f
        this.dosave({ share: true });
      break;

      case 67: //c
        this.saveContentToClipboard();
      break;

      case KEY_UP:
      case KEY_RIGHT:
        this.sizeup();
      break;

      case KEY_DOWN:
      case KEY_LEFT:
        this.sizedown();
      break;
    }
  },

  drop: function( event ) {
    var files = event.dataTransfer.files;
    if (files.length <= 0 || this.size < 8 ) return;
    this.clear();
    this.mypic = false;

    var img = new Image();
    img.onload = function( event ) {
      this.root  = event.currentTarget;
      this.ratio = this.root.width / this.root.height;
      this.resize();
    }.bind(this.source);

    var file = files[0];
    if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
      var reader = new FileReader();
      reader.onload = function ( event ) {
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }

    event.preventDefault();
  },

  save_dimension: function() {
    var r = is_retina ? 2 : 1,
        w = this.window.width(),
        h = this.window.height();


    if( this.source.root ) {
      this.owidth    = this.source.width / r;
      this.oheight   = this.source.height / r;
    } else {
      this.owidth    = w;
      this.oheight   = h;
    }
    this.width     = this.owidth * r;
    this.height    = this.oheight * r;

    this.ratio     = w / h;
  },

  resize: function() {
    this.save_dimension();
    
    this.canvas[0].width  = this.width;
    this.canvas[0].height = this.height;

    this.canvas.css({
      width : this.owidth,
      height : this.oheight,
      marginTop : -this.oheight/2,
      marginLeft : -this.owidth/2
    });
    
    // this.container.css('background', this.backColor);
    
    // this.ctx.fillStyle = this.backColor;
    // this.ctx.fillRect( 0, 0, this.width, this.height );
  },

  clear: function() {
    this.ctx.clearRect( 0, 0, this.width, this.height );
  },

  dosave: function( option ) {
    var share = false;
    if( option ) share = option.share;
    if( this.save || site.source.drawing ) return;
    this.save = true;
    this.load();
    this.xx('saving canvas..')
    
    var url = this.canvas[0].toDataURL('image/png');
    if( this.mypic && ! share) {
      this.save = false;
      // window.open( url, "ascii art in chinese by sliiice");
      // openInNewTab(url,"ascii art in chinese by sliiice");
      var title = "newImg_"+new Date().getTime()+"_"+this.width+"_"+this.height+".png";
      downloadImage(url,title);
      this.xx('done')
      this.loaded();
      return;
    } 
    
    $.ajax({
      type: "POST",
      url: "save.php",
      data: { img: url }
    }).done(function( msg ) {
      if( share ) {
        site.uploader.share( BASE + msg );
      }
      this.save = false;
      if( ! share ) {
        // window.open( url, "ascii art in chinese by sliiice");
        // openInNewTab(url,"ascii art in chinese by sliiice");
        var title = "newImg_"+new Date().getTime()+"_"+this.width+"_"+this.height+".png";
        downloadImage(url,title);
        this.xx('done')
        this.loaded();
      }
    }.bind( this ) );
  },

  output: function() {
    if( !is_debug() ) return;
    if( this.showResult ) return this.hideResult();
    this.showResult = true;
    this.result.html( this.source.words );
    this.resultWrapper.addClass('active');
  },

  sizeup: function() {
    if( this.size > 50 ) return;
    this.size += 2;
    this.resetSize();
  },

  sizedown: function() {
    if( this.size < 6 ) return;
    this.size -= this.size > 10 ? 2 : 1;
    this.resetSize();
  },

  resetSize: function() {
    if( this.showResult ) this.hideResult();
    this.source.resize();
    // this.result.style.fontSize = this.size + 'px';
  },

  hideResult: function() {
    this.showResult = false;
    this.resultWrapper.removeClass('active');
  },
  // 复制内容到剪贴板
  saveContentToClipboard: function(){
    var content = this.source.words;
    content = content.replace(/<br \/>/g,"\n");
    copyToClipboard(content);
  }
}

// 复制内容到剪贴板
function copyToClipboard(content) {
  if (window.clipboardData) {
      window.clipboardData.clearData();
      window.clipboardData.setData("Text", content);
  } else {
      function handler(event) {
          event.clipboardData.setData("text/plain", content);
          document.removeEventListener("copy", handler, true);
          event.preventDefault();
      }

      document.addEventListener("copy", handler, true);
      document.execCommand("copy");
  }
}

// 新标签页打开base64图片
function openInNewTab(base64Content,title){
  var  newWindow = window.open(title)
  var html = '<html style="display: block;color: -internal-root-color;"><head><meta name="viewport" content="width=device-width, minimum-scale=0.1"><title>'+title+'</title></head><body style="margin: 0px; background: #0e0e0e;"><img style="-webkit-user-select: none;margin: auto;" src="'+base64Content+'"></body></html>';
  setTimeout(() => {
    newWindow.document.write(html);
  }, 0);
}

// 直接下载图片
function downloadImage(url,title){
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.download = title;
  a.href = url;
  var evt = new MouseEvent('click', {view: window, bubbles: true, cancelable: true});
  a.dispatchEvent(evt);
  document.body.removeChild(a);
}