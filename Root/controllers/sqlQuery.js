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
var product_category_table="create table product_category (category_id int(10) primary key auto_increment, category varchar(30) unique not null);";
query.push(product_category_table);

var products_table="create table products(barcode_id varchar(50) primary key,product_desc varchar(30) not null,quantity int not null default 0,unit_price float(10,2) not null default 0.00,hsn_code int not null,product_category int references product_category(category_id),gst float(10,2) not null default 0.0);";
query.push(products_table);

 var customer_table="create table customers(customer_id bigint primary key not null auto_increment,customer_name varchar(30) not null,contact bigint(10) not null default 1234567890,email varchar(25) not null,gstin varchar(21));";
 query.push(customer_table);

  var pmod_table="create table payment_modes(mod_id int primary key,mod_desc varchar(20));";
  query.push(pmod_table);

  var insert_pcat="INSERT INTO product_category VALUES (5,'Clothing'),(8,'Daily_uses'),(4,'Electronics'),(6,'Fashion'),(2,'Food'),(1,'Furniture');";
  query.push(insert_pcat);

  var invoice_table="create table invoice(bill_no bigint primary key auto_increment,bill_date_time datetime not null, customer_id bigint references customers(customer_id),total_amount float(10,2) not null default 0.00,payment_mode int references payment_modes(mod_id),payment_status bool not null default false,transaction_id varchar(30) not null);";
  query.push(invoice_table);
  var ordered_products_table="create table ordered_products(bill_no bigint references invoice(bill_no),barcode_id varchar(50) references products(barcode_id),quantity int not null);";
  query.push(ordered_products_table);
var insert_payMod="INSERT INTO payment_modes VALUES (1,'cash'),(2,'debit card'),(3,'credit card'),(4,'online wallet');";
query.push(insert_payMod);



var setOrderedItem_proc="CREATE  PROCEDURE setOrderedItem(in billNo bigint,in p_id varchar(50),in quantity int)\n BEGIN \n insert into ordered_products values(billNo,p_id,quantity);\n END ;";
query.push(setOrderedItem_proc);

var removeQuantityOfProduct_proc="CREATE PROCEDURE removeQuantityOfProduct(IN barcode varchar(10),in qt int) \n BEGIN \n update products set quantity=quantity-qt where barcode_id=barcode;\n End ;";
query.push(removeQuantityOfProduct_proc);

var prepareBill_proc="CREATE  PROCEDURE prepareBill(IN cus_id varchar(30),In amount float(10,2),In pmode int,in trans_id varchar(30))\n BEGIN\n Insert into invoice(bill_date_time,customer_id,total_amount,payment_mode,payment_status,transaction_id) values(current_timestamp(),cus_id,amount,pmode,1,trans_id);\n select last_insert_id();\n END ;";
query.push(prepareBill_proc);

var getProductDetail_proc="CREATE PROCEDURE getProductDetail(In barcode varchar(30))\n BEGIN\n from products where barcode_id=barcode;\n END ;";
query.push(getProductDetail_proc);

var getCustomerDetails_proc="CREATE  PROCEDURE getCustomerDetails(IN c_id bigint)\n BEGIN \n select customer_name,email,contact  from customers where customer_id=c_id;\n END ;";
query.push(getCustomerDetails_proc);

var addQuantityOfProduct_proc= "CREATE  PROCEDURE addQuantityOfProduct(IN barcode varchar(10),in qt int)\n BEGIN\n update products set quantity=quantity+qt where barcode_id=barcode;\n END ;"
query.push(addQuantityOfProduct_proc);

var addProductIntoTable_proc="CREATE PROCEDURE addProductIntoTable(In barcode varchar(30),in p_desc varchar(30),in qt int,in unit_p float(10,2) ,in hsn int,in category int,in pcgst float(10,2),in psgst float(10,2))\nBEGIN\nInsert into products(barcode_id,product_desc,quantity,unit_price,hsn_code,product_category,cgst,sgst) values(barcode,p_desc,qt,unit_p,hsn,category,pcgst,psgst);\n END ;";
query.push(addProductIntoTable_proc);

var addProductCategory_proc="CREATE PROCEDURE addProductCategory(IN category varchar(30))\nBEGIN\ninsert into product_category(category) values(category);\nEND ;";
query.push(addProductCategory_proc);

var addCustomerDetails_proc="CREATE  PROCEDURE addCustomerDetails(In cname varchar(30),In email varchar(30),In contactno bigint(10))\n BEGIN\n insert into customers(customer_name,email,contact) values(cname,email,contactno);\n select last_insert_id();\n END ;";
query.push(addCustomerDetails_proc);

var getProductCategory_function="CREATE FUNCTION getProductCategory(c_id int) RETURNS varchar(30) \n  DETERMINISTIC\n BEGIN\n Select category into @cat from product_category where category_id=c_id;\n RETURN @cat;\n END ;";
query.push(getProductCategory_function);



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
},1000);
}
//createDatabase('third_party');
module.exports.createDatabase=createDatabase;
