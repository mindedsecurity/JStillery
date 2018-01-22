/* Plugin */
(function($) {
  var JStillery = function(element, options) {
    var element = $(element);
    var obj = this;

    // Settings
    var settings = $.extend({
      id: new Date().valueOf(),
      title: 'Source Panel',
      editor: {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
      }
    }, options || {});

    /* Methods */

    var _init = function(element) {
      return this;
    };

    this._initEditorPanel = function(element) {
      // Classes
      element.addClass("panel panel-default");

      // Append Panel Header 
      var panel_header = $(
        '<div class="panel-heading">'
        + settings.title
        /*+ '  <div class="btn-group btn-group-sm pull-right">'
        + '  <button class="btn btn-link"><i class="fa fa-keyboard-o fa-lg"></i></button>'                
        + '  </div>'*/
        + '</div>'
      );
      element.append(panel_header);

      // Append Panel Menu
      var panel_menu = $(
        '<div class="panel-subheader">'
        + '  <div class="btn-group">'
        + '    <button class="btn-action-beautify btn btn-default"><i class="fa fa-fw fa-magic"></i> Beautify</button>'
        + '    <button class="btn-action-deobfuscate btn btn-default"><i class="fa fa-fw fa-eye-slash"></i> Deobfuscate</button>'
        //+ '    <button class="btn-action-deobfuscate-jser btn btn-default"><i class="fa fa-fw fa-eye-slash"></i> Deobfuscate With JSer</button>'
        + '  </div>'
        + '  <div class="btn-group">'
        + '    <button style="pointer-events:all" class="btn-action-dynamicpoc btn btn-default disabled" data-toggle="tooltip" data-placement="bottom" title="Generate POC for Dynamic Analysis">&nbsp;<i class="fa fa-fw fa-gamepad"></i>&nbsp;</button>'
        + '  </div>'
        + '  <div class="btn-group pull-right">  '
        + '    <a class="btn-keyboard btn btn-default" title="keyboard shortcuts" data-toggle="modal" data-target="#help-modal"><span class="fa fa-keyboard-o" aria-hidden="true"></span>'
        + '    </a>'
        + '  </div>'
        + '</div>'
      );
      panel_menu.find("[data-toggle='tooltip']").tooltip();
      element.append(panel_menu);

      // Append Panel Body
      var panelbody = $(
        '<div class="panel-body">'
        + '    <textarea class="editor form-control" rows="3"></textarea>'
        + '    <textarea class="editor form-control" rows="3"></textarea>'
        + '</div>'
      );

      this.raw_editor = panelbody.find("textarea.editor")[0];
      this.current_editor = CodeMirror.fromTextArea(
        this.raw_editor,
        settings.editor
      );
      var that = this;
      this.deob_editor = CodeMirror.fromTextArea(
        panelbody.find("textarea.editor")[1],
        {
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true  
        }
      );
      var jstillery = this;

      this.current_editor.options.extraKeys = {
        "Ctrl-Enter": function(el) {
          sendObfuscated(that.deob_editor, el.getValue());
        }
      }
      // Make it resizable
      var editor_wrapper = $(this.current_editor.getWrapperElement());
      editor_wrapper.resizable({
        minHeight: 150,
        handles: 's',
        resize: function(e, ui) {
          //var cu = $(ui).closest(".code-panel").data("cm");
          //cu.setSize($(this).width(), $(this).height());
        }
      });
      editor_wrapper = $(this.deob_editor.getWrapperElement());
      editor_wrapper.resizable({
        minHeight: 150,
        handles: 's',
        resize: function(e, ui) {
          //var cu = $(ui).closest(".code-panel").data("cm");
          //cu.setSize($(this).width(), $(this).height());
        }
      });
      element.append(panelbody);

      /* Store CodeMirror instance
      var code_panel = element.closest(".code-panel");
      code_panel.data("cm", this.current_editor);*/

      // Return the panel
      return element;
    }

    this._initLogPanel = function(element) {
      // Classes
      element.addClass("panel panel-default");

      // Append Panel Header 
      var panel_header = $(
        '<div class="panel-heading">'
        + 'Log Panel'
        + '</div>'
      );
      element.append(panel_header);

      // Append Panel Body
      var panelbody = $(
        '<div class="panel-body">'
        + '    <ul class="list-unstyled"></ul>'
        + '</div>'
      );
      element.append(panelbody);

      return element;
    }

    /* Logging */
    this._escapeHTML = function(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    this.log = function(message, type) {
      switch (type) {
        case 0:
          var type = "error";
          break;
        case 1:
          var type = "success";
          break;
        default:
          var type = "info";
      }

      var msg = this._escapeHTML(message);
      var t = new Date();
      var time = t.toLocaleDateString() + " " + t.toLocaleTimeString();
      var full_msg = time + " - " + msg;

      var logelem = $("<li class='log-entry log-" + type + "'>" + full_msg + "</li>");
      logelem.data("log-time", time);
      logelem.data("log-type", type);
      logelem.data("log-message", message);

      this.log_panel.find("ul").append(logelem)

      // Focus on bottom
      var pb = this.log_panel.find(".panel-body");
      pb.scrollTop(pb.height());
    }

    /* Helpers */
    this.getCode = function() {
      return this.current_editor.getValue();
    }

    this.getLogs = function() {
      var result = [];
      this.log_panel.find("ul li").each(function(i) {
        result.push({
          'time': $(this).data("log-time"),
          'type': $(this).data("log-type"),
          'message': $(this).data("log-message")
        });
      });
      return result;
    }

    /* Actions */
    this.bindBeautify = function() {
      var binded_button = this.editor_panel.find('.btn-action-beautify');
      data = {
        jstillery: this,
        target_editor: this.current_editor
      };

      binded_button.on('click', data, function(event) {
        try {
          var content = event.data.target_editor.getValue();
          var b_content = js_beautify(
            content, {
              'preserve_newlines': false
            });

          event.data.target_editor.setValue(b_content);
          event.data.jstillery.log("Code beautified.", 1);
        } catch (e) {
          event.data.jstillery.log("Beautify Error: " + e.index + " " + e.description, 0);
        }
      })
    }
    var use_Remote = true;
    var deobURL = "http://" + location.hostname + ":3001/deobfuscate";
    
    function sendObfuscated(el, src) {
      if (use_Remote) {
        
        var content = src || el.getValue();
        $.ajax({
          url: deobURL,
          contentType: "application/json",
          method: "POST",
          type: "json",
          data: JSON.stringify({
            source: content
          })
        }).done(
          function(a) { 
            if (a.source)
              el.setValue(a.source);
            if (a.error)
              add_notification("JavaScript Error: " + a.error.description + "<br>Line: " + a.error.lineNumber
                + ", Column:" + a.error.column, "error");
            // else{
            //  add_notification ("Code deobfuscated", "info");
            // }
          }).fail(function (argument) {
            console.log("Fallback to local")
            el.setValue(deobfuscate(content));
          });
      }else{
        el.setValue(deobfuscate(content));
      }
    }
    this.bindDeobfuscate = function(targetEditor) {

      var binded_button = this.editor_panel.find('.btn-action-deobfuscate');
      data = {
        jstillery: this,
        target_editor: this.current_editor
      };

      binded_button.on('click', data, function(event) {
        var content = event.data.target_editor.getValue();
        try {
          sendObfuscated(targetEditor || event.data.target_editor, event.data.target_editor.getValue());
        } catch (e) {
          console.log(e);
          event.data.jstillery.log("Deobfuscation Error: " + e.index + " " + e.description, 0);
        }
      });
    }

    
    // Constructor
    // Class Attributes
    this.current_panel = undefined;
    this.current_editor = undefined;
    this.raw_editor = undefined;

    // Id
    this.id = settings.id;
    element.data("jstillery-id", settings.id)

    // Init Editor Panel
    this.editor_panel = this._initEditorPanel($('<div class="editor-panel"></div>'));
    element.append(this.editor_panel);

    // Init Log Panel
    this.log_panel = this._initLogPanel($('<div class="log-panel"></div>'));
    element.append(this.log_panel);

    this.log("Panel Initialized, id: " + settings.id);

    // Bind Actions
    this.bindBeautify();
    this.bindDeobfuscate(this.deob_editor); 
  };

  $.fn.jstillery = function(options) {
    return this.each(function() {
      var element = $(this);

      if (element.data("jstillery")) return;

      var jstillery = new JStillery(this, options);

      element.data("jstillery", jstillery);
    })
  }
}(jQuery))