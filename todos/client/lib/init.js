// file: client/init.js
Meteor.startup(function() {
    Uploader.finished = function(index, fileInfo, templateContext) {
        console.log("index")//Uploads.insert(fileInfo);
    }
})