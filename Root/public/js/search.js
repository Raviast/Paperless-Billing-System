$(document).ready(function(){
$('#search').on('click',function(e){
e.preventDefault();
var s_text=$("#search_text")[0].value;
fun(s_text)
});

$('#all_search').on('click',function(e){
e.preventDefault();
fun("all")
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
