var sql = require('mssql');
readData = function (res) {
    
    //var config = {
    //    user: 'sa', 
    //    password: '111', 
    //    server: 'VDI-V-JAYAO', // You can use 'localhost\\instance' to connect to named instance  
    //    database: 'nodeTest'
    //}
    var students;
   	var config = {
        user: 'Azurelogin@qis4iqvic0.database.chinacloudapi.cn', 
        password: '123Aking', 
        server: 'qis4iqvic0.database.chinacloudapi.cn', // You can use 'localhost\\instance' to connect to named instance  
        database: 'jambor' ,
        options: {
            encrypt: true, // Use this if you're on Windows Azure ,
            driver: 'SQL Server Native Client 11.0'
        }

    }
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

exports.readData=readData