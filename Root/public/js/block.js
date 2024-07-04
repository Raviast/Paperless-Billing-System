$(document).ready(function(){
$('#block').on('click',function(e){
e.preventDefault();
fun(0);
$("#block").attr("disabled", true);

});

$('#Unblock').on('click',function(e){
e.preventDefault();
fun(1)
$("#Unblock").attr("disabled", true);
});
});

var fun=function(val){
  xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
       window.alert("Update Successfully !");
       location. reload() 
   }
   };
   var cin=$('#cin')[0].value;
  xhttp.open("POST", "http://localhost:3001/blockCompany");
  xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhttp.send("value="+val+"&&cin="+cin);

}
