# description
 
 This module support for redis and dynamodb database. It is use to lock one data using  `aquire_lock()` function and release the lock by `release_lock()` function. it is support the timeout for the lock to both database. The parameter of the timeout it different  for redis use time in seconds and dynamodb use timestamp in seconds. when you call the init method pass the Database url and the Database name 

#  Redis Lock

 ```Javascript
 
var db_lock= require('<module name>')
 async function test (){
    let dbconection = await db_lock.init("< redis connection url >", "redis")

    await dbconection.aquire_lock("<KEY>","<time out in seconds>","<KEY VAlUE>");
    await dbconection.release_lock("<KEY>")
 }

 ```


# Dynamodb lock

BY default this module create a table.if you want to use specify customs table create the enviroment variable   **LOCK_TABLE** . In the customs table only have the primary key which is LockName and  enable the Time to live attribute on ttl [refer this link](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/time-to-live-ttl-how-to.html)




```javascript

 var db_lock= require('<module name>')
 async function test (){
    let dbconection = await db_lock.init("<db connection url>", "dynamodb")

    await dbconection.aquire_lock("<KEY>","<time out in timestamp in seconds>","<KEY VAlUE>");
    await dbconection.release_lock("<KEY>")


 }
 ```




