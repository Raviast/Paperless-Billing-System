var bigint=require('big-integer')

class myhash{

static hash(string){
var encoding='! "#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
try{
var a=bigint(string,95,encoding,true);
}catch(error){
  var a="0000000";
}
 var b=bigint(a.toString(2));

var size=bigint(b.bitLength()).toString(2);
var extra=bigint(b.bitLength()).add(size.length).mod(512)
//console.log(512-extra);
var padding="1";
for(var i=0;i<512-extra-1;i++){
  padding+="0";
}
//console.log(str.length)

var readyForchunks=b.toString(2)+padding+size;
//console.log(readyForchunks.length)

var iterations=readyForchunks.length/512;
//console.log(iterations)

const key =[
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 ];

// initial hash value [§5.3.3]
const H =[
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19 ];

function ROTR(n, x) {
      return (x >>> n) | (x << (32-n));
  }


for(var i=0;i<readyForchunks.length;i++){
const currentchunk=readyForchunks.substring(i*512,i*512+512);
//console.log(currentchunk);
const messagequeue=new Array(64);

for(var j=0;j<16;j++){
  messagequeue[j]=bigint(bigint(currentchunk.substring(j*32,j*32+16),2).toString(10));
  //console.log(messagequeue[j])
}

for(var j=16;j<64;j++){
  const s0=ROTR(messagequeue[j-15],7) ^ ROTR(messagequeue[j-15],18) ^ (messagequeue[j-15]>>3)
  const s1=ROTR(messagequeue[j-2],17) ^ ROTR(messagequeue[j-2],19) ^ (messagequeue[j-2]>>10)
  messagequeue[j]=(messagequeue[j-16]+s0+messagequeue[j-7]+s1) >>>0;
  //console.log(messagequeue[j]);
}

var a=H[0];
var b=H[1];
var c=H[2];
var d=H[3];
var e=H[4];
var f=H[5];
var g=H[6];
var h=H[7];

for(var j=0;j<64;j++){

const s1=ROTR(e,6)^ROTR(e,11)^ROTR(e,25)
const choise= (e&f)^(~e&g)
const temp1=(h+s1+choise+key[j]+messagequeue[j])>>>0

const s0=ROTR(a,2)^ROTR(a,13)^ROTR(a,22)
const majority= (a&b)^(a&c)^(b&c)
const temp2=(s0+majority)>>>0

h = g
g = f
f = e
e = (d + temp1)>>>0
d = c
c = b
b = a
a = (temp1 + temp2)>>>0
}
  H[0]=(H[0]+a)>>>0;
  H[1]=(H[1]+b)>>>0;
  H[2]=(H[2]+c)>>>0;
  H[3]=(H[3]+d)>>>0;
  H[4]=(H[4]+e)>>>0;
  H[5]=(H[5]+f)>>>0;
  H[6]=(H[6]+g)>>>0;
  H[7]=(H[7]+h)>>>0;

}

var finalHash=""
for(var j=0;j<8;j++){
   finalHash+=H[j].toString(16);
}
return finalHash;
}
}
module.exports=myhash;
