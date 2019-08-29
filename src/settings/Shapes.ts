

// const {
//   mxCylinder,
//   mxUtils,
//   mxCellRenderer,
//   mxConstants,
//   mxStencilRegistry,
//   mxStencil
// } = mxGraphJs;

// // tslint:disable-next-line: export-name
// export function registerShape(): void {
//   // tslint:disable-next-line: function-name
//   function BoxShape(): void {
//     mxCylinder.call(this);
//   }
//   mxUtils.extend(BoxShape, mxCylinder);
//   BoxShape.prototype.extrude = 10;
//   BoxShape.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
//     var dy = this.extrude * this.scale;
//     var dx = this.extrude * this.scale;

//     if (isForeground) {
//       path.moveTo(0, dy);
//       path.lineTo(w - dx, dy);
//       path.lineTo(w, 0);
//       path.moveTo(w - dx, dy);
//       path.lineTo(w - dx, h);
//     } else {
//       path.moveTo(0, dy);
//       path.lineTo(dx, 0);
//       path.lineTo(w, 0);
//       path.lineTo(w, h - dy);
//       path.lineTo(w - dx, h);
//       path.lineTo(0, h);
//       path.lineTo(0, dy);
//       path.lineTo(dx, 0);
//       path.close();
//     }
//   };
//   mxCellRenderer.registerShape('box', BoxShape);
//   //
//   // load from xml
//   const req = mxUtils.load("../../resources/shapes.xml");
//   const root = req.getDocumentElement();
//   let shape = root.firstChild;
//   while (shape) {
//     if (shape.nodeType === mxConstants.NODETYPE_ELEMENT) {
//       mxStencilRegistry.addStencil(shape.getAttribute("name"), new mxStencil(shape));
//     }
//     shape = shape.nextSibling;
//   }
// }
