var assert=require('chai').assert;
var helper=require('./helper');
const { expect } = require('chai');
describe('test the lock in dynamodb',(done)=>{

it('create the connection',async()=>{
   var res= await helper.init("http://54.82.132.199:8000", "dynamodb")
   expect(res).true

})

it('create the lock',async()=>{
    var res= await helper.aquire_lock("newkey", (Date.now()+10000)/1000,10)
    expect(res).true
    
 
 }).timeout(20000)

 it('release the lock',async()=>{
    var res= await helper.release_lock("newkey")
    expect(res).true
    
 
 }).timeout(20000)


})