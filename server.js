var express=require('express');
var session=require('express-session');
var cookieParser=require('cookie-parser')
var bodyparser=require('body-parser')
var mysql=require('mysql');
var fs=require('fs');
var loginController=require('./controllers/login_controller')
var signupController=require('./controllers/signup_controller')
var verify=require('./controllers/UploadAndVerify')
var upload=require('express-fileupload');
var signBill=require('./controllers/signBill');
var prepareBillController=require('./controllers/prepareBillController');

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
  const {userName}=req.session;
  const {company}=req.session;

  res.render('login',{flag:true,userId:req.session.userName});
})


app.get('/home',redirectLogin,function(req,res){
    if(req.session.company_details.billing_flag==1|| req.session.company_details.billing_flag==2){
      var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: req.session.userName
      });
      con.connect(function(err) {
        if (err) throw err;
        con.query("call getUsers()",function (err, result) {
          if (err) throw err;
          console.log(result[0]);
          res.render('home',{company:req.session.company_details,users:result[0]});
        });
      });
    }
    else{
      res.redirect('/verify');
    }
})

app.get('/signInvoice',redirectLogin,function(req,res){
    res.render('signInvoice',{company:req.session.company_details,f:0});
})
app.get('/inventory',redirectLogin,function(req,res){
  if(req.session.company_details.billing_flag==2){
    res.render('inventory',{company:req.session.company_details});
}})

app.get('/usermanagement',redirectLogin,function(req,res){
  if(req.session.company_details.billing_flag==2){
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: req.session.userName
    });
    con.connect(function(err) {
      if (err) throw err;
      con.query("call getUsers()",function (err, result) {
        if (err) throw err;
        console.log(result[0]);
        res.render('usermanagement',{company:req.session.company_details,users:result[0]});
      });
    });
  }
})

app.get('/report',redirectLogin,function(req,res){
  if(req.session.company_details.billing_flag==2){
    res.render('report',{company:req.session.company_details});
}
})

app.get('/login',redirectHome,function(req,res){
  res.render('login',{flag:true,userId: req.session.userName});
})

app.get('/rootLogin',function(req,res){
  res.render('rootLogin',{flag:true,userId: req.session.userName});
})
app.get('/about',function(req,res){
  res.render('about',{userId: req.session.userName});
})

app.get('/account',redirectHome,function(req, res) {
      res.render('account',{userId: req.session.userName});
  });

app.get('/logout',redirectLogin,function(req, res) {
        req.session.destroy();
        res.redirect('/login');
      });
    app.get('/rootLogout',redirectLogin,function(req, res) {
              req.session.company_details.billing_flag=1;
              res.redirect('/home');
            });


app.get('/signup',redirectHome, function(req, res) {
      res.render('signup',{userId: req.session.userName});
  });

app.get('/forgotpassword',function(req, res) {
        res.render('forgotpassword',{flag:true,user: req.session.userName});
    });

app.get('/verify',function(req, res) {
            if(req.session.company_details)
            res.render('verify',{user :req.session.userName,flag:0,f1:req.session.company_details.billing_flag});
            else{
              res.render('verify',{user :req.session.userName,flag:0,f1:-1})
             }
        });

        app.post('/fetch',urlEncodedParser, function(req,res){
        console.log(req.body);
        var con = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "root",
          database: req.session.userName
        });
        con.connect(function(err) {
          if (err) throw err;
          con.query("call getProductFromBarCode(?)",[req.body.name],function (err, result) {
            if (err) throw err;
            console.log(result[0][0]);
            res.send(result[0])
          });
        });
        });

        app.post("/addProduct",urlEncodedParser,function(req,res){
        	console.log(req.body);
          var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: req.session.userName
          });
          let sql='call addProductIntoTable(?,?,?,?,?,?,?)';
          var params=[req.body.bid,req.body.pds,req.body.qn,req.body.up,req.body.hc,req.body.ct,req.body.gst];
        	let query=con.query(sql,params,(err,results)=>{
             if(err) throw err;
              console.log(results);
              res.redirect('/inventory')
              //res.send('data has inserted....');
          });
          //res.redirect('/inventory')
        })



        app.post("/addUser",urlEncodedParser,function(req,res){
        	console.log(req.body);
          var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: req.session.userName
          });
          let sql='call addUser(?)';
          var params=[req.body.user_name];
        	let query=con.query(sql,params,(err,results)=>{
             if(err) throw err;
              console.log(results);
              res.redirect('/usermanagement');
              //res.send('data has inserted....');
          });
          //res.redirect('/inventory')
        })

        app.post("/checkQty",urlEncodedParser,function(req,res){
          console.log(req.body);
          if(req.body.barcode.length>6){
           var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: req.session.userName
          });
          let sql='call checkQty(?)';
          var params=[req.body.barcode];
          let query=con.query(sql,params,(err,results)=>{
             if(err) throw err;
              console.log(results[0][0].quantity);
              if(results[0][0].quantity-req.body.qty>=0)
               res.status(200).end();
              else {
                res.status(404).end();
              }
          });

        }
      });


        app.post("/deleteUser",urlEncodedParser,function(req,res){
          console.log(req.body);
          var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: req.session.userName
          });
          let sql='call deleteUser(?)';
         var params=[req.body.delete];
          let query=con.query(sql,params,(err,results)=>{
              if(err) throw err;
               console.log(results);
              res.redirect('/usermanagement');
              //res.send('data has inserted....');
          });
          //res.redirect('/inventory')
        })

        app.post("/result",urlEncodedParser,function(req,res){
         //console.log(req.body);
         //console.log(req.files)
          if(req.files.filename.name){
            // console.log(req.files.filename.name);
           verify.verifyReceipt(req.files.filename.name,req.files.filename.data).then(()=>{

             if(req.session.company_details)
             res.render('verify',{user :req.session.userName,flag:2,f1:req.session.company_details.billing_flag});
             else{
               res.render('verify',{user :req.session.userName,flag:2,f1:-1})
               }
            }).catch(function(error){
               console.log(error)
               if(req.session.company_details)
               res.render('verify',{user :req.session.userName,flag:1,f1:req.session.company_details.billing_flag});
               else{
                 res.render('verify',{user :req.session.userName,flag:1,f1:-1})
                 }
           });
           }
        // else{
        //   res.render('verify',{user:req.session.userName});
        // }
});

app.post("/mail",redirectLogin,urlEncodedParser,function(req,res){
         console.log("bill preparing :",req.body);
         signBill.signAndMail(req.body,req.session.company_details.key_id).then(()=>{
                res.download('./bills/'+req.body.bill_no+'_invoice.pdf');
         }).catch(function(error){
           res.redirect('/home')
         });
});

app.post('/login',urlEncodedParser,function(req,res){
   loginController.login_check(req.body).then((company)=>{
     req.session.userId=company.company_id;
     req.session.userName=company.company_name;
     req.session.company_details=company;
     console.log("login successfully "+req.session.userId);
     res.redirect('/home');
   }).catch(function(error){
       res.render('login',{flag:false,userId: req.session.userId});
   });
      });

      app.post('/rootLogin',urlEncodedParser,function(req,res){
        console.log(req.session.company_details)
        if(req.body.password_input===req.session.company_details.pwd){
           console.log("root login successfully "+req.session.userId);
           req.session.company_details.billing_flag=2;
           res.redirect('/home');
         }
         else {
             res.render('rootLogin',{flag:false,userId: req.session.userName});
              }
            });


  app.post('/signup',urlEncodedParser,function(req,res){
      console.log(req.body);
      company.push(req.body);
      if(req.body.service_select_input=="Billing_system with Digital Singature")
       {res.redirect('/account');
       }
      else{
          signupController.signup_check(company).then(()=>{
             //alert("Registration succesfull");
             res.redirect('/login');
        });

      }
  });

  app.post('/account',urlEncodedParser,function(req,res){
      //console.log(req.body);

      console.log("company_details : ",company)
        company.push(req.body);
        signupController.signup_check(company).then(()=>{
           //alert("Registration succesfull");
           res.redirect('/login');
      });
  });


  app.post('/signAndMail',redirectLogin,urlEncodedParser,function(req,res){
     console.log(req.body)
     console.log(req.files)
     signBill.signAndMail1(req.body,req.files.filename.name,req.files.filename.data,).then(()=>{
            res.download('./bills/'+req.body.bill_no+'_invoice.pdf');
     }).catch(function(error){
         res.render('signInvoice',{company:req.session.company_details,f:1});
     });

    //console.log(req.session.company_details)
  });

  app.get('/bill',redirectLogin,urlEncodedParser,function(req,res){
    //console.log(req.body)
    //console.log(req.session.company_details)
    prepareBillController.generateInvoice(bill_data,req.session.company_details,req,res)
  });

  app.post('/payment',redirectLogin,urlEncodedParser,function(req,res){
    console.log(req.body)
    bill_data=req.body;
    res.render('payment',{company:req.session.company_details,data:bill_data});
  });


  app.post("/getReports",urlEncodedParser,redirectLogin,function(req,res){
    if(req.session.company_details.billing_flag==2){
  	console.log(req.body);
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: req.session.userName
    });
      var sql='call getBillDetailsFromDate(?,?)';
  		var param=[req.body.sdate,req.body.edate];
      con.query(sql,param,(err,results)=>{

        if(err) throw err;
        console.log(results[0])
        if(results[0][0]!==undefined)
        res.send(results[0]);
        else {
          res.status(404).end();
         }
      });
    }
    });

    app.get("/billDetails",urlEncodedParser,redirectLogin,function(req,res){
      if(req.session.company_details.billing_flag==2){
    	console.log(req.query.bill_no);
      console.log(req.query.c_id)
      var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: req.session.userName
      });
        var sql1='call getBillDetails(?)';
        var sql2='call getOrderedProducts(?)';
        var sql3='call getCustomerDetails(?)';
    		var param=[req.query.bill_no];
        con.query(sql1,param,(err,result1)=>{
          if(err) throw err
          if(result1[0][0]!==undefined){
            con.query(sql2,param,(err,result2)=>{
              if(err) throw err
              if(result1[0]!==undefined){
              con.query(sql3,[req.query.c_id],(err,result3)=>{
              var data=[result1[0][0],result2[0],result3[0][0]]
              console.log(data);
              res.render('bill_details',{company:req.session.company_details,data:data});
             });
           }
         });
       }
          else {
            res.status(404).end();
            }
        });
      }
      });

      app.post("/getProductsList",urlEncodedParser,redirectLogin,function(req,res){
        console.log(req.body);
        var con = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "root",
          database: req.session.userName
        });
          var sql='call getProductDetail(?)';
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

  app.post("/addQuantity",urlEncodedParser,redirectLogin,function(req,res){
          console.log(req.body);
          var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: req.session.userName
          });
            var sql='call addQuantityOfProduct(?,?)';
            var param=[req.body.p_id,req.body.qty];
            con.query(sql,param,(err,result)=>{
              if(!err)
                   res.status(200).end();
              else {
                res.status(404).end();
                }
            });
          });


app.listen(3000);

module.exports
