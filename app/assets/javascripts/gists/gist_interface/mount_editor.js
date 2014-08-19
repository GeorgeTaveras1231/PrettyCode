PC.onLoadEvent(function() {
  
  PC.editorHelpers = {
    toAceLang: function( lang ) {
      inputToAceVersion = {
        'C/C++': 'c_cpp'
        // key is as displayed in dropdown
        // value is how ace understands it
      };
      return inputToAceVersion[ lang ] || lang.toLowerCase();
    }
  };

  PC.editor.setTheme( 'ace/theme/eclipse' );
  PC.editor.getSession().setMode( 'ace/mode/text' );

  PC.editor.getSession().on( 'change', function() {

    // update textarea for form submission ------------------|
    PC.$.gistContent.val( PC.editor.getSession().getValue() );
    //-------------------------------------------------------|

    // 'change' the size of the canvas to fit text area ------------------|
    PC.canvas.changeCanvasSize({ width: PC.$.editorContentArea.width() });
    //--------------------------------------------------------------------|
  });

  // synchronize canvas scroll with text editor -----------------------|
  //                                                                   |
  //                                                                   |
  PC.editor.getSession().on( 'changeScrollTop', function( scroll ) {
    PC.canvas.scrollCanvasY( scroll );
  });

  this.editorScrollBar.on( 'scroll', function() {
    PC.canvas.scrollCanvasX( $( this ).scrollLeft() );
  });
  //                                                                   |
  //--------------------------------------------------------------------
});