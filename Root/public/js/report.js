$(document).ready(function(){
$('#search').on('click',function(e){
e.preventDefault();
xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
     $('#signed_bill_details tr:not(:first)').remove();

 if (this.readyState == 4 && this.status == 200) {
   var myObj = JSON.parse(this.responseText);
   for(var i=0;i<myObj.length;i++){
    $('#signed_bill_details tbody').append("<tr>"+
   "<th>"+myObj[i].bill_name+"</a></th>"+
   "<th>"+myObj[i].company_name+"</a></th>"+
   "<th >"+myObj[i].bill_date.substring(0,10)+"</th>"+
   "<th >"+myObj[i].bill_time+"</th>"+
   "<th >"+myObj[i].customer_email+"</th>"+
    "<th >"+myObj[i].hash_code+"</th>"+
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

xhttp.open("POST", "http://localhost:3001/getSignedReports");
xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhttp.send("sdate="+s+"&&"+"edate="+e);
});
});
