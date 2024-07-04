$(document).ready(function(){
    var i=1;
    $("#add_row").click(function(){
        b=i-1;
      	$('#addr'+i).html($('#addr'+b).html()).find('td:first-child').html(i+1);
        $('#addr'+i).find('td:nth-child(2)').on('focusout',function(){
           xhttp = new XMLHttpRequest();
           xhttp.onreadystatechange = function() {
           if (this.readyState == 4 && this.status == 200) {
             var myObj = JSON.parse(this.responseText);
             //var gper=myObj[0].cgst+myObj[0].sgst;
             document.getElementsByName("product[]")[i-1].value=myObj[0].product_desc;
             document.getElementsByName("qty[]")[i-1].value=1;
             document.getElementsByName("price[]")[i-1].value=myObj[0].unit_price;
             document.getElementsByName("gstper[]")[i-1].value=myObj[0].gst;
             calc();
           }
           };
          var name=$(this).find("input")[0].value
          xhttp.open("POST", "http://localhost:3000/fetch");
          xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhttp.send("name="+name);
         });
         $('#addr'+i).find('td:nth-child(4)').on('focusout',function(){
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              var myObj = JSON.parse(this.responseText);
              calc();
            }
            else if(this.readyState == 4 && this.status == 404)
            {
             document.getElementsByName('qty[]')[i-1].value=1;
              window.alert("Quantity Limit Exceeds!");
              calc();
            }
          };
           var qty=$(this).find("input")[0].value
           var barcode=document.getElementsByName('barcode[]')[i-1].value;
           xhttp.open("POST", "http://localhost:3000/checkQty");
           xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
           xhttp.send("qty="+qty+"&barcode="+barcode);
          });

        $('#tab_logic').append('<tr id="addr'+(i+1)+'"></tr>');
      	i++;
  	});

      $('#addr0').find('td:nth-child(2)').on('focusout',function(){
        xhttp = new XMLHttpRequest();
         xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
           var myObj = JSON.parse(this.responseText);
           //var gper=myObj[0].cgst+myObj[0].sgst;
           document.getElementsByName("product[]")[0].value=myObj[0].product_desc;
           document.getElementsByName("qty[]")[0].value=1;
           document.getElementsByName("price[]")[0].value=myObj[0].unit_price;
           document.getElementsByName("gstper[]")[0].value=myObj[0].gst;
           calc();
         }
         };
        var name=$("#addr0").find("input")[0].value;
        xhttp.open("POST", "http://localhost:3000/fetch");
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhttp.send("name="+name);
       });

       $('#addr0').find('td:nth-child(4)').on('focusout',function(){
          xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            calc();
            }
            else if(this.readyState == 4 && this.status == 404)
            { document.getElementsByName('qty[]')[0].value=1
              window.alert("Quantity Limit Exceeds!");
              calc();
            }
          };
         var qty=$(this).find("input")[0].value
         var barcode=document.getElementsByName('barcode[]')[0].value;
         xhttp.open("POST", "http://localhost:3000/checkQty");
         xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
         xhttp.send("barcode="+barcode+"&qty="+qty);
        });

    document.querySelector("#today").valueAsDate = new Date();
    $("#delete_row").click(function(){
    	if(i>1){
		$("#addr"+(i-1)).html('');
		i--;
		}
		calc();
	});

	$('#tab_logic tbody').on('keyup change',function(){
		calc();
	});
	$('#tax').on('keyup change',function(){
		calc_total();
	});


});

function calc()
{
	$('#tab_logic tbody tr').each(function(i, element) {
		var html = $(this).html();
		if(html!='')
		{
			var qty = $(this).find('.qty').val();
			var price = $(this).find('.price').val();
      var gstper = $(this).find('.gstper').val();
      var gamount=qty*price*gstper/100;
      $(this).find('.gstamount').val(gamount);
			$(this).find('.total').val(gamount+qty*price);

			calc_total();
		}
    });
}

function calc_total()
{
	total=0;
  tax_sum=0;
	$('.total').each(function() {
        total += parseFloat($(this).val());
    });
	//$('#sub_total').val(total.toFixed(2));
	//tax_sum=total/100*$('#tax').val();
	//$('#tax_amount').val(tax_sum.toFixed(2));
	$('#total_amount').val((tax_sum+total).toFixed(2));
}
function checkCheckBox(theForm) {
	if (
	theForm.chbox.checked == false)
	{
		alert ('click on the checkbox to prepare bill');
		return false;
	} else {
		return true;
	}
}
