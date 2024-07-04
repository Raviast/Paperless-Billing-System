var mail=require('./sendMail');
var bigint=require('big-integer');
var sha256=require('./myhash');
var PDFDocument=require('pdf-lib').PDFDocument
var StandardFonts=require('pdf-lib').StandardFonts
var rgb=require('pdf-lib').rgb
var fs=require('fs');
var mysql=require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "third_party",
  multipleStatement:true
});
async function start(text,date,hash,bill_no,buff){
 const textSize = 10
var buffer;
 if(buff==0)
buffer=fs.readFileSync('./temp/'+bill_no+'_invoice.pdf')
else{
  buffer=buff;
}
 const pdfDoc = await PDFDocument.load(buffer)
 const pages = pdfDoc.getPages();
 const { width, height } = pages[0].getSize()
 pages[0].drawText(text,{
  x: width/4,
  y: height/4,
  size: textSize,
  color: rgb(0, 0, 0),
})
pages[0].drawText(date,{
 x: width/4,
 y: height/4-20,
 size: textSize,
 color: rgb(0, 0, 0),
})
pages[0].drawText("sign: "+hash,{
 x: width/4,
 y: height/4-40,
 size: 2,
 color: rgb(0, 0, 0),
})
pages[0].drawRectangle({
  x: width/4 -20,
  y: height/4 -50,
  width: 200,
  height: 60,
  borderColor: rgb(0,0,0),
  borderWidth: 1.5,
})
 const pdfBytes = await pdfDoc.save()
 fs.writeFileSync('./bills/'+bill_no+'_invoice.pdf',pdfBytes);
}


var signAndMail= function(data,key_id)
{ return new Promise(function(resolve, reject){
var str="";
var pdfreader=require('PdfReader').PdfReader
var fs=require('fs');
pdfreader=new pdfreader();
var count=0;
pdfreader.parseFileItems("./temp/"+data.bill_no+"_invoice.pdf",function(err,item){
if(item && item.text){
  //console.log(item.text);
  str+=item.text;
  }
  count+=1;
});
var text="Digitally Signed By "+data.company_name;
var date=""+new Date();
date=date.substring(0,29)
setTimeout(()=>{
getKeys(data.company_cin).then((result)=>{
  str=str+text+date+count;
  var hash=sha256.hash(str)
  console.log("string before"+str);
  console.log("hash ",hash);
  console.log("count ",count);
  saveHash(data.company_cin,data.bill_no+"_invoice.pdf",data.customer_email,hash)
  var m=bigint(hash,16);
  // console.log(result.private_key);
  // console.log(result.mod_n);
  var p=bigint(result.private_key.replace(/\n|\r/g,""),16);
  var n=bigint(result.mod_n.replace(/\n|\r/g,""),16);
  console.log("private_key ",p)
  console.log("mod_n ",n)
  var signedHash=m.modPow(p,n).toString(16);
  console.log("signedHash ",signedHash);
  start(text,date,signedHash,data.bill_no,0);
  setTimeout(()=>{
  mail.mailFunction(data.bill_no,data.customer_email)
  resolve(); }
,2000);
});
},2000);
});
}

var signAndMail1 = function(data,filename,buffer,key_id)
{  console.log('here')
   return new Promise(function(resolve, reject){
  var str="";
  var cin="";
  var flag=0;
  var pdfreader=require('PdfReader').PdfReader
  //var fs=require('fs');
  pdreader=new pdfreader();
  var count=0;
  pdreader.parseBuffer(buffer,function(err,item){
     count+=1;
   if(item && item.text){
   str+=item.text;
   if(flag==1){
     cin=item.text;
     console.log(cin);
     flag=0;
      }
   if(item.text.includes('company CIN:')){
        flag=1
       }
  }
});
var text="Digitally Signed By "+data.company_name;
var date=""+new Date();
date=date.substring(0,29)
setTimeout(()=>{
  if(cin==data.company_cin){
getKeys(cin).then((result)=>{
  str=str+text+date+count;
  var hash=sha256.hash(str)
  console.log("string before "+str);
  console.log("hash ", hash);
  console.log("count ",count)
  saveHash(data.company_cin,filename,data.customer_email,hash);

  var m=bigint(hash,16);
  // console.log(result.private_key);
  // console.log(result.mod_n);
  var p=bigint(result.private_key.replace(/\n|\r/g,""),16);
  var n=bigint(result.mod_n.replace(/\n|\r/g,""),16);
  console.log("private_key ",p)
  console.log("mod_n ",n)
  var signedHash=m.modPow(p,n).toString(16);
  console.log("signed hash ",signedHash);
  start(text,date,signedHash,data.bill_no,buffer);
  setTimeout(()=>{
    mail.mailFunction(data.bill_no,data.customer_email)
    resolve();
    }
,2000);
});
  }
  else{
    reject();
  }
}
,2000);
});
}

var getKeys=function(company_id){
  return new Promise(function(resolve,reject){
  con.query('call getDigitalKeys(?)',[company_id], function (err, result, fields) {
      if (!err) {
           console.log("success");
          if(result[0].length>0){
           console.log(result[0][0])
           resolve(result[0][0]);
         }
      } else {
          console.log('Error while performing Query.');
          reject();
      }
  });
})
}
 // getKeys('abcd1234abcd1234abcd1').then((result)=>{
 // console.log(result.private_key.replace(/\n|\r/g, ""))}).catch((error)=>{
 // console.log(error);
 // })


 var saveHash=function(company_id,bill_name,email_id,hash){
   con.query('call addSignedBills(?,?,?,?)',[company_id,bill_name,email_id,hash], function (err, result, fields) {
       if (!err) {
            console.log("success");
          }
       else {
           console.log('Error while performing Query.');
       }
   });
 }
module.exports.signAndMail=signAndMail;
module.exports.signAndMail1=signAndMail1;
