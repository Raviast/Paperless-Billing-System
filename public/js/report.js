$(document).ready(function(){
$('#search').on('click',function(e){
e.preventDefault();
xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
     $('#bill_details tr:not(:first)').remove();

 if (this.readyState == 4 && this.status == 200) {
   var myObj = JSON.parse(this.responseText);
   for(var i=0;i<myObj.length;i++){
    $('#bill_details tbody').append("<tr>"+
   "<th><a href='/billDetails/?bill_no="+myObj[i].bill_no+"&c_id="+myObj[i].customer_id+"'>"+myObj[i].bill_no+"</a></th>"+
   "<th >"+myObj[i].bill_date.substring(0,10)+"</th>"+
   "<th >"+myObj[i].bill_time+"</th>"+
   "<th >"+myObj[i].customer+"</th>"+
   "<th >"+myObj[i].total_amount+"</th>"+
   "<th >"+myObj[i].payment_mode+"</th>"+
   "<th>"+"succesfull"+"</th>"+
   "<th>"+myObj[i].transaction_id+"</th>"+
   "<th>"+myObj[i].uname+"</th>"+
   "</tr>"
 )
}
}
else if(this.readyState == 4 && this.status == 404)
{
  window.alert("No Records found !");
 }
 };
var s=$("#std")[0].value;
var e=$("#end")[0].value;

xhttp.open("POST", "http://localhost:3000/getReports");
xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhttp.send("sdate="+s+"&&"+"edate="+e);
});
});
