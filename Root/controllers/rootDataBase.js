var mysql=require('mysql');

var createDatabase=function(dbname){
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  multipleStatement:true
});

var q="create Database ";
con.connect();

con.query(q+dbname, function (err, result,fields) {
//con.query('select company_id from company where company_name=? and pwd=?',[body.Company_name_input,body.password_input], function (err, result,fields) {
 if (err) throw err;
});



con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: dbname,
  multipleStatement:true
});

var query = [];


var signedBill_table="CREATE TABLE `signed_bills` ( `company_id` varchar(21) NOT NULL, `bill_name` varchar(50) NOT NULL, `customer_email` varchar(50) NOT NULL,`date_time` datetime NOT NULL,`hash_code` longtext NOT NULL)";
query.push(signedBill_table);

 var digitalKeys_table="CREATE TABLE `digital_keys` (`key_id` int(11) NOT NULL AUTO_INCREMENT,`private_key` blob NOT NULL,`public_key` blob NOT NULL,`mod_n` blob NOT NULL,PRIMARY KEY (`key_id`))";
 query.push(digitalKeys_table);

var company_table="CREATE TABLE `company` (`company_id` varchar(21) NOT NULL,  `pwd` varchar(10) NOT NULL,  `company_name` varchar(60) NOT NULL,  `address` varchar(100) NOT NULL,  `email` varchar(25) NOT NULL,  `contact_no` bigint(10) NOT NULL,  `gstin` varchar(15) NOT NULL,  `city` varchar(30) NOT NULL,  `pincode` varchar(6) NOT NULL,  `registration_date` date NOT NULL,  `billing_flag` tinyint(4) NOT NULL DEFAULT '1',  `key_id` int(11) NOT NULL AUTO_INCREMENT,  `active_flag` tinyint(4) NOT NULL DEFAULT '1',  PRIMARY KEY (`company_id`),  UNIQUE KEY `company_name` (`company_name`),  UNIQUE KEY `key_id_UNIQUE` (`key_id`),  CONSTRAINT `key_reference` FOREIGN KEY (`key_id`) REFERENCES `digital_keys` (`key_id`))" ;
  query.push(company_table);

  var bank_details_table="CREATE TABLE `bank_details` ( `company_id` varchar(21) DEFAULT NULL, `account_no` bigint(20) NOT NULL,`bank_name` varchar(30) NOT NULL,`ifse_code` varchar(20) NOT NULL,  `branch` varchar(30) NOT NULL, `account_holder_name` varchar(30) NOT NULL, KEY `bank_details_ibfk_1` (`company_id`),CONSTRAINT `bank_details_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE)";
  query.push(bank_details_table);

var addBankDetails_proc="CREATE PROCEDURE `addCompanyBankDetails`(IN company_id varchar(21),In account_no bigint, In bank_name varchar(30),  In branch_name varchar(30), In ifse_code varchar(20), In account_holder_name varchar(30)) BEGIN Insert into bank_details values(company_id,account_no,bank_name,branch_name,ifse_code,account_holder_name);END ;"
query.push(addBankDetails_proc)

var addCompanyDetails_proc="CREATE DEFINER=`root`@`localhost` PROCEDURE `addCompanyDetails`(IN c_id varchar(21), IN pass varchar(10) , IN c_name varchar(60) ,IN ads varchar(100) ,In mail varchar(50), IN con_no bigint(10), In gst varchar(15), In city_n varchar(30), In pin_c varchar(30),IN flag int) BEGIN Insert into company(company_id,pwd,company_name,address,email,contact_no,gstin,city,pincode,registration_date,billing_flag,active_flag) values(c_id,pass,c_name,ads,mail,con_no,gst,city_n,pin_c,current_date(),flag,1);END ;"
  query.push(addCompanyDetails_proc)

  var addDigitalKeys_proc="CREATE PROCEDURE `addDigitalKeys`(in pr_key longtext,in pb_key longtext,in mod_num longtext) BEGIN insert into digital_keys(private_key,public_key,mod_n) values(cast(aes_encrypt(pr_key,'root') as character),cast(aes_encrypt(pb_key,'root') as character),cast(aes_encrypt(mod_num,'root') as character));END";
  query.push(addDigitalKeys_proc);

  var addSignedBills_proc="CREATE PROCEDURE `addSignedBills`(in cin varchar(30),in bill_name varchar(30),in email varchar(50),in h_code longtext) BEGIN insert into signed_bills values(cin,bill_name,email,current_timestamp(),h_code);END ;";
  query.push(addSignedBills_proc);

 var blockCompany_proc="CREATE PROCEDURE `blockCompany`(in val int,in cin varchar(30)) BEGIN update company set active_flag=val where company_id=cin;END ;";
 query.push(blockCompany_proc);

var loginCheck_proc="CREATE PROCEDURE `checkLogin`(in c_id varchar(30),in pwd_in varchar(30)) BEGIN Select * from company where company_name=c_id and pwd=pwd_in and active_flag=1;END ;";
query.push(loginCheck_proc);

var createDatabase_proc="CREATE PROCEDURE `createNewDatabase`(In dbname varchar(30))BEGIN SET @query = CONCAT('CREATE DATABASE ',dbname);PREPARE stmt FROM @query;EXECUTE stmt;DEALLOCATE PREPARE stmt;END ;"
query.push(createDatabase_proc)


var getBankDetails_proc="CREATE PROCEDURE `getCompanyBankDetails`(IN c_id varchar(21)) BEGIN select bank_name,account_no,ifse_code,account_holder_name from company where company_id=c_id;END ;"
query.push(getBankDetails_proc)

var getCompanyDetails_proc="CREATE PROCEDURE `getCompanyDetails`(In s_text varchar(30)) BEGIN if (s_text!='all') then SELECT company_id,pwd,company_name, concat(address,' ',city,' ',pincode) as address, email,contact_no,gstin,registration_date,getService(billing_flag) as service,key_id,boolean_value(active_flag) as active_flag FROM third_party.company where company_id like concat('%',s_text,'%') or company_name like concat('%',s_text,'%') or city like concat('%',s_text,'%') or registration_date like concat('%',s_text,'%'); else SELECT company_id,pwd,company_name, concat(address,' ',city,' ',pincode) as address, email,contact_no,gstin,registration_date,getService(billing_flag) as service,key_id,boolean_value(active_flag) as active_flag FROM third_party.company;end if;END ;";
query.push(getCompanyDetails_proc);

var getDigitalKeys_proc= "CREATE PROCEDURE `getDigitalKeys`(in c_id varchar(30)) BEGIN select cast(aes_decrypt(private_key,'root') as char) as private_key,cast(aes_decrypt(public_key,'root') as char) as public_key,cast(aes_decrypt(mod_n,'root') as char) as mod_n from digital_keys where key_id=(select key_id from company where company_id=c_id);END"
query.push(getDigitalKeys_proc);

var getFullCompanyDetails_proc="CREATE PROCEDURE `getFullCompanyDetails`(in cin varchar(30)) BEGIN SELECT company.company_id,pwd,company_name, concat(address,' ',city,' ',pincode) as address, email,contact_no,gstin,registration_date,getService(billing_flag) as service,company.key_id,boolean_value(active_flag) as active_flag,account_no,account_holder_name,bank_name,ifse_code,branch,private_key,public_key,mod_n FROM third_party.company  inner join bank_details on bank_details.company_id=company.company_id inner join digital_keys where digital_keys.key_id=company.key_id having company.company_id=cin;END ;";
query.push(getFullCompanyDetails_proc);

var getKeys_proc="CREATE PROCEDURE `getKeysDetails`() BEGIN select count(*) from digital_keys into @total_keys;select count(*) from company into @used_keys;select @total_keys as total_keys,@used_keys as used_keys;END ;";
query.push(getKeys_proc);

var getSignedBills_proc="CREATE PROCEDURE `getSignedBills`(in s date,in e date) BEGIN SELECT bill_name,company_id,customer_email,getCompanyName(company_id) as company_name,date(date_time) bill_date,time(date_time) as bill_time,hash_code FROM third_party.signed_bills where date(date_time) between s and e;END ;";
query.push(getSignedBills_proc);

var boolean_function="CREATE FUNCTION `boolean_value`(val int) RETURNS varchar(10) DETERMINISTIC BEGIN if (val=1) then select 'Active' into @flag;else select 'Blocked' into @flag;end if;RETURN @flag;END ;";
query.push(boolean_function);

var getCompanyName_function="CREATE FUNCTION `getCompanyName`(cin varchar(30)) RETURNS varchar(50) DETERMINISTIC BEGIN select company_name into @name from company where company_id=cin; RETURN @name;END ;";
query.push(getCompanyName_function);

var getService_function="CREATE FUNCTION `getService`(val int) RETURNS varchar(100) DETERMINISTIC BEGIN if (val=1) then select 'Billing System With Digital Sinature' into @ser;else select 'Digital Sinature' into @ser;end if;RETURN @ser;END ;"
query.push(getService_function)

setTimeout(()=>{
for(var i = 0; i < query.length; i++) {
    console.log(query[i]);
    con.query(query[i], function (err, rows, fields) {
        if (!err) {
            console.log("success"); //emails succeeds, as do other create table commands
        } else {
            console.log('Error while performing Query.'); //any queries that create stored procedures fail
        }
    });
}
con.end();
},1000);
}
createDatabase('sample');
