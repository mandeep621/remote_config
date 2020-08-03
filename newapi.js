//console.log('My name is Mandeep');
var express = require('express');
const app = express();
app.use(express.json())
var mongoclient =require('mongodb').MongoClient;
var url ="mongodb://localhost:27017/";

app.post('/createproduct',(req,res)=>{

 //create collection in mongodb

        var productName = req.body.product_name;
        console.log('productName = ', productName);

    mongoclient.connect(url,(err,db)=>{
        if(err) throw err;
        var dbo= db.db("products");

        dbo.createCollection(productName, (err, dbres) =>{
           if(err) {
            console.log('error while creating')
            res.send('createproduct failed')
           }
            else {
                console.log('createproduct success')
                res.send('createproduct success')
            }
            
        });
    });
});

app.post('/createversion',(req,res)=>{
    //create document under given collection or product name

    var productName = req.body.product_name;
    console.log('productName = ', productName);

    var versionName = req.body.version_name;
    console.log('versionName = ', versionName)

    mongoclient.connect(url,(err,db)=>{
        if(err) throw err;
        var dbo= db.db("products");
        var obj ={version: versionName};
        dbo.collection(productName).insertOne(obj,(err,dbres)=>{
            if(err){
                console.log('error while creating version')
                res.send('createversion failed')
            }
            else{
                console.log('createversion sucess')
                res.send('createversion success')
            }
        });

    });

})

app.get('/productlist',(req,res)=>{
    //get all productlist as all collections
    console.log('inside productlist')

    mongoclient.connect(url,(err,db)=>{
        if(err) throw err;
        var dbo= db.db("products");
        
        dbo.listCollections().toArray((err, collections) =>{

            console.log('collections = ', collections)

            res.send(collections)
        });

    });

});

app.get('/versionlist',(req,res)=>{
    //get version list from given product as all documet
    mongoclient.connect(url,(err,db)=>{
        if(err) throw err;
        var dbo= db.db("products");
    
        var coll = req.query.collectionname;

        dbo.collection(coll).find().toArray((err, versionlist) =>{
            res.send(versionlist)
        });
    });
    
})

app.get('/getconfig',(req,res)=>{
    //get specified version info from given version number
})



app.put('/updateversion', (req,res)=>{
    var productName = req.body.product_name;
    console.log('productName = ', productName);

    var versionName = req.body.version_name;
    console.log('versionName = ', versionName)
    
    mongoclient.connect(url, {useUnifiedTopology : true}, (err,db)=>{
        if(err) throw err;
        var dbo= db.db("products");
        var query ={version: versionName};

        console.log('update version query =' + query)

        var newValues = {$set: {version: versionName, name:req.body.name}}
        console.log('update version newValues =' + newValues)

        dbo.collection(productName).updateOne(query, newValues, {upsert : true}, (dberr, dbres)=> {
            if(dberr){
                console.log('error while updating version')
                res.send('updateversion failed')
            }
            else{
                console.log('updateversion sucess')
                res.send('updateversion success')
            }
        });
    });
});

app.delete("/deleteproduct",(req,res)=>{

    var productName = req.body.product_name;
        console.log('productName = ', productName);

    mongoclient.connect(url,(err,db)=>{
        if(err) throw err;
        var dbo= db.db("products");

        dbo.dropCollection(productName, (err, dbres) =>{
           if(err) {
            console.log('error while deleating')
            res.send('deleteproduct failed')
           }
            else {
                console.log('deleteproduct success')
                res.send('deleteproduct success')
            }
            
        });
    });
});


app.delete("/deleteversion",(req,res)=>{

    var productName = req.body.product_name;
    console.log('productName = ', productName);

    console.log('body = ' + JSON.stringify(req.body))

    var versionName = req.body.version_name;
    console.log('versionName = ', versionName);

    mongoclient.connect(url,(err,db)=>{
        if(err) throw err;
        var dbo= db.db("products");
        var obj ={version: versionName};
        dbo.collection(productName).deleteOne(obj,(err,dbres)=>{
            if(err){
                console.log('error while deleting version')
                res.send('deleteversion failed')
            }
            else{
                console.log('deleteversion sucess')
                res.send('deleteversion success')
            }
        });

    });
})

app.listen(2000,()=>
{
    console.log('listening port 2000')
})