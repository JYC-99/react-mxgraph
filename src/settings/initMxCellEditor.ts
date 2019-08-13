// tslint:disable
import * as mxGraphJs from "mxgraph-js";
import { IMxGraph } from '../types/mxGraph';
// import { registerShape } from "./Shapes";
const {
  mxCellEditor,
  mxClient,
  mxUtils,
  mxConstants,
  mxRectangle,
  mxEvent,
  mxGraph,
} = mxGraphJs;

function initGetLabel(graph: IMxGraph): void {
  graph.setHtmlLabels(true);
  // Truncates the label to the size of the vertex
  // graph.getLabel = function(cell)
  // {
  //   var result = mxGraph.prototype.getLabel.apply(this, arguments);
    
  //   // if (result != null && this.isReplacePlaceholders(cell) && cell.getAttribute('placeholder') == null)
  //   // {
  //   //   result = this.replacePlaceholders(cell, result);
  //   // }
    
  //   return result;
  // };
}

function initDblClick(graph: IMxGraph): void {
  /**
 * Overrides double click handling to add the tolerance and inserting text.
 */
  graph.dblClick = function (evt, cell) {
    if (this.isEnabled()) {
      var pt = mxUtils.convertPoint(this.container, mxEvent.getClientX(evt), mxEvent.getClientY(evt));

      // Automatically adds new child cells to edges on double click
      if (evt != null && !this.model.isVertex(cell)) {
        var state = (this.model.isEdge(cell)) ? this.view.getState(cell) : null;
        var src = mxEvent.getSource(evt);

        if (this.firstClickState == state && this.firstClickSource == src) {
          if (state == null || (state.text == null || state.text.node == null ||
            (!mxUtils.contains(state.text.boundingBox, pt.x, pt.y) &&
              !mxUtils.isAncestorNode(state.text.node, mxEvent.getSource(evt))))) {
            if ((state == null && !this.isCellLocked(this.getDefaultParent())) ||
              (state != null && !this.isCellLocked(state.cell))) {
              // Avoids accidental inserts on background
              if (state != null || (mxClient.IS_VML && src == this.view.getCanvas()) ||
                (mxClient.IS_SVG && src == this.view.getCanvas().ownerSVGElement)) {
                cell = this.addText(pt.x, pt.y, state);
              }
            }
          }
        }
      }

      mxGraph.prototype.dblClick.call(this, evt, cell);
    }
  };
}

function initStartEditing(): void {
  var mxCellEditorStartEditing = mxCellEditor.prototype.startEditing;
  mxCellEditor.prototype.startEditing = function (cell, trigger) {
    mxCellEditorStartEditing.apply(this, arguments);

    // Overrides class in case of HTML content to add
    // dashed borders for divs and table cells
    var state = this.graph.view.getState(cell);

    if (state != null && state.style['html'] == 1) {
      this.textarea.className = 'mxCellEditor geContentEditable';
    }
    else {
      this.textarea.className = 'mxCellEditor mxPlainTextEditor';
    }

    // Toggles markup vs wysiwyg mode
    this.codeViewMode = false;

    // Stores current selection range when switching between markup and code
    this.switchSelectionState = null;

    // Selects editing cell
    this.graph.setSelectionCell(cell);

    // First run cannot set display before supercall because textarea is lazy created
    // Lazy instantiates textarea to save memory in IE
    if (this.textarea == null) {
      this.init();
    }

    // Enables focus outline for edges and edge labels
    var parent = this.graph.getModel().getParent(cell);
    var geo = this.graph.getCellGeometry(cell);

    if ((this.graph.getModel().isEdge(parent) && geo != null && geo.relative) ||
      this.graph.getModel().isEdge(cell)) {
      // Quirks does not support outline at all so use border instead
      if (mxClient.IS_QUIRKS) {
        this.textarea.style.border = 'gray dotted 1px';
      }
      // IE>8 and FF on Windows uses outline default of none
      else if (mxClient.IS_IE || mxClient.IS_IE11 || (mxClient.IS_FF && mxClient.IS_WIN)) {
        this.textarea.style.outline = 'gray dotted 1px';
      }
      else {
        this.textarea.style.outline = '';
      }
    }
    else if (mxClient.IS_QUIRKS) {
      this.textarea.style.outline = 'none';
      this.textarea.style.border = '';
    }
  }

}

function initEditorListener() {
  var cellEditorInstallListeners = mxCellEditor.prototype.installListeners;
  mxCellEditor.prototype.installListeners = function (elt) {
    cellEditorInstallListeners.apply(this, arguments);

    // Adds a reference from the clone to the original node, recursively
    function reference(node, clone) {
      clone.originalNode = node;

      node = node.firstChild;
      var child = clone.firstChild;

      while (node != null && child != null) {
        reference(node, child);
        node = node.nextSibling;
        child = child.nextSibling;
      }

      return clone;
    };

    // Checks the given node for new nodes, recursively
    function checkNode(node, clone) {
      if (clone.originalNode != node) {
        cleanNode(node);
      }
      else {
        node = node.firstChild;
        clone = clone.firstChild;

        while (node != null) {
          var nextNode = node.nextSibling;

          if (clone == null) {
            cleanNode(node);
          }
          else {
            checkNode(node, clone);
            clone = clone.nextSibling;
          }

          node = nextNode;
        }
      }
    };

    // Removes unused DOM nodes and attributes, recursively
    function cleanNode(node) {
      var child = node.firstChild;

      while (child != null) {
        var next = child.nextSibling;
        cleanNode(child);
        child = next;
      }

      if ((node.nodeType != 1 || (node.nodeName !== 'BR' && node.firstChild == null)) &&
        (node.nodeType != 3 || mxUtils.trim(mxUtils.getTextContent(node)).length == 0)) {
        node.parentNode.removeChild(node);
      }
      else {
        // Removes linefeeds
        if (node.nodeType == 3) {
          mxUtils.setTextContent(node, mxUtils.getTextContent(node).replace(/\n|\r/g, ''));
        }

        // Removes CSS classes and styles (for Word and Excel)
        if (node.nodeType == 1) {
          node.removeAttribute('style');
          node.removeAttribute('class');
          node.removeAttribute('width');
          node.removeAttribute('cellpadding');
          node.removeAttribute('cellspacing');
          node.removeAttribute('border');
        }
      }
    };

    // Handles paste from Word, Excel etc by removing styles, classnames and unused nodes
    // LATER: Fix undo/redo for paste
    if (!mxClient.IS_QUIRKS && document.documentMode !== 7 && document.documentMode !== 8) {
      mxEvent.addListener(this.textarea, 'paste', mxUtils.bind(this, function (evt) {
        var clone = reference(this.textarea, this.textarea.cloneNode(true));

        window.setTimeout(mxUtils.bind(this, function () {
          checkNode(this.textarea, clone);
        }), 0);
      }));
    }
  };
}

function initResize() {
  var mxCellEditorResize = mxCellEditor.prototype.resize;
  mxCellEditor.prototype.resize = function (state, trigger) {
    var state = this.graph.getView().getState(this.editingCell);

    if (this.codeViewMode && state != null) {
      var scale = state.view.scale;
      this.bounds = mxRectangle.fromRectangle(state);

      // General placement of code editor if cell has no size
      // LATER: Fix HTML editor bounds for edge labels
      if (this.bounds.width == 0 && this.bounds.height == 0) {
        this.bounds.width = 160 * scale;
        this.bounds.height = 60 * scale;

        var m = (state.text != null) ? state.text.margin : null;

        if (m == null) {
          m = mxUtils.getAlignmentAsPoint(mxUtils.getValue(state.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER),
            mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE));
        }

        this.bounds.x += m.x * this.bounds.width;
        this.bounds.y += m.y * this.bounds.height;
      }

      this.textarea.style.width = Math.round((this.bounds.width - 4) / scale) + 'px';
      this.textarea.style.height = Math.round((this.bounds.height - 4) / scale) + 'px';
      this.textarea.style.overflow = 'auto';

      // Adds scrollbar offset if visible
      if (this.textarea.clientHeight < this.textarea.offsetHeight) {
        this.textarea.style.height = Math.round((this.bounds.height / scale)) + (this.textarea.offsetHeight - this.textarea.clientHeight) + 'px';
        this.bounds.height = parseInt(this.textarea.style.height) * scale;
      }

      if (this.textarea.clientWidth < this.textarea.offsetWidth) {
        this.textarea.style.width = Math.round((this.bounds.width / scale)) + (this.textarea.offsetWidth - this.textarea.clientWidth) + 'px';
        this.bounds.width = parseInt(this.textarea.style.width) * scale;
      }

      this.textarea.style.left = Math.round(this.bounds.x) + 'px';
      this.textarea.style.top = Math.round(this.bounds.y) + 'px';

      if (mxClient.IS_VML) {
        this.textarea.style.zoom = scale;
      }
      else {
        mxUtils.setPrefixedStyle(this.textarea.style, 'transform', 'scale(' + scale + ',' + scale + ')');
      }
    }
    else {
      this.textarea.style.height = '';
      this.textarea.style.overflow = '';
      mxCellEditorResize.apply(this, arguments);
    }
  };

}

function initGetValue() {
  var mxCellEditorGetInitialValue = mxCellEditor.prototype.getInitialValue;
  mxCellEditor.prototype.getInitialValue = function (state, trigger) {
    if (mxUtils.getValue(state.style, 'html', '0') == '0') {
      return mxCellEditorGetInitialValue.apply(this, arguments);
    }
    else {
      var result = this.graph.getEditingValue(state.cell, trigger)

      if (mxUtils.getValue(state.style, 'nl2Br', '1') == '1') {
        result = result.replace(/\n/g, '<br/>');
      }

      result = this.graph.sanitizeHtml(result);

      return result;
    }
  };

  var mxCellEditorGetCurrentValue = mxCellEditor.prototype.getCurrentValue;
  mxCellEditor.prototype.getCurrentValue = function (state) {
    if (mxUtils.getValue(state.style, 'html', '0') == '0') {
      return mxCellEditorGetCurrentValue.apply(this, arguments);
    }
    else {
      var result = this.graph.sanitizeHtml(this.textarea.innerHTML);

      if (mxUtils.getValue(state.style, 'nl2Br', '1') == '1') {
        result = result.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');
      }
      else {
        result = result.replace(/\r\n/g, '').replace(/\n/g, '');
      }

      return result;
    }
  };

  var mxCellEditorApplyValue = mxCellEditor.prototype.applyValue;
  mxCellEditor.prototype.applyValue = function (state, value) {
    // Removes empty relative child labels in edges
    this.graph.getModel().beginUpdate();

    try {
      mxCellEditorApplyValue.apply(this, arguments);

      if (this.graph.isCellDeletable(state.cell)) {
        var stroke = mxUtils.getValue(state.style, mxConstants.STYLE_STROKECOLOR, mxConstants.NONE);
        var fill = mxUtils.getValue(state.style, mxConstants.STYLE_FILLCOLOR, mxConstants.NONE);

        if (mxUtils.trim(value || '') == '' && stroke == mxConstants.NONE && fill == mxConstants.NONE) {
          this.graph.removeCells([state.cell], false);
        }
      }
    }
    finally {
      this.graph.getModel().endUpdate();
    }
  };
}

function initStopEditing() {
  mxCellEditor.prototype.toggleViewMode = function () {
    var state = this.graph.view.getState(this.editingCell);
    var nl2Br = state != null && mxUtils.getValue(state.style, 'nl2Br', '1') != '0';
    var tmp = this.saveSelection();

    if (!this.codeViewMode) {
      // Clears the initial empty label on the first keystroke
      if (this.clearOnChange && this.textarea.innerHTML == this.getEmptyLabelText()) {
        this.clearOnChange = false;
        this.textarea.innerHTML = '';
      }

      // Removes newlines from HTML and converts breaks to newlines
      // to match the HTML output in plain text
      var content = mxUtils.htmlEntities(this.textarea.innerHTML);

      // Workaround for trailing line breaks being ignored in the editor
      if (!mxClient.IS_QUIRKS && document.documentMode != 8) {
        content = mxUtils.replaceTrailingNewlines(content, '<div><br></div>');
      }

      content = this.graph.sanitizeHtml((nl2Br) ? content.replace(/\n/g, '').replace(/&lt;br\s*.?&gt;/g, '<br>') : content);
      this.textarea.className = 'mxCellEditor mxPlainTextEditor';

      var size = mxConstants.DEFAULT_FONTSIZE;

      this.textarea.style.lineHeight = (mxConstants.ABSOLUTE_LINE_HEIGHT) ? Math.round(size * mxConstants.LINE_HEIGHT) + 'px' : mxConstants.LINE_HEIGHT;
      this.textarea.style.fontSize = Math.round(size) + 'px';
      this.textarea.style.textDecoration = '';
      this.textarea.style.fontWeight = 'normal';
      this.textarea.style.fontStyle = '';
      this.textarea.style.fontFamily = mxConstants.DEFAULT_FONTFAMILY;
      this.textarea.style.textAlign = 'left';

      // Adds padding to make cursor visible with borders
      this.textarea.style.padding = '2px';

      if (this.textarea.innerHTML != content) {
        this.textarea.innerHTML = content;
      }

      this.codeViewMode = true;
    }
    else {
      var content = mxUtils.extractTextWithWhitespace(this.textarea.childNodes);

      // Strips trailing line break
      if (content.length > 0 && content.charAt(content.length - 1) == '\n') {
        content = content.substring(0, content.length - 1);
      }

      content = this.graph.sanitizeHtml((nl2Br) ? content.replace(/\n/g, '<br/>') : content)
      this.textarea.className = 'mxCellEditor geContentEditable';

      var size = mxUtils.getValue(state.style, mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE);
      var family = mxUtils.getValue(state.style, mxConstants.STYLE_FONTFAMILY, mxConstants.DEFAULT_FONTFAMILY);
      var align = mxUtils.getValue(state.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT);
      var bold = (mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
        mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD;
      var italic = (mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
        mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC;
      var uline = (mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
        mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE;

      this.textarea.style.lineHeight = (mxConstants.ABSOLUTE_LINE_HEIGHT) ? Math.round(size * mxConstants.LINE_HEIGHT) + 'px' : mxConstants.LINE_HEIGHT;
      this.textarea.style.fontSize = Math.round(size) + 'px';
      this.textarea.style.textDecoration = (uline) ? 'underline' : '';
      this.textarea.style.fontWeight = (bold) ? 'bold' : 'normal';
      this.textarea.style.fontStyle = (italic) ? 'italic' : '';
      this.textarea.style.fontFamily = family;
      this.textarea.style.textAlign = align;
      this.textarea.style.padding = '0px';

      if (this.textarea.innerHTML != content) {
        this.textarea.innerHTML = content;

        if (this.textarea.innerHTML.length == 0) {
          this.textarea.innerHTML = this.getEmptyLabelText();
          this.clearOnChange = this.textarea.innerHTML.length > 0;
        }
      }

      this.codeViewMode = false;
    }

    this.textarea.focus();

    if (this.switchSelectionState != null) {
      this.restoreSelection(this.switchSelectionState);
    }

    this.switchSelectionState = tmp;
    this.resize();
  };
  var mxCellEditorStopEditing = mxCellEditor.prototype.stopEditing;
  mxCellEditor.prototype.stopEditing = function (cancel) {
    // Restores default view mode before applying value
    if (this.codeViewMode) {
      this.toggleViewMode();
    }

    mxCellEditorStopEditing.apply(this, arguments);

    // Tries to move focus back to container after editing if possible
    try {
      this.graph.container.focus();
    }
    catch (e) {
      // ignore
    }
  };
}
// tslint:disable
export function initMxCellEditor(graph: IMxGraph): void {
  initGetLabel(graph);
  /**
		 * HTML in-place editor
		 */
  // mxCellEditor.prototype.escapeCancelsEditing = false;

  // initStartEditing();

  // initEditorListener();

  // initResize();
  
  // initGetValue();

  // initStopEditing();

  /**
   * Returns the background color to be used for the editing box. This returns
   * the label background for edge labels and null for all other cases.
   */
  mxCellEditor.prototype.getBackgroundColor = function (state) {
    var color = null;

    if (this.graph.getModel().isEdge(state.cell) || this.graph.getModel().isEdge(this.graph.getModel().getParent(state.cell))) {
      var color = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, null);

      if (color == mxConstants.NONE) {
        color = null;
      }
    }

    return color;
  };

  mxCellEditor.prototype.getMinimumSize = function (state) {
    var scale = this.graph.getView().scale;

    return new mxRectangle(0, 0, (state.text == null) ? 30 : state.text.size * scale + 20, 30);
  };
  /**
* HTML in-place editor
*/
  mxCellEditor.prototype.isContentEditing = function () {
    var state = this.graph.view.getState(this.editingCell);

    return state != null && state.style['html'] == 1;
  };

}