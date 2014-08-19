// register tools
// each function is a hook to a particular event
// during the lifecycle of a stroke
//    e -> eventData
//    c -> canvasData

Canvas.registerTool( 'pencil', {
  begin: function( e, c ) {
    var canvas = c.mainObject;

    canvas.exec( 'beginPath' );
  },
  move: function( e, c ) {
    var
      canvas    = c.mainObject,
      x         = c.x,
      y         = c.y,
      color     = c.color,
      brushSize = c.brushSize,
      opacity   = c.opacity;

      canvas.render();
      canvas.exec( 'arc', [ x, y, 0, 0, 0, false ] );
      canvas.assign( 'lineWidth', brushSize );
      canvas.assign( 'strokeStyle', Canvas.helpers.hexToRGB( color, opacity ) );
      canvas.exec( 'stroke' );
  },
  end: function( e, c ) {
    var canvas = c.mainObject;

    canvas.exec( 'closePath' );
    canvas.cacheLayer();
    canvas.cacheCanvas();
    canvas.clearCache();
  }
});


Canvas.registerTool( 'eraser', {
  begin: function( e, c ){
    var canvas = e.canvas.mainObject;

    c.toolStateData.prevComp = c.context.globalCompositeOperation;
    canvas.exec( 'beginPath' );
  },
  move: function( e, c ){
    var
      canvas    = c.mainObject,
      x         = c.x,
      y         = c.y,
      brushSize = c.brushSize;


      canvas.assign( 'globalCompositeOperation', 'destination-out' );
      canvas.assign( 'strokeStyle', '#fff' );
      canvas.assign( 'lineWidth', brushSize );
      canvas.exec( 'arc', [ x, y, 0, 0, 0, false ] );
      canvas.exec( 'stroke' );
  },
  end: function( e, c ){
    var canvas = c.mainObject;

    canvas.assign( 'globalCompositeOperation', c.toolStateData.prevComp );
    canvas.exec( 'closePath' );

    canvas.cacheCanvas();
  }
});


Canvas.registerTool( 'empty_box', {
  begin: function( e, c ){

    c.toolStateData.beginCoordinates = c.toolStateData.beginCoordinates || [];
    c.toolStateData.beginCoordinates.unshift( { x: c.x , y: c.y } );
  },
  move: function( e, c ){
    var
      canvas    = c.mainObject,
      origin    = c.toolStateData.beginCoordinates[ 0 ],
      originX   = origin.x,
      originY   = origin.y,
      currentX  = c.x,
      currentY  = c.y,
      brushSize = c.brushSize,
      color     = c.color,
      opacity   = c.opacity;

    canvas.cursor( 'crosshair' );
    canvas.render();
    canvas.assign( 'lineWidth', brushSize );
    canvas.assign( 'strokeStyle', Canvas.helpers.hexToRGB( color, opacity ) );
    canvas.exec( 'strokeRect', [ originX, originY, currentX - originX, currentY - originY ]  );
  },
  end: function( e, c ){
    var canvas = c.mainObject;

    canvas.cacheLayer();
    canvas.cacheCanvas();
    canvas.clearCache();
  }
});

Canvas.registerTool( 'filled_box', {
  begin: function( e, c ){

    c.toolStateData.beginCoordinates = c.toolStateData.beginCoordinates || [];
    c.toolStateData.beginCoordinates.unshift( { x: c.x , y: c.y } );
  },
  move: function( e, c ){
    var
      canvas    = c.mainObject,
      origin    = c.toolStateData.beginCoordinates[ 0 ],
      originX   = origin.x,
      originY   = origin.y,
      currentX  = c.x,
      currentY  = c.y,
      brushSize = c.brushSize,
      color     = c.color,
      opacity   = c.opacity;

    canvas.cursor( 'crosshair' );
    canvas.render();
    canvas.assign( 'fillStyle', Canvas.helpers.hexToRGB( color, opacity ) );
    canvas.exec( 'fillRect', [ originX, originY, currentX - originX, currentY - originY ]  );
  },
  end: function( e, c ){
    var canvas = c.mainObject;

    canvas.cacheLayer();
    canvas.cacheCanvas();
    canvas.clearCache();
  }
});

Canvas.registerTool( 'line', {
  begin: function( e, c ){
    var canvas = c.mainObject;

    c.toolStateData.beginCoordinates = c.toolStateData.beginCoordinates || [];
    c.toolStateData.beginCoordinates.unshift( { x: c.x, y: c.y } );
    

  },
  move: function( e, c ){
    var
      canvas    = c.mainObject,
      origin    = c.toolStateData.beginCoordinates[ 0 ],
      originX   = origin.x,
      originY   = origin.y,
      currentX  = c.x,
      currentY  = c.y,
      brushSize = c.brushSize,
      color     = c.color,
      opacity   = c.opacity;

    canvas.cursor( 'crosshair' );
    canvas.render();
    canvas.exec( 'beginPath' );

    canvas.exec( 'moveTo', [ originX, originY ] );
    canvas.exec( 'lineTo', [ currentX, currentY ] );
    canvas.assign( 'lineWidth', brushSize );
    canvas.assign( 'strokeStyle', Canvas.helpers.hexToRGB( color, opacity ) );
    canvas.exec( 'stroke' );

    canvas.exec( 'closePath' );
    
  },
  end: function( e, c ){
    var canvas = c.mainObject;

    canvas.cacheLayer();
    canvas.cacheCanvas();
    canvas.clearCache();

  }
});

Canvas.registerTool('arrow', {
  begin: function( e, c ){
    var canvas = c.mainObject;

    c.toolStateData.beginCoordinates = c.toolStateData.beginCoordinates || [];
    c.toolStateData.beginCoordinates.unshift( { x: c.x, y: c.y });
  },

  move: function( e, c ){
    var 
      canvas    = c.mainObject,
      origin    = c.toolStateData.beginCoordinates[ 0 ],
      originX   = origin.x,
      originY   = origin.y,
      currentX  = c.x,
      currentY  = c.y,
      brushSize = c.brushSize,
      color     = c.color,
      opacity   = c.opacity,
      angle     = Math.atan2( currentX - originX, currentY - originY );

    canvas.cursor( 'crosshair' );

    canvas.render();
    canvas.exec('beginPath');

    canvas.exec( 'moveTo', [ originX, originY ] );
    canvas.exec( 'lineTo', [ currentX, currentY ] );
    canvas.assign( 'lineWidth', brushSize );
    canvas.assign( 'strokeStyle', Canvas.helpers.hexToRGB(color, opacity) );

    canvas.exec( 'save' );
    canvas.exec( 'translate', [ currentX, currentY ] );
    canvas.exec( 'rotate', [ -angle ] );
    canvas.exec( 'moveTo', [ 0, 0 ] );
    canvas.exec( 'lineTo', [ -(brushSize + 10), -(brushSize + 10) ] );
    canvas.exec( 'moveTo', [ 0, 0 ] );
    canvas.exec( 'lineTo', [ brushSize + 10,  -(brushSize + 10) ] );
    canvas.exec( 'stroke' );
    canvas.exec( 'restore' );
  },

  end: function( e, c ){
    var canvas = c.mainObject;

    canvas.cacheLayer();
    canvas.cacheCanvas();
    canvas.clearCache();
  }

});

// The following is still under construction
// We want to allow the users to move each individual part of their drawing
// separate from the whole drawing
//
// move
// Canvas.registerTool( 'move', {
//   begin: function( e ){
//     var
//       canvas = e.canvas.mainObject,
//       x      = e.canvas.x,
//       y      = e.canvas.y;

//     e.canvas.toolStateData.beginCoordinates = e.canvas.toolStateData.beginCoordinates || [];
//     e.canvas.toolStateData.beginCoordinates.unshift( { x: x, y: y } );
    

//   },
//   move: function( e ){
//     var
//       canvas         = e.canvas.mainObject,
//       context        = e.canvas.context,
//       origin         = e.canvas.toolStateData.beginCoordinates[ 0 ],
//       originX        = origin.x,
//       originY        = origin.y,
//       currentX       = e.canvas.x,
//       currentY       = e.canvas.y,
//       layers         = canvas.layerStack,
//       currentLayer   = canvas.currentLayer;

//       currentLayer.changePosition({ x: currentX - originX, y: currentY - originY });
//       canvas.clear();
//       layers.forEach(function( layer ){
//         layer.draw( context );
//       });

//   },
//   end: function( e ){    
//     var 
//       canvas       = e.canvas.mainObject,
//       currentLayer = canvas.currentLayer;

//     currentLayer.resetPosition();
    
//     canvas.cacheCanvas();

//   }
// });
