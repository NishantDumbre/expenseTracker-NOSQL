const User = require('../models/user')
const ForgotPwdReq = require('../models/forgot-pwd-req')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Sib = require('sib-api-v3-sdk');




function generateToken(id, name) {
    return jwt.sign({ user_id: id, name }, process.env.TOKEN_SECRET_KEY)
}



exports.createUser = (req, res, next) => {
    try {
        const {username, password, email, name} = req.body
        const saltrounds = 10
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            if (err) {
                throw new Error('Something went wrong')
            }
            const newUser = new User({
                name,
                username,
                password: hash,
                email,
                premium: false
            })
        
            const result = await newUser.save()
            res.json(result)
        })
    }
    catch (error) {
        res.status(502).json(error)
    }
}



exports.checkUserExists = async (req, res, next) => {
    try {
        const {username, email} = req.body

        const foundEmail = await User.findOne({email})
        if(foundEmail){
            return res.status(200).json({success:false, message:'Email already registered'})
        }
        else{
            const foundUsername = await User.findOne({username})
            if(foundUsername){
                return res.status(200).json({success:false, message:'Username already registered'})
            }
        }
        
        res.status(200).json({success:true})
    }
    catch (error) {
        res.status(500).json(error)
    }

}



exports.postLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const result = await User.findOne({username})
        if (!result) {
            return res.status(404).json({ success: false, message:'User not found' })
        }
        else {
            const fetchedPassword = result.password
            bcrypt.compare(password, fetchedPassword, (err, bcryptResult) => {
                if (err) {
                    throw new Error('Something went wrong')
                }
                if (bcryptResult === false) {
                    res.status(401).json({ success: false, message:'Entered password is wrong' })
                }
                else {
                    res.status(200).json({ success: true, token: generateToken(result.id, result.name)})
                }
            })
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}



// exports.getCheckPremium = async (req, res, next) => {
//     try {
//         let user = await Users.findAll({ where: { id: req.user.dataValues.id } })
//         res.json({ isPremium: user[0].dataValues.isPremium })
//     }
//     catch (error) {
//         res.status(400).json('Something went wrong')
//     }
// }



// exports.postForgotPassword = async (req, res, next) => {
//     try {
//         const t = await Sequelize.transaction()
//         const { email } = req.body;

//         const user = await Users.findAll({ where: { email } })
//         const request = await ForgotPwdReq.create({
//             //id: uuidv4(),
//             userId: user[0].id
//         }, { transaction: t })

//         const client = Sib.ApiClient.instance;
//         const apiKey = client.authentications['api-key'];
//         apiKey.apiKey = process.env.SENDINBLUE_KEY;
//         const tranEmailApi = new Sib.TransactionalEmailsApi();
//         const sender = { email: 'nishant.dumbre@gmail.com' };
//         const receiver = [{ email }];
//         await tranEmailApi.sendTransacEmail({
//             sender,
//             to: receiver,
//             subject: 'Forgot password Sharpener Expense Tracker',
//             textContent: `Following is the link to reset password: http://localhost:8080/password/reset-password/${request.id}`
//         });
//         t.commit()
//         res.json('success');
//     } catch (error) {
//         t.rollback()
//         console.error('Error sending email:', error);
//         res.status(400).json('Something went wrong');
//     }
// };



// exports.getResetPassword = async (req, res, next) => {
//     try {
//         const t = await Sequelize.transaction()
//         const id = req.params.id

//         let result = await ForgotPwdReq.findAll({ where: { id, isActive: true } })
//         if (!result.length) {
//             throw new Error('Request expired')
//         }
//         await ForgotPwdReq.update({
//             isActive: false
//         }, {
//             where: { id },
//             transaction: t
//         })
//         t.commit()
//         res.status(200).send(`<html>
//                                         <script>
//                                             function formsubmitted(e){
//                                                 e.preventDefault();
//                                                 console.log('called')
//                                             }
//                                         </script>
    
//                                         <form action="/password/updatepassword/${id}" method="get">
//                                             <label for="newpassword">Enter New password</label>
//                                             <input name="newpassword" type="password" required></input>
//                                             <button>reset password</button>
//                                         </form>
//                                     </html>`
//         )
//         res.end()
//     }
//     catch (error) {
//         res.status(400).json({ message: 'Request expired' })
//     }
// }



// exports.updatePassword = async (req, res, next) => {
//     try {
//         const { newpassword } = req.query;
//         const { resetpasswordid } = req.params;
//         const t = await Sequelize.transaction()
//         const request = await ForgotPwdReq.findAll({ where: { id: resetpasswordid } })
//         const user = await Users.findAll({ where: { id: request[0].userId } })
//         const saltrounds = 10
//         bcrypt.hash(newpassword, saltrounds, async (err, hash) => {
//             console.log(err, 'this is erropr')
//             await Users.update({
//                 password: hash
//             }, {
//                 where: { id: request[0].userId },
//                 transaction: t
//             })
//             t.commit()
//             res.status(201).json({ message: 'Successfuly update the new password' })
//         })
//     }
//     catch (error) {
//         res.status(400).json({ message: 'Could not change password' })
//     }
// }



