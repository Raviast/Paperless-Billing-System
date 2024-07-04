var millerRabinTest=require('./MillerRabinTest.js')
var bigint=require('big-integer');

var generate=function(){
  var privateKey,publicKey,n;
  return new Promise(function(resolve,reject){
var p=bigint.randBetween("1e80", "1e100");
while(!p.isPrime()){
p=p.next();
 while(!millerRabinTest.isProbablePrime(p)){
  p=p.next();
}
}

console.log(p.bitLength())
// console.log("p "+p.toString())
//console.log(p.isPrime())


var q=bigint.randBetween("1e80", "1e100");
while(!q.isPrime()){
q=q.next();
 while(!millerRabinTest.isProbablePrime(q)){
  q=q.next();
}
}

 console.log(q.bitLength())
// console.log("q "+q.toString())
//console.log(q.isPrime())


n=p.multiply(q);
console.log(n.bitLength())
// console.log("n "+n.toString())


var fiofn= p.subtract(1).multiply(q.subtract(1));
//console.log(fiofn.bitLength())
// console.log("fiofn "+fiofn.toString())


var e=bigint.randBetween("1e80", "1e90");

while(!bigint.gcd(e,fiofn).equals(1)){
  e=e.next();
 if(e.greater(n))
   e=bigint.randBetween("1e80", "1e90");
}

// console.log(e.bitLength())
// console.log("e "+e.toString());

var privkey=e.modInv(fiofn);
// console.log("log_n"+n.toString(16));

// console.log(privkey.bitLength())
// console.log("privateKey "+privkey.toString(16));
// console.log("publicKey"+e.toString(16));
privateKey=privkey.toString(16)
publicKey=e.toString(16);
num=n.toString(16);
resolve({privateKey,publicKey,num});
})
};


// generate().then((k)=>{
//   console.log(k)
// h='abc'
// hash=sha256.hash(h)
// var m=bigint(hash,16);
// console.log("massage "+m.toString(16))
//
// //
// encrypt= m.modPow(bigint(k.publicKey,16),bigint(k.num,16));
// console.log("encrypt "+encrypt.toString(16))
// //
//  decrypt=encrypt.modPow(bigint(k.privateKey,16),bigint(k.num,16));
// console.log("decrypt "+decrypt.toString(16))
//
// encrypt= m.modPow(bigint(k.e),bigint(k.n));
// console.log("encrypt "+encrypt.toString(16))
// //
//  decrypt=encrypt.modPow(bigint(k.privkey),bigint(k.n));
// console.log("decrypt "+decrypt.toString(16))
//
// });
//console.log(generate())
module.exports.generate=generate;
