const { createInvoice } = require("./createInvoice.js");
var mysql=require('mysql');

function generateInvoice(data,company,req,res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: company.company_name,
    multipleStatement:true
  });
 const invoice=  {
    date: data.date,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    mobile_no: data.mobile_no,
    userid:data.user_select,
    barcode: data.barcode,
    product: data.product,
    qty: data.qty,

    price:data.price,
    total:data.total,
    Gst_percentage: data.gstper,
    Gst_Amount: data.gstamount,
    total_amount: data.total_amount,

    name: company.company_name,
    address:company.address,
    city: company.city,
    postal_code: company.pincode,
    email: company.email,
    cinno: company.company_id,
    gstin: company.gstin,
    bill_no:''
  }

con.query('call addCustomerDetails(?,?,?)',[invoice.customer_name,invoice.customer_email,invoice.mobile_no], function (err, result1, fields){
if(!err){
  con.query('call addInvoiceDetails(?,?,?)',[result1[0][0].customer_id,invoice.total_amount,invoice.userid], function (err, result2, fields){
      if(!err){
         invoice.bill_no=result2[0][0].bill_no;
        for (i = 0; i <invoice.barcode.length; i++) {
          con.query('call setOrderedItem(?,?,?)',[invoice.bill_no,invoice.barcode[i],invoice.qty[i]], function (err, result2, fields){
               if(!err){
                 createInvoice(invoice,"./temp/"+invoice.bill_no+"_invoice.pdf");
                 res.render('signBill',{user:req.session.company_details,data:data,bill_no:invoice.bill_no})
                 }
             })
          }
        }
        else{console.log(err)}
      })
    }
else{
  console.log(err)
}
})
}

module.exports.generateInvoice = generateInvoice;
