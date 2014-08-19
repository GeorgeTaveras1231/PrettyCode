PC.onLoadEvent(function() {

  // create crop tool
  // this tool is specific for our application
  // unlike to tools defined in canvas/canvas_config
  // which are generic tools that do not use
  // any environment information
  //
  // each function is a hook to a particular event
  // during the lifecycle of a stroke
  //    e -> eventData
  //    c -> canvasData

  PC.canvas.registerTool( 'crop', {
    begin: function( e ) {/* do nothing */},
    move: function( e, c ) {
      var
        canvas    = c.mainObject,
        context   = c.context,
        currentX  = Math.floor( c.x ),
        currentY  = Math.floor( c.y );

      canvas.cursor( 'crosshair' );
      canvas.render();
      context.lineWidth = 1 ;
      context.font = "12px courier";
      context.fillStyle = Canvas.helpers.hexToRGB( '#666' , 1 );
      context.fillText(  "(" + currentX +', ' + currentY + ")", currentX, currentY );
      context.strokeStyle = Canvas.helpers.hexToRGB( '#666' , 1 );
      context.strokeRect( 0, 0, currentX, currentY );
    },
    end: function( e, c ) {
      var
        canvas    = c.mainObject,
        currentX  = c.x,
        currentY  = c.y,
        url,
        data;

      canvas.render();

      url = canvas.toDataURLcrop({
        width: currentX,
        height: currentY
      });


      data = {
        gist: {
          name: PC.$.gistName.val(),
          content: PC.$.gistContent.val(),
          language: PC.$.gistLanguage.val(),
          visual_attributes: {
            url: url
          }
        },
        preview: true
      };

      $.post( '/gists', data, function( response )  {

        PC.$.previewPanel
          .html( response )
          .collapse( 'show' );

        PC.adjustGistSize( PC.$.previewPanel.find( '.gist' ), {
          image    : '.gist-canvas',
          lineCount: '.line-numbers',
          body     : '.gist-body',
          code     : '.code'
        });

        PC.$.cropPanel
            .collapse( 'hide' );
      });

      // set the image url of hidden field
      // this is important for form submission -----|
      PC.$.gistVisualURL.val( url ).trigger( 'change' );
      //--------------------------------------------|
    }
  });
});