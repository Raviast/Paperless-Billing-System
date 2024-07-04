var mysql=require('mysql');

var createDatabase=function(dbname){
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "third_party",
  multipleStatement:true
});

var q="call createNewDatabase(?)";
con.connect();

con.query(q,[dbname], function (err, result,fields) {
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

var product_category_table="CREATE TABLE product_category ( category_id int(10) NOT NULL AUTO_INCREMENT, category varchar(30) NOT NULL, PRIMARY KEY (category_id), UNIQUE KEY category (category))";
query.push(product_category_table);

var users_table="create table users(userid int primary key AUTO_INCREMENT,uname varchar(50) not null);"
query.push(users_table);

var products_table="CREATE TABLE products(barcode_id varchar(50) NOT NULL,product_desc varchar(30) NOT NULL,quantity int(11) NOT NULL DEFAULT '0',unit_price float(10,2) NOT NULL DEFAULT '0.00',hsn_code int(11) NOT NULL,product_category int(11) DEFAULT NULL,gst float(10,2) DEFAULT '5.00',PRIMARY KEY (barcode_id))";
query.push(products_table);

 var customer_table="CREATE TABLE customers (customer_id bigint(20) NOT NULL AUTO_INCREMENT,customer_name varchar(30) NOT NULL,contact bigint(10) NOT NULL DEFAULT '1234567890',email varchar(25) NOT NULL,gstin varchar(21) DEFAULT NULL,PRIMARY KEY (customer_id))";
 query.push(customer_table);

  var pmod_table="CREATE TABLE payment_modes(mod_id int(11) NOT NULL,mod_desc varchar(20) DEFAULT NULL, PRIMARY KEY (mod_id))";
  query.push(pmod_table);


  var invoice_table="CREATE TABLE invoice(bill_no bigint(20) NOT NULL AUTO_INCREMENT,bill_date_time datetime NOT NULL,customer_id bigint(20) NOT NULL,total_amount float(10,2) NOT NULL DEFAULT '0.00',payment_mode int(11) NOT NULL,payment_status tinyint(1) NOT NULL DEFAULT '0',transaction_id varchar(30) DEFAULT NULL,uid int not null,PRIMARY KEY (bill_no))";
  query.push(invoice_table);

  var ordered_products_table="CREATE TABLE ordered_products (bill_no bigint(20) DEFAULT NULL,barcode_id varchar(50) DEFAULT NULL,quantity int(11) NOT NULL)";
  query.push(ordered_products_table);

  var insert_payMod="INSERT INTO payment_modes VALUES (1,'cash'),(2,'debit card'),(3,'credit card'),(4,'online wallet');";
  query.push(insert_payMod);

    var insert_pcat="INSERT INTO product_category VALUES (1,'Clothing'),(2,'Daily_uses'),(3,'Electronics'),(4,'Fashion'),(5,'Food'),(6,'Furniture'),(7,'Other');";
  query.push(insert_pcat);


      var insert_users="INSERT INTO users VALUES (1,'user1'),(2,'user2'),(3,'user3');";
     query.push(insert_users);



  var getBillDetails_proc="CREATE PROCEDURE getBillDetails(in b_no int) BEGIN SELECT  bill_no,bill_date_time,customer_id,total_amount,getPaymentMode(payment_mode) as payment_mode,payment_status,transaction_id FROM invoice WHERE bill_no=b_no;END ;"
  query.push(getBillDetails_proc)

  var getBilFromDate_proc="CREATE PROCEDURE `getBillDetailsFromDate`(in sdate date,in edate date) BEGIN SELECT  bill_no,getusername(uid) as uname,date(bill_date_time) as bill_date,time(bill_date_time) as bill_time,customer_id,getCustomerEmail(customer_id) as customer,total_amount,getPaymentMode(payment_mode) as payment_mode,payment_status,transaction_id FROM invoice WHERE date(bill_date_time) BETWEEN sdate AND edate;END"
  query.push(getBilFromDate_proc)

  var setOrderedItem_proc="CREATE PROCEDURE setOrderedItem(in billNo bigint,in p_id varchar(50),in qty int) BEGIN insert into ordered_products values(billNo,p_id,qty); update products set quantity=quantity-qty where barcode_id=p_id; END ;";
  query.push(setOrderedItem_proc);

  var removeQuantityOfProduct_proc="CREATE PROCEDURE removeQuantityOfProduct(IN barcode varchar(10),in qt int) \n BEGIN \n update products set quantity=quantity-qt where barcode_id=barcode;\n End ;";
  query.push(removeQuantityOfProduct_proc);

 var prepareBill_proc="CREATE  PROCEDURE `addInvoiceDetails`(IN cus_id varchar(30),In amount float(10,2),in userid int) BEGIN Insert into invoice(bill_date_time,customer_id,total_amount,payment_mode,payment_status,transaction_id,uid) values(current_timestamp(),cus_id,amount,1,1,'tzx12345',userid); select last_insert_id() as bill_no; END";
 query.push(prepareBill_proc);

var getProductDetail_proc="CREATE PROCEDURE getProductDetailFromBarCode(In barcode varchar(30))\n BEGIN\ select barcode_id,product_desc,quantity,unit_price,hsn_code,getProductCategory(product_category) as product_category,gst from products where barcode_id=barcode;\n END ;";
query.push(getProductDetail_proc);

var getProductsList_proc="CREATE PROCEDURE getProductDetail(In s_text varchar(30)) BEGIN if (s_text!='all') then select barcode_id,product_desc,quantity,unit_price,hsn_code,getProductCategory(product_category) as product_category,gst from products where barcode_id like concat('%',s_text,'%') or getProductCategory(product_category) like concat('%',s_text,'%')  or product_desc like concat('%',s_text,'%') ;else select barcode_id,product_desc,quantity,unit_price,hsn_code,getProductCategory(product_category) as product_category,gst from products; end if;END ;"
query.push(getProductsList_proc)

var getOrderedProducts_proc="CREATE  PROCEDURE getOrderedProducts(in b_no int) BEGIN select op.bill_no,op.barcode_id,product_desc,unit_price as unit_price_RS,getProductCategory(product_category) as category,op.quantity as perchased_qty,gst from (select * from ordered_products where bill_no=b_no) as op inner join products on op.barcode_id=products.barcode_id ;END ;"
query.push(getOrderedProducts_proc)

var getCustomerDetails_proc="CREATE  PROCEDURE getCustomerDetails(IN c_id bigint)\n BEGIN \n select customer_name,email,contact  from customers where customer_id=c_id;\n END ;";
query.push(getCustomerDetails_proc);

var addQuantityOfProduct_proc= "CREATE  PROCEDURE addQuantityOfProduct(IN barcode varchar(10),in qt int) BEGIN update products set quantity=quantity+qt where barcode_id=barcode;END ;"
query.push(addQuantityOfProduct_proc);

var addProductIntoTable_proc="CREATE PROCEDURE addProductIntoTable (In barcode varchar(30),in p_desc varchar(30),in qt int,in unit_p float(10,2) ,in hsn int,in category int,in gst_per float(10,2)) BEGIN Insert into products(barcode_id,product_desc,quantity,unit_price,hsn_code,product_category,gst) values(barcode,p_desc,qt,unit_p,hsn,category,gst_per); END ;";
query.push(addProductIntoTable_proc);

var addProductCategory_proc="CREATE PROCEDURE addProductCategory(IN category varchar(30)) BEGIN insert into product_category(category) values(category); END ;";
query.push(addProductCategory_proc);

var addCustomerDetails_proc="CREATE PROCEDURE addCustomerDetails(In cname varchar(30),In email varchar(30),In contactno bigint(10)) BEGIN insert into customers(customer_name,email,contact,gstin) values(cname,email,contactno,null);select last_insert_id() as customer_id; END ;";
query.push(addCustomerDetails_proc);

var getProductFromBarCode_proc="CREATE PROCEDURE getProductFromBarcode(in bar_id varchar(30)) BEGIN select barcode_id,product_desc,quantity,unit_price,hsn_code,getProductCategory(product_category) as product_category,gst from products where barcode_id=bar_id;END;"
query.push(getProductFromBarCode_proc)

var getProductCategory_function="CREATE FUNCTION getProductCategory(c_id int) RETURNS varchar(30) \n  DETERMINISTIC\n BEGIN\n Select category into @cat from product_category where category_id=c_id;\n RETURN @cat;\n END ;";
query.push(getProductCategory_function);

var adduser_proc="CREATE PROCEDURE `addUser`(in u_name varchar(50)) BEGIN insert into users(uname) values(u_name);END"
query.push(adduser_proc)

var deleteUser_proc="CREATE PROCEDURE `deleteUser`(in u_id varchar(50)) BEGIN delete from users where userid=u_id;END"
query.push(deleteUser_proc)

var getuser_proc="CREATE  PROCEDURE getUsers() BEGIN select * from users;END"
query.push(getuser_proc);

var checkQty_proc="CREATE  PROCEDURE `checkQty`(in barcode varchar(100)) BEGIN SELECT quantity FROM my_company.products where barcode_id=barcode;END"
query.push(checkQty_proc);

var customer_email_fun="CREATE FUNCTION getCustomerEmail(c_id int) RETURNS varchar(30) \n DETERMINISTIC \n BEGIN  \n Select email into @cat from customers where customer_id=c_id;RETURN @cat;END ;";
query.push(customer_email_fun);

var payment_mod_fun="CREATE FUNCTION getPaymentMode(m_id int) RETURNS varchar(30)  \n DETERMINISTIC \n BEGIN \n SELECT mod_desc into @payment_mode FROM payment_modes where mod_id=m_id;RETURN @payment_mode;END ;"
query.push(payment_mod_fun)

var getuserid_fun="CREATE FUNCTION `getuserid`(u_name varchar(50)) RETURNS int(11) DETERMINISTIC BEGIN select userid into @id from users where uname=u_name;RETURN @id; END"
query.push(getuserid_fun);

var getusername_fun="CREATE FUNCTION `getusername`(uid int) RETURNS varchar(50) DETERMINISTIC BEGIN select uname into @uname from users where userid=uid;RETURN @uname;END"
query.push(getusername_fun);

setTimeout(()=>{
for(var i = 0; i < query.length; i++) {
    console.log(query[i]);
    con.query(query[i], function (err, rows, fields) {
        if (!err) {
            console.log("success"); //emails succeeds, as do other create table commands
        } else {
            console.log('Error while performing Query.',err); //any queries that create stored procedures fail
        }
    });
}
con.end();
},1000);
}

//createDatabase('RV infrastructure'.trim().replace(/ /g,'_'));
module.exports.createDatabase=createDatabase;
