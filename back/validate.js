const actions = require('./actions')
module.exports.checkAuth = function checkAuth(req,res,next){
    if(req.session.user){
     //     console.log("Logged")
     //     console.log(req.session)
         next()
    }
    else{
     //     console.log("not logged")
     //     console.log(req.session)
         res.json({err:"not logged"})
    }
}
module.exports.check = function check (req,res,next){
    const {login,passwordd} = req.body
    actions.getUser({login,passwordd}).then(data =>{
         if(data.rows.length === 0){
              res.json({err:"no data"})
         }
         else{
              sess = req.session
              sess.user = login
              next()
         }
         
    })
}