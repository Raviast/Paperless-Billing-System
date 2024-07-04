const nodemailer=require('nodemailer');
var mailFunction=function(bill_no,customer_email){
let transporter=nodemailer.createTransport({
  service:'gmail',
   port: 587,
  auth:{
    user:'shubhamachval@gmail.com',//for security
    pass:'8770583221'
  }
  });
  let mailOption={
    from:'shubhamachval4@gmail.com',
    to:customer_email,
    subject:'Online Bill Receipt',
    text:'Thank you for shopping \n you received a digitally signed Bill Receipt',
    attachments: [
      {
        filename: bill_no+'_invoice.pdf',
        path:"./bills/"+bill_no+"_invoice.pdf",
        contentType: 'aplication/pdf'
     }
    ]

  };
  transporter.sendMail(mailOption,function(err,data){
    if(err){
      console.log(err)
    }
    else{
      console.log('mail sent')
     }
  });
}

module.exports.mailFunction=mailFunction;
