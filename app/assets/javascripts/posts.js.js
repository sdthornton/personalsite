// Generated by CoffeeScript 1.6.3
namespace('Site', function(exports) {
  return exports.PostEdit = (function() {
    function PostEdit(el) {
      this.el = el;
      this.createContentEditor();
      this.bindUpdateInput();
      this.createEditElements();
      this.bindEditElements();
      this.watchSelection();
    }

    PostEdit.prototype.createContentEditor = function() {
      this.editor = $('<div />', {
        "class": this.el.attr('class') + " editable",
        id: this.el.attr('id') + "_editable",
        contenteditable: true
      });
      this.editor.insertAfter(this.el);
      return this.el.hide();
    };

    PostEdit.prototype.updateInput = function() {
      return this.el.val(this.editor.html());
    };

    PostEdit.prototype.bindUpdateInput = function() {
      var _this = this;
      return this.editor.on('keyup.updateInput blur.updateInput paste.updateInput', function(e) {
        return _this.updateInput();
      });
    };

    PostEdit.prototype.surroundSelection = function(wrapEl) {
      var newRange, selection, selectionRange;
      wrapEl = document.createElement(wrapEl);
      if (window.getSelection) {
        selection = window.getSelection();
        if (selection.rangeCount) {
          selectionRange = selection.getRangeAt(0).cloneRange();
          selectionRange.surroundContents(wrapEl);
          selection.removeAllRanges();
          selection.addRange(selectionRange);
          if (selectionRange.toString().length === 0) {
            wrapEl.innerHTML = "&#8203";
            newRange = document.createRange();
            newRange.selectNodeContents(wrapEl);
            newRange.collapse(false);
            selection.removeAllRanges();
            return selection.addRange(newRange);
          }
        }
      }
    };

    PostEdit.prototype.setState = function(state, info) {
      return document.execCommand(state, false, info);
    };

    PostEdit.prototype.getState = function(state) {
      return document.queryCommandState(state);
    };

    PostEdit.prototype.createEditElements = function() {
      var _this = this;
      this.editElementsWrap = $('<div />', {
        "class": "edit_elements_wrapper",
        id: "edit_elements_wrapper"
      });
      this.editElementsWrap.insertBefore(this.editor);
      this.editElements = {
        bold: "<button id='make_bold' class='make_bold edit_button state_change' rel='bold'>B</button>",
        italic: "<button id='make_italic' class='make_italic edit_button state_change' rel='italic'>i</button>",
        strikeThrough: "<button id='make_strike' class='make_strike edit_button state_change' rel='strikeThrough'>S&#822</button>",
        underline: "<button id='make_underline' class='make_underline edit_button state_change' rel='underline'>U&#818</button>",
        orderedList: "<button id='make_ordered_list' class='make_ordered_list edit_button state_change' rel='insertorderedlist'>OL</button>",
        unorderedList: "<button id='make_unordered_list' class='make_unordered_list edit_button state_change' rel='insertunorderedlist'>UL</button>",
        justifyLeft: "<button id='make_justify_left' class='make_justify_left edit_button state_change' rel='justifyleft'>Left</button>",
        justifyRight: "<button id='make_justify_right' class='make_justify_right edit_button state_change' rel='justifyright'>Right</button>",
        justifyCenter: "<button id='make_justify_center' class='make_justify_center edit_button state_change' rel='justifycenter'>Center</button>",
        justifyFull: "<button id='make_justify_full' class='make_justify_full edit_button state_change' rel='justifyfull'>Full</button>",
        subscript: "<button id='make_subscript' class='make_subscript edit_button state_change' rel='subscript'>Sub</button>",
        superscript: "<button id='make_superscript' class='make_superscript edit_button state_change' rel='superscript'>Super</button>",
        createLink: "<button id='make_link' class='make_link edit_button state_change has_prompt' rel='createlink' data-promptinfo='{ \"title\": \"Write the URL here\", \"text\": \"http://\" }''>Link</button>",
        removeLink: "<button id='make_unlink' class='make_unlink edit_button state_change' rel='unlink'>Unlink</button>",
        quote: "<button id='make_quote' class='make_quote edit_button state_change format_block' rel='formatblock' data-blockformat='BLOCKQUOTE'>Quote</button>",
        heading: "<select id='make_heading' class='make_heading edit_dropdown state_change format_block' rel='formatblock'>\n  <option value='h1'>Heading 1</option>\n  <option value='h2'>Heading 2</option>\n</select>"
      };
      return $.each(this.editElements, function(i, val) {
        return _this.editElementsWrap.append(val);
      });
    };

    PostEdit.prototype.bindEditElements = function() {
      var _this = this;
      $('button.edit_button').on('click.changeState', function(e) {
        var blockformat, promptInfo, promptText, promptTitle, state;
        e.preventDefault();
        e.stopPropagation();
        state = $(e.target).attr('rel');
        if ($(e.target).hasClass('has_prompt')) {
          promptInfo = $(e.target).data('promptinfo');
          promptTitle = promptInfo.title;
          promptText = promptInfo.text;
          _this.prompt = prompt(promptTitle, promptText);
          if (_this.prompt !== '' && _this.prompt !== 'http://') {
            _this.setState(state, _this.prompt);
          }
        } else if ($(e.target).hasClass('format_block')) {
          blockformat = $(e.target).data('blockformat');
          _this.setState(state, blockformat);
        } else {
          _this.setState(state);
        }
        _this.toggleEditElements();
        _this.editor.find('*').each(function(i, el) {
          return $(el).addClass('post__' + el.nodeName.toLowerCase());
        });
        _this.updateInput();
        return _this.editor.focus();
      });
      return $('select.edit_dropdown').on('change.changeState', function(e) {
        var blockformat, state;
        e.stopPropagation();
        state = $(e.target).attr('rel');
        blockformat = $(e.target).val();
        return _this.setState(state, blockformat);
      });
    };

    PostEdit.prototype.toggleEditElements = function() {
      var node, _results,
        _this = this;
      $('button.edit_button').removeClass('active');
      this.editElementsWrap.children().not('.format_block').each(function(i, el) {
        var elState, state;
        $(el).removeClass('active');
        elState = $(el).attr('rel');
        state = document.queryCommandState(elState);
        if (state) {
          return $(el).addClass('active');
        }
      });
      node = window.getSelection().anchorNode.parentNode;
      _results = [];
      while (node.nodeName !== 'DIV' && node.id !== 'edit_elements_wrapper') {
        $('button.format_block[data-blockformat=' + node.nodeName + ']').addClass('active');
        _results.push(node = node.parentNode);
      }
      return _results;
    };

    PostEdit.prototype.watchSelection = function() {
      var _this = this;
      return this.editor.on('click.watchSelection keyup.watchSelection', function(e) {
        return _this.toggleEditElements();
      });
    };

    return PostEdit;

  })();
});
