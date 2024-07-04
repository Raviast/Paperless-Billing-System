var login_check= function(body){
  return new Promise(function (resolve, reject){
     if(body.userId=="Root" && body.pwd=='root'){
      resolve("root");
      }

      else{
        reject();
      }
    });
}
module.exports.login_check=login_check;
