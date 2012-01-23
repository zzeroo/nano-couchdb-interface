var Inotify = require('inotify').Inotify
var inotify = new Inotify();

// watch a hard coded dir for files of type pdf
function watch_dir() { 
  var pdf_dir = { path: '/home/smueller/PDF/',
                  callback: function(event) {
                  var mask = event.mask;

                  if(mask & Inotify.IN_CREATE ) {
                    if (event.name.match(/^(.)*\.pdf$/i)) { 
                        // copy event.name to couchdb
                        console.log("copy %s to couchdb...", event.name)
                        withAttachment( event.name );
                      };
                    };
                  }};

  // create watch descriptor
  var wd = inotify.addWatch(pdf_dir);
}


// nano CouchDB stuff
var server = require('nano')('http://localhost:5984');
var db_name = "pdf";
var db = server.use(db_name);

// Parameter: [ a document ], [ counter tried ]
function insert_doc(doc, tried) {
  db.insert(doc,
    function (err, http_body, http_headers) {
      if(err) {
        if(err.message === 'no_db_file' && tried < 1) {
          // create database and retry
          return server.db.create(db_name, function() {
            insert_doc(doc, tried+1);
          });
        } else { return console.log(err); }
      }
      console.log(http_body);
    }
  );
}

function withAttachment (doc) { 
  var fs = require( 'fs' );
  console.log( 'Insert into DB: ' + '/home/smueller/PDF/' + doc );
  var readStream = fs.createReadStream( '/home/smueller/PDF/' + doc );
  readStream.pipe( db.attachment.insert( doc, doc, null, 'application/pdf' ) );
}


// let's go
watch_dir( );


