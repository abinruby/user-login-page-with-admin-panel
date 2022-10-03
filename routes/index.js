var express = require('express');
var router = express.Router();
var db =require('../config/connection')
var collection=require('../config/collection')
const {ObjectId}=require("bson")
const userHelper=require('../helpers/user-helper');
const { response } = require('express');
const { doSignUp } = require('../helpers/user-helper');





     var loginError = false
     var loginStatus = false         
//login user
          
router.get('/',(req,res)=>{
    if(req.session.user){
        console.log('back '+req.session.user);
        res.redirect("/home")
        
    }else if(req.session.admin){
        console.log('/'+req.session.user);
        res.redirect('/adminHome')
    }
    else{
        res.render('index.hbs')
    }

})

       
router.post("/",(req,res)=>{
    userHelper.doLogin(req.body).then((response)=>{
        
        if(response.status){
            req.session.user = response.user.email
            console.log('USER LOG SESSION-'+ req.session.user);
            res.redirect('/home')
        }else{
            res.render('index.hbs',{loginError:'wrong password'})
            console.log('invalid');
        }
    })
})


            //home route

            router.get('/home',(req,res)=>{
                if(req.session.user){
                res.render('home.hbs') 
            }else{
                res.render("index.hbs")
            }
        })


            //sign up route
            router.get('/signup',(req,res)=>{
        if(req.session.user){
            res.redirect('/home')
        }
        else if(req.session.admin){
            res.redirect('/adminHome')
        }else{
                res.render('signup.hbs')
        }
            })

            router.post('/signup',async(req,res)=>{
                let check=await db.get().collection(collection.USER_COLLECTION).findOne({email:req.body.email})
                if(check){
                    res.send('email already registered')

                }else{
                    userHelper.doSignUp(req.body)
                    res.redirect('/')
                }
            })

//admin route

router.get('/admin',(req,res)=>{
    if(req.session.admin){
        res.redirect('/adminHome')
    }else if(req.session.user){
        res.redirect('/home')
    }else{
    res.render('adminLog.hbs')
    }
})
router.post('/admin',(req,res)=>{
    console.log(req.body);
    userHelper.doAdmin(req.body).then((response)=>{
        if(response.status){
            req.session.admin=response.admin.email
            console.log('ADMIN SESSION '+req.session.admin);
            res.redirect('/adminHome')
        }else{
            res.redirect('/admin')
        }
    })
})

//admin home page

router.get('/adminHome',(req,res)=>{
    let user=db.get().collection(collection.USER_COLLECTION).find().toArray((err,data)=>{
        if(err){
            throw err
        }else{
            if(req.session.admin){
                res.render('adminHome.hbs',{data:data})
            }else{
                res.redirect('/adminLog')
            }
        
           
        }

    })
  
})


//add user

router.get('/add_user',(req,res)=>{
  if(req.session.admin){
    res.render('addUser.hbs',)
  }else{
    req.redirect('/admin')
  }
    
})

router.post('/add_user',(req,res)=>{
    userHelper.doAddUser(req.body)
    res.redirect('/adminHome')
    

})

//update Router
router.get('/updateUser',async(req,res)=>{
    if(req.session.admin){
    let id=new ObjectId(req.query.id)
    let update=await db.get().collection(collection.USER_COLLECTION).findOne({_id:id})
    
    res.render('updateUser.hbs',{data:update})
    }else{
        req.redirect('/admin')
      }
})
router.post('/updateUser',(req,res)=>{
    let id=new ObjectId(req.query.id)
    console.log(req.body)
    db.get().collection(collection.USER_COLLECTION).updateOne({_id:id},{$set:{name:req.body.name,email:req.body.email,password:req.body.password}}).then(()=>{
        res.redirect("/adminHome")
    }).catch((err)=>{
        console.log("err")
    })
})


//delete
router.get('/delete',(req,res)=>{
    let id=new ObjectId(req.query.id)
    userHelper.deleteProduct(id).then((response)=>{
        if(response){
     res.redirect('/adminHome')   
    }
    })
})


//// test 

router.get("/adminLog",(req,res)=>{
    res.redirect("/")
})






//logout

                    router.get('/logout',(req,res)=>{
                        
                        
                        req.session.destroy()
                    
                        res.render('index.hbs',{loginStatus:'logout successfully'})
                        
                    })


module.exports = router;





