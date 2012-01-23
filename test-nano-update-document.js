var server = require('nano')('http://localhost:5984');
var db = server.use( 'pdf' );
var fs = require( 'fs' );

var readStream = fs.createReadStream( '/home/smueller/PDF/test2.pdf' );

readStream.pipe( db.attachment.insert( 'testdoc', 'test.pdf', null, 'application/pdf' ) );




