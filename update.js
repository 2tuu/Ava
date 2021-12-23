
const fs = require('fs');

//unzipping file
function secondStage(){
    return new Promise(resolve => {

    console.log('Unzipping repository...');
    var AdmZip = require("adm-zip");

    var zip = new AdmZip("./update/Kit-master.zip");
    var zipEntries = zip.getEntries();

    zipEntries.forEach(function (zipEntry) {
        if (zipEntry.entryName == "entries.txt") {
        }
    });

    zip.extractAllTo("update/", true);
    resolve();
    });
}


//getting zip file
function firstStage(){
    console.log('Downloading repository...')
    const { DownloaderHelper } = require('node-downloader-helper');
    const file = 'https://github.com/2tuu/Kit/archive/refs/heads/master.zip';
    const filePath = `./update`;

    const dl = new DownloaderHelper(file , filePath);
    dl.on('end', () => secondStage().then(()=>{
        thirdStage();
    }))
    dl.start();
}

var files = [];
var directories = [];

//scan directories
function thirdStage(){
 let updateFiles = fs.readdirSync('./update/Kit-master');

 updateFiles.forEach(v => {
     var ignore = [
         'LICENSE',
         '.git',
         '.gitattributes',
         '.gitignore',
         '._DS_Store',
         '._.DS_Store'
     ];
     if(ignore.includes(v)) return;
     if(v.startsWith('.')) return;

     //match file extensions
     if(v.match(/([a-z]*\.[a-z]*)/gi)){
        files.push(`./update/Kit-master/${v}`);

    //match folders
    } else {
        directories.push(`./update/Kit-master/${v}/`)
    }
 });




while(directories[0]){
    var tempDirs = directories;
        directories = [];

    tempDirs.forEach(a => {
        var dir = fs.readdirSync(a);

        dir.forEach(b => {
            //match file extensions
            if(b.match(/([a-z]*\.[a-z]*)/gi)){
                files.push(`./${a.replace('./','')}${b}`);

            //match folders
            } else {
                directories.push(`./${a.replace('./','')}${b}/`)
            }
        });
    });
}

files.forEach(function(part, index, files) {
  files[index] = files[index].replace('./update/Kit-master', '.');
});

//files now contains an index of every file in the downloaded update

var downloadedFiles = files;
    files = [];
    directories = [];

updateFiles = fs.readdirSync('./');

 updateFiles.forEach(v => {
     var ignore = [
         'LICENSE',
         '.git',
         '.gitattributes',
         '.gitignore',
         '._DS_Store',
         '._.DS_Store'
     ];
     if(ignore.includes(v)) return;
     if(v.startsWith('.')) return;
     if(v.startsWith('update')) return;
     if(v.startsWith('node_modules')) return;

     //match file extensions
     if(v.match(/([a-z]*\.[a-z]*)/gi)){
        files.push(`./${v}`);

    //match folders
    } else {
        directories.push(`./${v}/`)
    }
 });

while(directories[0]){
    var tempDirs = directories;
        directories = [];

    tempDirs.forEach(a => {
        var dir = fs.readdirSync(a);

        dir.forEach(b => {
            //match file extensions
            if(b.match(/([a-z]*\.[a-z]*)/gi)){
                files.push(`./${a.replace('./','')}${b}`);

            //match folders
            } else {
                directories.push(`./${a.replace('./','')}${b}/`)
            }
        });
    });
}

//delete duplicates
downloadedFiles = downloadedFiles.filter(function(elem, pos) {
    return downloadedFiles.indexOf(elem) == pos;
})
files = files.filter(function(elem, pos) {
    return files.indexOf(elem) == pos;
})

var needToUpdate = [];
var needToAdd = [];

downloadedFiles.forEach(e=>{

    if(files.includes(e)){
        if(!downloadedFiles.includes(e)) return console.log('missing from downloads: ' + e + ': ignoring');
        function compareFiles(a){
            if(!fs.existsSync(`./update/Kit-master/${a.replace('./','')}`)) return console.log('not applicable: ' + e + ': ignoring');

            var fileA = fs.readFileSync(a, "utf8");
            var fileB = fs.readFileSync(`./update/Kit-master/${a.replace('./','')}`, "utf8");

            if(fileA === fileB){
                return false;
            } else {
                return true;
            }
        }

        if(compareFiles(e)){
            console.log('difference: ' + e + ': update needed');
            needToUpdate.push(e);
        }

    } else {
        console.log(e + ' does not exist in main, needs to be added');
        needToAdd.push(e);
        //add file to main folder from update folder
    }
})

console.log('\n\nFiles to update:\n' + 
            needToUpdate.join('\n') + '\n\n' + 
            'Files to create:\n' +
            needToAdd.join('\n'));

//create missing files
needToAdd.forEach(e=>{
        fs.copyFile(`./update/Kit-master/${e.replace('./','')}`, e, (err) => {
    if (err) {
        console.log("Error Copying File: ", err);
    }
    else {
        console.log(`created ${e}`)
    }
    });
})

//update existing files
needToUpdate.forEach(e=>{
    function replaceContents(file, replacement, cb) {
        fs.readFile(replacement, (err, contents) => {
            if (err) return cb(err);
            fs.writeFile(file, contents, cb);
        });
    }

    replaceContents(e, `./update/Kit-master/${e.replace('./','')}`, err => {
        if (err) {
        console.error('error occured while updating ' + e + ': ' + err)
        throw err;
        }
        console.log(`updated ${e}`);
    });
})

}

firstStage();
console.log('\nupdate complete. - remember to delete the contents of /update if you don\'t need them anymore')