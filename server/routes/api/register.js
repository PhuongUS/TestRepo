const UserDB = require('../../models/User');
const UserSession = require('../../models/UserSession');
const bcrypt= require('bcrypt');

module.exports = (app) => {
    /*
    * Sign up
    */
    app.post('/api/account/signup', (req, res, next) => {
        const { body } = req;
        console.log(body)
        const {
            password,
            name,
            licensePlate,
        } = body;
        let {
            email
        } = body;
        
        if (!name) {
            return res.send({
                success: false,
                message: 'Error: Name cannot be blank.'
            });
        }
        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank.'
            });
        }
        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank.'
            });
        }
        if (!licensePlate) {
            return res.send({
                success: false,
                message: 'Error: LicensePlate cannot be blank.'
            });
        }
        email = email.toLowerCase();
        email = email.trim();
        console.log(email)
        // Steps:
        // 1. Verify email doesn't exist
        // 2. Save
        UserDB.find({
        email: email,
        
        }, (err, previousUsers) => {
        if (err) {
            console.log('here')

            return res.send({
            success: false,
            message: 'Error: Server error',
            });
            
        } else if (previousUsers.length > 0) {
            console.log('here')

            return res.send({
            success: false,
            message: 'Error: Account already exist.'
            });
        }
        // Save the new user
        const newUser = new UserDB();
        newUser.email = email;
        newUser.name=name;
        newUser.licensePlate=licensePlate;
        //newUser.password=password;
        newUser.password = newUser.generateHash(password);
        //newUser.password=bcrypt.hashSync(password, 10);;
        newUser.save((err, user) => {
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
            message: 'Signed up'
            });
        });
        });

    });
   
    
}