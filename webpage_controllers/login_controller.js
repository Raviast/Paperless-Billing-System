var mysql=require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "third_party",
  multipleStatement:true
});

var login_check= function(body){
  var user;
   return new Promise(function (resolve, reject){
     console.log(body)
     con.query('call checkLogin(?,?);',[body.Company_name_input.trim().replace(/ /g, "_"),body.password_input], function (err, result,fields) {
    //con.query('select company_id from company where company_name=? and pwd=?',[body.Company_name_input,body.password_input], function (err, result,fields) {
      if (err) throw err;
     if(result[0].length>0){
      //user=result[0][0].company_id;
      resolve(result[0][0]);
      }

      else{
        reject();
      }
    });


});
}
module.exports.login_check=login_check;
