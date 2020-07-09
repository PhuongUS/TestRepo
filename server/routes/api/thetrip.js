const TheTrip = require('../../models/TheTrip');
const UserSession = require('../../models/UserSession');
const bcrypt= require('bcrypt');

module.exports = (app) => {
    /*
    * Sign up
    */
    app.post('/api/insert_the_trip', (req, res, next) => {
        const { body } = req;
        console.log(body)
        const {
            userID,
            phoneCustomer,
            money,
        } = body;
        
        if (!userID) {
            return res.send({
                success: false,
                message: 'Error: userID cannot be blank.'
            });
        }
        if (!phoneCustomer) {
            return res.send({
                success: false,
                message: 'Error: Phonenumber cannot be blank.'
            });
        }
        if (!money) {
            return res.send({
                success: false,
                message: 'Error: Money cannot be blank.'
            });
        }
        const newTrip = new TheTrip();
        newTrip.userID=userID;
        newTrip.phoneCustomer=phoneCustomer;
        newTrip.money=money;
        //newUser.password=password;
        newTrip.save((err, user) => {
            if (err) {
            return res.send({
                success: false,
                user:user,
                message: 'Error: Server error'
            });
            }
            //console.log(user)
            return res.send({
            success: true,
            message: 'The trip success'
            });
        });

    });
   
    
}