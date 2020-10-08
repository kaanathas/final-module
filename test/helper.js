var Db=require('../index')


var dbconnection;


module.exports.init=async(url,db)=>{
    dbconnection = await Db.init(url, db)
    return true
}


module.exports.aquire_lock=async(key,ttl,value)=>{
   let lock= await dbconnection.aquire_lock(key,ttl,value);
    return lock
}


module.exports.release_lock=async(key)=>{
     let a=await dbconnection.release_lock(key)
     if(a){
        console.log("release finish"+ a)
     }
     
     return true
 }
