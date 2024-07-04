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

$('#row1').find('td:nth-child(1)').on('focusout',function(){
  xhttp = new XMLHttpRequest();
  var s_text=$("#bid")[0].value;
  console.log("text",s_text)
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        console.log(myObj)
     var qty = prompt(myObj[0].product_desc+" product already exist", "Add Quantity");
     if (qty != null && qty != "") {
       xhttp1 = new XMLHttpRequest();
        xhttp1.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          window.alert("Successfully Updated !")
        }
      }
        var p_id=$("#bid")[0].value;
        xhttp1.open("POST", "http://localhost:3000/addQuantity");
        xhttp1.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhttp1.send("p_id="+p_id+"&&qty="+qty);
       }
     }
   }

  xhttp.open("POST", "http://localhost:3000/getProductsList");
  xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhttp.send("search_text="+s_text);
})
});

var fun=function(s_text){
  xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
       $('#product_details tr:not(:first)').remove();
     console.log('hi')
   if (this.readyState == 4 && this.status == 200) {
     var myObj = JSON.parse(this.responseText);
     console.log(myObj)
     for(var i=0;i<myObj.length;i++){
      $('#product_details tbody').append("<tr>"+
     "<th>"+myObj[i].barcode_id+"</a></th>"+
     "<th >"+myObj[i].product_desc+"</th>"+
     "<th >"+myObj[i].quantity+"</th>"+
     "<th >"+myObj[i].unit_price+"</th>"+
     "<th >"+myObj[i].product_category+"</th>"+
     "<th >"+myObj[i].gst+"</th>"+
     "</tr>"
   )
  }
  }
  else if(this.readyState == 4 && this.status == 404)
  {
    window.alert("No Records found !");
  }
   };

  xhttp.open("POST", "http://localhost:3000/getProductsList");
  xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhttp.send("search_text="+s_text);

}
