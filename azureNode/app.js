
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var common = require('./common.js');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require("fs");
var multer = require('multer');
var async = require('async');

var flag = false;
var deleteFilePath = '';

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', function (req, res) {
    common.generateSAS(res);
    console.log('post called');
	
})


app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.post('/createStorage', function (req, res) {
    
    var containername = req.body.containerName;
    console.log(containername);
    common.createContainer(containername);
    res.end();
})

app.get('/listUsers', function (req, res) {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        console.log(data);
        res.end(data);
    });
})

app.post('/list', function (req, res) {
    common.readData(res);
	
})

app.post('/upload', function (req, res) {
    //common.uploadFile();
   
})

app.get('/uploadtoAzure', function (req, res) {
        res.send(
       '<form action="/uploadtoAzure" method="post" enctype="multipart/form-data">' +
     '<input type="file" name="snapshot" />' +
     '<input type="submit" value="Upload" />' +
     '</form>'
 );
});

app.post('/uploadtoAzure', function (req, res) {
    var multiparty = require('multiparty');
    var azure = require('azure-storage');
    var azure = require('azure-storage');
    var accessKey = 'SuHYRaljZUfk1sdVcPkMt3xwX6vJ6G3OUdkE2ZcPLtC9C1ybi2CWfaAyMvcWqHJ9iLAvcIBbfqSb4HQRY/2f4Q==';
    
    var container = 'nodejs';
    var blobService = azure.createBlobService(storageAccount, accessKey);
    var form = new multiparty.Form();
    
    form.on('part', function (part) {
        if (part.filename) {
            
            var size = part.byteCount - part.byteOffset;
            var name = part.filename;
            
            blobService.createBlockBlobFromStream(container, name, part, size, function (error) {
                if (error) {
                    res.send(' Blob create: error ');
                }
            });
        } else {
            form.handlePart(part);
        }
    });
    form.parse(req);
    res.send('OK');
});





var multerDiskConcept = multer(
    {
        dest: './uploads/',
        rename: function (fieldname, filename) { return filename; }
    });
var deleteFilePath = "";
app.post('/testdisk', multerDiskConcept.single('avatar'), DiskConcept);

var uploadtoAzure=function(request,response) {
    var azure = require('azure-storage');
    var accessKey = 'SuHYRaljZUfk1sdVcPkMt3xwX6vJ6G3OUdkE2ZcPLtC9C1ybi2CWfaAyMvcWqHJ9iLAvcIBbfqSb4HQRY/2f4Q==';
    var storageAccount = 'willshao';
    var blobService = azure.createBlobService(storageAccount, accessKey);
    blobService.createContainerIfNotExists('images', { publicAccessLevel: 'blob' }, function (error, result, blobresponse) {
        if (error) {
           
            response.status(500).send(error);
        }
        else {
            
            var imageName = require('node-uuid').v1() + "_" + request.file.originalname;
            
            blobService.createBlockBlobFromLocalFile('images', imageName, request.file.path, function (error, result, blobimageresponse) {
                if (error) {
                    response.status(500).send(error);
                    console.log(error);
                }
                else {
                    console.log('uploaded to' + imageName);
                    //var fs = require("fs");
                    flag = true;
                    deleteFilePath = request.file.path;

                }
            });
               
        }
    });
}
var unlinkFile=function() {
    var fs = require("fs");
    console.log(flag);
    if (flag) {
        fs.unlink(deleteFilePath, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Success");
        });
    }
}
function DiskConcept(request, response) {
    
    //var async = require('async');
    async.waterfall([function (callback) {
            
            var azure = require('azure-storage');
            var accessKey = 'SuHYRaljZUfk1sdVcPkMt3xwX6vJ6G3OUdkE2ZcPLtC9C1ybi2CWfaAyMvcWqHJ9iLAvcIBbfqSb4HQRY/2f4Q==';
            var storageAccount = 'willshao';
            var blobService = azure.createBlobService(storageAccount, accessKey);
            blobService.createContainerIfNotExists('images', { publicAccessLevel: 'blob' }, function (error, result, blobresponse) {
                if (error) {
                    console.log(errpr);
                    response.status(500).send(error);
                }
                else {
                    console.log(request.file);
                    var imageName = require('node-uuid').v1() + "_" + request.file.originalname;
                    
                    blobService.createBlockBlobFromLocalFile('images', imageName, request.file.path, function (error, result, blobimageresponse) {
                        if (error) {
                            response.status(500).send(error);
                            console.log(error);
                        }
                        else {
                            console.log('uploaded to' + imageName);
                            //var fs = require("fs");
                            flag = true;
                            deleteFilePath = request.file.path;
                            console.log('callback');
                            callback(null, flag, deleteFilePath);

                        }
                    });
               
                }
            });
          
        }, function (arg1, arg2, callback) {
            console.log(arg1);
            console.log(arg2);
            if (flag) { 
                fs.unlink(deleteFilePath, function (err) {
                    if (err)
                        console.log(err);
                    else
                        console.log("Success");
                });
            }
            callback(null, 'done');
        }, function (err, result) {
            console.log(result);
        }]);
   
        

}


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

