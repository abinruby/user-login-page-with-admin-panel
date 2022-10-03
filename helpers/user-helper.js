 var db = require('../config/connection')
 var collection = require('../config/collection')

 

module.exports = {
    doSignUp : (userData)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.insertedId)
            })
      
        })
    },
    doLogin : (userData)=>{
        return new Promise(async(resolve,reject)=>{
            loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email : userData.email })
                
              
           
            if(user)
                {
               

                    if(user.password == userData.password){
                    
                            response.user = user
                            response.status = true
                            resolve(response)
                        }
                        else{
                            
                            resolve({status:false})
                        }
                   

                }
               
                resolve({status:false})
        })
    },




    doAdmin : (adminData)=>{
        return new Promise(async(resolve,reject)=>{
            loginStatus = false;
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({email : adminData.email })
                
              
           
            if(admin)
                {
               

                    if(admin.password == adminData.password){

                        
                            response.admin = admin
                            response.status = true
                            resolve(response)
                        }
                    
                        else{
                            
                            resolve({status:false})
                        }
                   

                }
                
                resolve({status:false})
        })
    },
    doAddUser :(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let addUser=await db.get().collection(collection.USER_COLLECTION).insertOne(userData)
        })


    },
    deleteProduct : (userID)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id :userID}).then((responce)=>{
                resolve(responce)
                console.log(responce);
            })
      
        })
    }
    

}
