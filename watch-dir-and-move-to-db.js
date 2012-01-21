var Inotify = require('inotify').Inotify
var inotify = new Inotify();

var pdf_dir = { path: '/home/smueller/PDF',
                callback: function(event) {
                  var mask = event.mask;
                  
                  if(mask & Inotify.IN_CREATE ) {
                    // copy event.name to couchdb
                    console.log("copy %s to couchdb...", event.name)
                  };
                }};

// create watch descriptor
var wd = inotify.addWatch(pdf_dir);
