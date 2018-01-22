var aDoc = document;

var D_123 = function XXX() {
            function ff(){return aDoc}
            aDoc.createElement('iframe'); 
            
            aDoc=window;
            ff(); //KO: Error on calling inner functions.
        };
             
aDoc.asd()