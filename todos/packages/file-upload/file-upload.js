var fs = Npm.require('fs');

var fail = function(response) {
    response.statusCode = 404;
    response.end();
};

var dataFile = function() {
    var file = "../../../../../.uploads/" + this.params.id;

    // Attempt to read the file size
    var stat = null;
    try {
        stat = fs.statSync(file);
    } catch (_error) {
        return fail(this.response);
    }

    // The hard-coded attachment filename
    var attachmentFilename = this.params.id;

    // Set the headers
    this.response.writeHead(200, {
        'Content-Type': 'application/file',
        'Content-Disposition': 'attachment; filename=' + attachmentFilename,
        'Content-Length': stat.size
    });

    // Pipe the file contents to the response
    fs.createReadStream(file).pipe(this.response);
};

Router.route('/download/:id', dataFile, {where: 'server'});