(function($){
var ns = "Uploader";

window[ns] = function() {
};

window[ns].prototype = {
  share: function( url ) {
    site.xx('check permissions');
    this.checkAndUpload(
      {
        name: '♦ sliiice ♦',
        description: 'generate from sliiice | http://sliiice.com',
        message: 'test message'
      }, 
      function(){
        this.addPhoto( this.albumsId, {
          message: "traditional chinese ascii art - http://sliiice.com/app/traditional-ascii", 
          url: url
        });
      }.bind(this)
    );
  },

  checkAndUpload: function( albumParems, callback) {
    this.checkLogin(
      function(){
        this.createAlbum( albumParems, callback )
      }.bind(this)
    );
  },

  loginNow: function( callback ) {
    site.xx('login');
    FB.login( function( response ) {
      if( response.authResponse ) {
        this.access_token = response.authResponse.accessToken;
        this.uid          = response.authResponse.userID;

        if( callback ) {
          callback();
        }
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }.bind( this ), { scope: 'publish_stream, user_photos' } );
  },

  is_not_connected: function( response ) {
    return response.status != 'connected';
  },

  checkLogin: function( callback ) {
    FB.getLoginStatus( function( response ) {
      if( this.is_not_connected( response ) ) return this.loginNow( callback );

      this.access_token = response.authResponse.accessToken;
      this.uid          = response.authResponse.userID;

      if( callback ) callback();
    }.bind( this ) );
  },

  album_is_created: function( params, callbacks, finalcall ) {
    var data, is_exist, id;

    FB.api('/me/albums', { limit: 50 }, function( response ){
      is_exist = false;
      for( var i = 0 ; i < response.data.length ; i ++ ) {
        data = response.data[i];
        if( data.name == params.name ) {
          this.albumsId = data.id;
          is_exist = true;
          break;
        }
      }

      callbacks[is_exist]( finalcall );
    }.bind( this ));
  },

  createAlbum: function( params, callback ) {
    this.album_is_created( params, {
      
      true: function( callback ){
        site.xx( 'uploading now' );
        if( callback ) callback();
      }.bind(this),

      false: function( callback ) {
        site.xx( 'creating sliiice album' );
        FB.api("/" + this.uid + "/albums", 'post', params, function( response ) {
          this.albumsId = response.id;
          if( callback ) callback();
          site.xx( "uploading now" );
        }.bind( this ));
      }.bind(this)
    }, callback);
  },

  addPhoto: function( albumsId, params ) {
    if( !albumsId ) return;
    this.checkLogin(function(){
      this.fbAddPhoto( albumsId, params );
    }.bind( this ));
  },

  fbAddPhoto: function( albumsId, params ) {
    FB.api('/'+ albumsId +'/photos', 'post', params, function ( response ) {
      photoId = response.id;
      // xx( response );
      site.xx('thank you!');
      setTimeout( function(){
        site.loaded();  
      }, 1000);
      
    }.bind( this ));
  },
};

})(jQuery);