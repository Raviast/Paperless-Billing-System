$(document).ready(function(){
$('#generate').on('click',function(e){
e.preventDefault();
var s_text=$("#num_keys")[0].value;
xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
 if (this.readyState == 4 && this.status == 200) {
   window.alert("Keys Added Successfully!");
   $('#searchKeys').click();
   }
else if(this.readyState == 4 && this.status == 404)
{
  window.alert("No Records found !");
}
 };
xhttp.open("GET", "http://localhost:3001/generateKeys/?num_keys="+s_text);
xhttp.send();
});

$('#searchKeys').on('click',function(e){
e.preventDefault();
xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
     $('#keys_details tr:not(:first)').remove();
 if (this.readyState == 4 && this.status == 200) {
   var myObj = JSON.parse(this.responseText);
   console.log(myObj)
    $('#keys_details tbody').append("<tr>"+
   "<th>"+myObj.total_keys+"</a></th>"+
   "<th >"+myObj.used_keys+"</th>"+
   "<th >"+(myObj.total_keys-myObj.used_keys)+"</th>"+
   "</tr>"
   )
}
else if(this.readyState == 4 && this.status == 404)
{
  window.alert("No Records found !");
}
 };
xhttp.open("GET", "http://localhost:3001/getKeysDetails");
xhttp.send();
});
});

var fun=function(s_text){
  xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
       $('#users_details tr:not(:first)').remove();
   if (this.readyState == 4 && this.status == 200) {
     var myObj = JSON.parse(this.responseText);
     console.log(myObj)
     for(var i=0;i<myObj.length;i++){
      $('#users_details tbody').append("<tr>"+
     "<th><a href='/getFullDetails/?c_id="+myObj[i].company_id+"'>"+myObj[i].company_id+"</a></th>"+
     "<th >"+myObj[i].company_name+"</th>"+
     "<th >"+myObj[i].address+"</th>"+
     "<th >"+myObj[i].email+"</th>"+
     "<th >"+myObj[i].contact_no+"</th>"+
     "<th >"+myObj[i].registration_date.substring(0,10)+"</th>"+
     "<th >"+myObj[i].service+"</th>"+
     "</tr>"
   )
  }
  }
  else if(this.readyState == 4 && this.status == 404)
  {
    window.alert("No Records found !");
  }
   };

  xhttp.open("POST", "http://localhost:3001/getUsersList");
  xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhttp.send("search_text="+s_text);

}
