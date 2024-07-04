var express=require('express');
var session=require('express-session');
var cookieParser=require('cookie-parser')
var bodyparser=require('body-parser')
var mysql=require('mysql');
var fs=require('fs');
var loginController=require('./controllers/login_controller')
var generateKeys=require('./controllers/GenerateKeys');
var upload=require('express-fileupload');

var company=[];
var bill_data;
var app=express();
app.use(upload());
app.use(session({
  name:'sid',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(cookieParser())

var urlEncodedParser=bodyparser.urlencoded({extended:true})
app.set('view engine','ejs')
app.use('/public',express.static('public'))
var company_details=null;


var redirectLogin=function(req,res,next){
  if(!req.session.userId){
    console.log(req.session);
    res.redirect('/');
  }
  else{
    next();
  }
};

var redirectHome=function(req,res,next){
  if(req.session.userId){
    res.redirect('/home');
  }
  else{
    next();
  }
};


app.get('/',redirectHome,function(req,res){
  const {userId} = req.session;
  const {userName} = req.session;
  res.render('login',{flag:true,userId:req.session.userId});
})


app.get('/home',redirectLogin,function(req,res){
    res.render('home',{userId:req.session.userName});
});


app.get('/company',redirectLogin,function(req,res){
    res.render('company',{userId:req.session.userId});
})

app.get('/report',redirectLogin,function(req,res){
    res.render('report',{userId:req.session.userName});
})
app.get('/keys_details',redirectLogin,function(req,res){
    res.render('keys_details',{userId:req.session.userName});
})

app.get('/login',redirectHome,function(req,res){
  res.render('login',{flag:true,userId: req.session.userName});
})


app.get('/logout',redirectLogin,function(req, res) {
        req.session.destroy();
        res.redirect('/login');
      });

app.post('/login',urlEncodedParser,function(req,res){
   loginController.login_check(req.body).then((root)=>{
     req.session.userId=root;
     req.session.userName="third_party";
     res.redirect('/home');
   }).catch(function(error){
       res.render('login',{flag:false,userId: req.session.userId});
   });
      });



  app.post("/getSignedReports",urlEncodedParser,redirectLogin,function(req,res){
  	console.log(req.body);
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: req.session.userName
    });
      var sql='call getSignedBills(?,?)';
  		var param=[req.body.sdate,req.body.edate];
      con.query(sql,param,(err,results)=>{

        if(err) throw err;
        console.log(results[0])
        if(results[0]!==undefined)
        res.send(results[0]);
        else {
          res.status(404).end();
         }
      });
    });

    app.get("/getFullDetails",urlEncodedParser,redirectLogin,function(req,res){
    	console.log(req.query.c_id);
      var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: req.session.userName
      });
        var sql='call getFullCompanyDetails(?)';
    		var param=[req.query.c_id];
        con.query(sql,param,(err,result)=>{
          if(result[0][0]!==undefined){
              res.render('company_details',{userId:req.session.userName,data:result[0][0]});
              }
          else{
            res.redirect('/home');
          }
           });
         });

    app.post("/getUsersList",urlEncodedParser,redirectLogin,function(req,res){
        console.log(req.body);
        var con = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "root",
          database: req.session.userName
        });
          var sql='call getCompanyDetails(?)';
          var param=[req.body.search_text];
          con.query(sql,param,(err,result)=>{
            if(err) throw err
            console.log(result[0])
            if(result[0].length>0){
              res.send(result[0])
              }
            else {
              res.status(404).end();
              }
          });
        });

  app.post("/blockCompany",urlEncodedParser,redirectLogin,function(req,res){
          console.log(req.body);
          var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: req.session.userName
          });
            var sql='call blockCompany(?,?)';
            var param=[req.body.value,req.body.cin];
            con.query(sql,param,(err,result)=>{
              if(!err)
                   res.status(200).redirect('/home')
              else {
                console.log(err)
                res.status(404).end();
                }
            });
          });

          app.get("/getKeysDetails",urlEncodedParser,redirectLogin,function(req,res){
            var con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "root",
              database: req.session.userName
            });
              var sql='call getKeysDetails()';
              con.query(sql,(err,result)=>{
                if(result[0][0]!==undefined){
                    res.send(result[0][0])              }
                else{
                  res.redirect('/home');
                 }
                 });
               });

               app.get("/generateKeys",urlEncodedParser,redirectLogin,function(req,res){
                 var con = mysql.createConnection({
                   host: "localhost",
                   user: "root",
                   password: "root",
                   database: req.session.userName
                 });

                 for(var i=0;i<req.query.num_keys;i++){
                   generateKeys.generate().then((k)=>{
                  var sql='call addDigitalKeys(?,?,?)';
                   con.query(sql,[k.privateKey,k.publicKey,k.num],(err,result)=>{
                     if(err){console.log(err)
                      }
                      });
                    })
                    }
                    res.status(200).end();
                    });


app.listen(3001);

module.exports
