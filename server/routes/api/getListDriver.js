const UserDB = require('../../models/User');
const UserSession = require('../../models/UserSession');
const bcrypt= require('bcrypt');

module.exports = (app) => {
    app.get('/api/get_list_driver', (req, res, next) => {
        UserDB.find({}, function(err, users) {
            if(err){
                console.log('heere')
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                })
            }
            res.send(users)
            // var userMap = {};
            // users.forEach(function(user) {
            //     userMap[user._id] = user;
            // });
            // res.send(userMap);  
          });
    });
   
    
}