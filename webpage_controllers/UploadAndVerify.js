var pdfreader=require('PdfReader').PdfReader
var fs=require('fs');
const sha256=require('./myhash');
const bigint=require('big-integer');
var mysql=require('mysql');
var flag=0;
var company_id='';
var verifyReceipt=function(filename,buffer){
  //console.log(" good here "+filename);
  return new Promise(function(resolve, reject){
     pdreader=new pdfreader();
     var str="";
     var encryptHash="";
     var count=0;
pdreader.parseBuffer(buffer,function(err,item){
  count+=1;
if(item && item.text){

  if(flag==1){
    company_id=item.text;
    console.log(company_id);
    flag=0;
  }
  if(item.text.includes('sign: ')){
     encryptHash=item.text.substring(6);
    //console.log("encryptHash "+encryptHash);
   }
  else{
  //fetch company_name
  if(item.text.includes('company CIN:')){
       flag=1
  }
  str+=item.text;
      }
  }
});

setTimeout(()=>{
//console.log("string after"+str);
//console.log("count after ",count)
count=count-3;
str+=count;
if(company_id==''){
  console.log("not verified")
  reject();
}

getKeys(company_id).then((result)=>{
var e=bigint(result.public_key.replace(/\n|\r/g,""),16);
var n=bigint(result.mod_n.replace(/\n|\r/g,""),16);
var decryptHash=bigint(encryptHash,16).modPow(e,n);
console.log("e ",e)
console.log("n ",n)
console.log("encryptHash "+encryptHash);
console.log("decryptHash "+decryptHash.toString(16));
console.log("hash of string "+sha256.hash(str));

if(sha256.hash(str)==decryptHash.toString(16)){
console.log("verified");
resolve();
}
else {
  console.log("not verified")
  reject()
}
})},2000);
})
}


var getKeys=function(company_id){
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "third_party",
    multipleStatement:true
  });
  return new Promise(function(resolve,reject){
  con.query('call getDigitalKeys(?)',[company_id], function (err, result, fields) {
      if (!err) {
           console.log("success");
          if(result[0].length>0){
           console.log(result[0][0])
           resolve(result[0][0]);
           con.end();
         }
      } else {
          console.log('Error while performing Query.');
          reject();
          con.end();
      }
  });
})
}

// getKeys('abcd1234abcd1234abcd1').then((result)=>{console.log(result.public_Key)}).catch((error)=>{
// console.log(error);
// })

module.exports.verifyReceipt=verifyReceipt;
