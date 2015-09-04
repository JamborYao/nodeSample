var sql = require('mssql');
var azure = require('azure-storage');
var accessKey = 'SuHYRaljZUfk1sdVcPkMt3xwX6vJ6G3OUdkE2ZcPLtC9C1ybi2CWfaAyMvcWqHJ9iLAvcIBbfqSb4HQRY/2f4Q==';
var storageAccount = 'willshao';
var blobService = azure.createBlobService(storageAccount, accessKey);
//create a blob service set explicit credentials


createContainer = function (containername) {
    
    /* blobService.listBlobsSegmented('mycontainer', function(error, result, response){
	  if(!error){
	   console.log('success');
	  }
   });*/
	 
   blobService.createContainerIfNotExists(containername, function (error, result, response) {
        if (!error) {
            console.log('success');
        }
    });
}

readData = function (res) {
    
    var config = {
        user: 'sa',
        password: '111',
        server: 'VDI-V-JAYAO', // You can use 'localhost\\instance' to connect to named instance 
        database: 'nodeTest'
    }
    var students;
    /*	var config = {
    user: 'jambor@gzh0e9hpef',
    password: '123Aking',
    server: 'tcp:gzh0e9hpef.database.windows.net,1433', // You can use 'localhost\\instance' to connect to named instance 
    database: 'janode'
	}*/
	var connection = new sql.Connection(config, function (err) {
        var request = new sql.Request(connection); // or: var request = connection.request(); 
        request.query('select * from [dbo].[Student]', function (err, recordset) {
            console.log(recordset);
            res.render('list', {
                title: "Students information",
                items: recordset,
                content: 'hello world!'
            })
        });
	    
    });


}

var generateSAS = function (res) {
    var containerName = "nodejs";
    var blobName = "test.txt";
    
    var startDate = new Date();
    var expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 100);
    startDate.setMinutes(startDate.getMinutes() - 100);
    
    var sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
            Start: startDate,
            Expiry: expiryDate
        },
    };
    
    var blobSAS = blobService.generateSharedAccessSignature('nodejs', 'test.txt', sharedAccessPolicy);
    var host = blobService.host;
    var sasUrl = blobService.getUrl(containerName, blobName, blobSAS);
    
    //console.log();
    res.render('index', {
        title: "Nodejs test",
        content: sasUrl
    })
    
    /*blobService.createBlockBlobFromLocalFile('nodejs', 'test.txt', 'd:\\test2.txt', function(error, result, response){
	  if(!error){
	    // file uploaded
	  }
	});*/
	var sharedBlobService = azure.createBlobServiceWithSas(blobService.host, blobSAS);
    var blobcontent = sharedBlobService.getBlobProperties('nodejs', 'test.txt', function (error, result, response) {
        if (!error) {
            console.log(response);
        } 
        else {
            console.log(error);
        }
    });
	
}

exports.createContainer = createContainer;
exports.readData = readData;
exports.generateSAS = generateSAS; 