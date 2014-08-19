// create custom drag even
$( document ).on( 'mousedown mouseup mousemove', '*', function( e ) {
  var 
    $this     = $( this ),
    offset    = $this.offset(),
    eventData = {
      // e.offset_ for Chrome
      // Mozilla only supports e.client_
      offsetX: e.offsetX || e.clientX - offset.left,
      offsetY: e.offsetY || e.clientY - offset.top
    };

  if( e.type === 'mousedown') {
    eventData.type = 'drag:begin';
    $this.data( 'mousedown', true );

  }else if( e.type === 'mouseup' ){
    eventData.type = 'drag:end';
    $this.data('mousedown', false);

  }else if( e.type === 'mousemove' && $this.data('mousedown') ) {
    eventData.type = 'drag:move';
  }

  if( eventData.type ){
    $this.trigger( eventData );
  }

});