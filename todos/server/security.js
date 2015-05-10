
function trueFunc(userId) {
    if (!userId) {
        // must be logged in
        return false;
    }

    return true;
}
Uploads.allow({
    insert: trueFunc,
    update: trueFunc,
    remove: trueFunc,
    download: trueFunc
});