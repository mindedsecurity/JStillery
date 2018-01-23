
    var STEPS = 0;

    function add_notification(message,type) {
        type = type.replace(/[^a-z0-9]/gi,'');
        $("#notifications").append(''
            + '<div class="alert alert-'+type+'" role="alert">'
            + '    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span>'
            + '    </button>'
            + '<strong>' + type[0].toUpperCase() + type.slice(1).toLowerCase() + '.</strong> '
            + message
            + '</div>').fadeTo(10000, 500).slideUp(500, function(a){
    $(".alert").alert('close');
});
   //     $(".alert-dismissable").alert('close');
    }

    function close_tab(e) {
        var tab = $(this).parent().attr("href");
        $(this).parent().parent().remove();
        $("#steps-tabs a[class='step-tab-link']:last").tab("show");
        $(tab).remove();
    }

    function new_jstillery_panel_cb(e) {
        if ('data' in e && e.data != null) {
            // Check the ID
            if ('id' in e.data) {
                var id = e.data.id;
            } else {
                var id = (STEPS + 1) + "-" + new Date().valueOf().toString();
            }

            // Check the Code
            if ('code' in e.data) {
                var code = e.data.code;
            } else {
                var code = '';
            }

            new_jstillery_panel(id,code);
        } else {
            new_jstillery_panel(
                (STEPS + 1) + "-" + new Date().valueOf().toString(),
                ''
            )
        }
    }

    function setCode(code){
        var jsi = $(document).find(".code-panel").data("jstillery");
        if(jsi){
            jsi.current_editor.setValue(code);
            setTimeout(function(){
                jsi.current_editor.refresh();
            },1);                
        }else{
            new_jstillery_panel(+(new Date()),code);
        }
    }
    function new_jstillery_panel(id,code) {
            var nextTab = STEPS + 1;
            if (typeof id != 'undefined') {
                var id = nextTab + "-" + new Date().valueOf().toString(); 
            }

            // create the tab
            var tablink =$('<li><a href="#steps-tab-'+id+'" data-step="'+nextTab+'" data-toggle="tab" class="step-tab-link">Step '+nextTab+'<span class="tab-divider">&nbsp;</span></a></li>');
            var closetab = $('<button class="close closeTab" type="button" >×</button>');
            closetab.on("click", close_tab);
            closetab.appendTo(tablink.find("a"));

            tablink.data("step", nextTab);
            tablink.appendTo('#steps-tabs');
            
            // create the tab content
            var content = $(''
                + ' <div class="tab-pane" id="steps-tab-'+id+'">'
                + '   <div class="container">'
                + '     <div class="row">'
                + '         <div id="step-panel-'+id+'" class="code-panel"></div>'
                + '     </div>'
                + '     <div class="row">'
                + '         <div id="step-log-'+id+'" class="log-panel"></div>'
                + '     </div>'
                + '   </div>'
                + ' </div>');

            content.find(".code-panel").jstillery({id: id});

            if (typeof code != 'undefined') {
                var jsi = content.find(".code-panel").data("jstillery");
                jsi.current_editor.setValue(code);
                setTimeout(function(){
                    jsi.current_editor.refresh();
                },1);                
            }

            content.appendTo('#steps-tabs-content');
            
            // make the new tab active
            $('#steps-tabs a:last').tab('show');

            // Increment STEPS
            STEPS += 1;
    }

    function save() {
        // Get Notes editor
        var notes = $("#notes-editor").data("markdown").getContent();
        var data_to_save = {
            'notes': notes,
            'steps': []
        }
        $(".code-panel").each(function(i){
            var jsi = $(this).data("jstillery");
            var data = {
                'id': jsi.id,
                'code': jsi.getCode(),
                'log': jsi.getLogs()
            };
            data_to_save['steps'].push(data);
        })
        $.post( "/api/save", JSON.stringify(data_to_save), function(data) {
            if (data.result === true) {
                add_notification("The current analysis has been saved.", "success");
            } else {
                add_notification("An error occurred while saving: " + data.message, "error");
            }
        })
          .done(function() {
            //alert( "second success" );
          })
          .fail(function() {
            add_notification("An error occurred while saving. Is the server running?", "error");
          })
          .always(function() {
            //alert( "finished" );
        });
    }

    $(function() {
        // JSTILLERY
        //var jstillery = $(".code-panel").jstillery();
        

        // Eye-Candies
        $("#save-button").popover();

        $("#new-step-button").on("click", new_jstillery_panel_cb);

        $("#save-button").on("click", save);
        new_jstillery_panel( ""+Math.random(),"");

        setCode(decodeURIComponent(atob(location.hash.slice(1))));
        // $.get( "/api/load", function(data) {
        //     if (data.result === true) {
        //         console.log(data);
        //         $("#notes-editor").data("markdown").setContent(data.notes);

        //         /* TODO */
        //         $.each(data.steps, function(i,v){
        //             new_jstillery_panel(
        //                 v.id,
        //                 v.step);
        //         });
        //         add_notification("The current analysis has been loaded.", "success");
        //     } else {
        //         new_jstillery_panel();
        //         add_notification("An error occurred while loading: " + data.message, "error");
        //     }
        // })
        //   .done(function() {
        //     //alert( "second success" );
        //   })
        //   .fail(function() {
        //     add_notification("An error occurred while loading. Is the server running?", "error");
        //   })
        //   .always(function() {
        //     //alert( "finished" );
        // });

    });



    