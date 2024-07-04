var bigint=require('big-integer')

// num=2^r.m+1

class MillerRabinTest {
  static isProbablePrime(num){
    num=bigint(num)
    var iterations=5;
    var m=num.subtract(1);

    while(m.mod(2).equals(0)){
      m=m.divide(2);
      }

    //console.log("m "+m);
    var a=bigint.randBetween(2,100);
    var b0=a.modPow(m,num)                       //b0=a^m mod num

    if(b0.equals(1) || b0.equals(num-1)){
      return true;
     }
    else{
    for(var j=0;j<iterations;j++){
       var b1=b0.pow(2).mod(num)                 //b1=b0^2 mod num
         if(b1.equals(1)){
           return false;
         }

         else if(b1.equals(num-1)){
              return true;
       }
       b0=b1;
    }
    if(j==iterations)
    return false;
    }
  }

}

module.exports=MillerRabinTest;
// var q=bigint.randBetween("1e75", "1e78");
//     if(millerRabin.isProbablePrime(q))
//     console.log("prime "+q.isProbablePrime())
//     else {
//       console.log("is composite "+q.isProbablePrime())
//     }
//  console.log(q.bitLength())
