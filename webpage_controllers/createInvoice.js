const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice,path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc,invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc,invoice) {
  doc
    .image("./public/images/Logo.jpg", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text(invoice.name, 110, 57)
    .fontSize(10)
    .text(invoice.name, 200, 50, { align: "right" })
    .text(invoice.address, 200, 65, { align: "right" })
    .text(invoice.city+" "+invoice.postal_code, 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.bill_no, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("company CIN:", 50, customerInformationTop + 30)
    .text(invoice.cinno, 150, customerInformationTop + 30)
    .text("company GSTIN:", 50, customerInformationTop + 45)
    .text(invoice.gstin, 150, customerInformationTop + 45)

    .font("Helvetica")
    .text("customer name:", 300, customerInformationTop )
    .text(invoice.customer_name, 400, customerInformationTop)
    .font("Helvetica")
    .text("customer email:", 300, customerInformationTop + 15)
    .text(invoice.customer_email, 400, customerInformationTop + 15)

    .font("Helvetica")
    .text("Mobile no:", 300, customerInformationTop + 30)
    .text(invoice.mobile_no, 400, customerInformationTop + 30)
    .moveDown();

  generateHr(doc, 270);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Unit Cost",
    "Quantity",
    "Gst_percentage",
    "Gst_Amount",
    "Product_Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i <invoice.product.length; i++) {
    const item = invoice.product[i];
    const position = invoiceTableTop + (i + 1) * 30;

    generateTableRow(
      doc,
      position,
      item,
      formatCurrency(invoice.price[i]),
      invoice.qty[i],
      invoice.Gst_percentage[i],
      formatCurrency(invoice.Gst_Amount[i]),
      formatCurrency(invoice.total[i])
    );

    generateHr(doc, position + 20);
  }

  const GrandTotalPosition = invoiceTableTop + (i + 1) * 30;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    GrandTotalPosition,
    "",
    "",
    "",
    "",
    "Grand total",
    formatCurrency(invoice.total_amount)
  );
  doc.font("Helvetica");
}
function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      " Thank you for shopping",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  unitCost,
  quantity,
  gstpercentage,
  gstamount,
  producttotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(unitCost, 110, y, { width: 90, align: "right" })
    .text(quantity, 195, y, { width: 90, align: "right" })
    .text(gstpercentage, 290, y, { width: 90, align: "right" })
    .text(gstamount, 370, y, { width: 90, align: "right" })
    .text(producttotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "RS " + cents;
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice
};
