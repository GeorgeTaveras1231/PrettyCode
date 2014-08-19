PC.onLoadEvent(function() {
  var toggleButtonCallback = PC.collapse.toggleRelatedButton( 'btn-primary disabled', 'btn-default' );

  // toggle the button related to the open panel
  this.cropPanel.on( 'show.bs.collapse hide.bs.collapse', toggleButtonCallback);
  this.previewPanel.on( 'show.bs.collapse hide.bs.collapse', toggleButtonCallback);

  this.gistContent.hide();

  // user must choose canvas size before submitting
  this.gistForm.on( 'submit', function( e ) {
    
    if( !e.readyToSubmit ){
      e.preventDefault();

      PC.lastEditMode = PC.editMode;
      PC.changeEditMode( 'canvas' );
      PC.canvas.use( 'crop' );

      PC.$.canvasWrapper.addClass( 'modal-crop-state' );

      PC.$.cropPanel
        .append( PC.$.canvasWrapper )
        .collapse( 'show' );

      PC.$.cropModal.modal();

    }
  });

  this.cropModal.on( 'hide.bs.modal', function( e ) {
    PC.$.canvasWrapper.removeClass( 'modal-crop-state' );
    PC.$.originalWrapperDestination.prepend( PC.$.canvasWrapper );

    PC.changeEditMode( PC.lastEditMode || PC.editMode );
    PC.canvas.use( PC.canvas.toolHistory[ 1 ] );
  }); 

  this.infoPopOver.popover({
    container: 'body',
    trigger: 'click hover'
  });

  this.gistVisualURL.on( 'change', function( e ) {
    // enable submit button
    // when the canvas url is ready to submit
    PC.$.cropModalSubmit
      .removeClass( 'btn-default disabled custom-disabled' )
      .addClass( 'btn-success' );

    // enable preview button
    PC.$.prevPanelButton.removeClass( 'custom-disabled' );
  });

  this.cropModalSubmit.on( 'click', function( e ) {
    e.stopPropagation();

    var newName = PC.$.previewPanel.find( '#preview-name' ).val();
    // update the name of the gist to the one submitted at the preview panel
    PC.$.gistName.val( newName );

    PC.$.gistForm.trigger({
      type: 'submit',
      readyToSubmit: true
    });
  });
});