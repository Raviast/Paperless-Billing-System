var mysql=require('mysql');
var sqlQuery=require('./sqlQuery')
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "third_party"
});


 var signup_check= function(company){
    console.log(company)
      var user;
      var query1="call addCompanyDetails(?,?,?,?,?,?,?,?,?,?)";
      var query2="call addCompanyBankDetails(?,?,?,?,?,?)";
      var params=[company[0].CIN_number_input,
      company[0].User_password_input,
      company[0].Company_name_input.trim().replace(/ /g, "_"),
      company[0].User_address_input[0]+""+company[0].User_address_input[1],
      company[0].Email_id_input,
      company[0].Contact_number_input,
      company[0].Gst_number_input,
      company[0].User_address_input[2],
      company[0].Pin_code_input,

    ];
     if(company[0].service_select_input=="Billing_system with Digital Singature"){
       params.push(1);
     }
     else{
       params.push(0);
     }

    return new Promise(function (resolve, reject){
    con.query(query1,params,function (err, result,fields) {
       if (err) throw err;
     if(!err){
        if(company[0].service_select_input=="Billing_system with Digital Singature")
         {
           var bank_params=[
             company[0].CIN_number_input,
             company[1].Account_number_input,
             company[1].Bank_name_input,
             company[1].Branch_name_input,
             company[1].Ifsc_code_input,
             company[1].Accholder_name_input
           ];
           con.query(query2,bank_params,function (err, result,fields) {
          if (err) throw err;
        });

         sqlQuery.createDatabase(company[0].Company_name_input.trim().replace(/ /g, "_"));
       }
       resolve();
      }
      else{
        reject();
}
});
});
}
module.exports.signup_check=signup_check;
