const Users = require('../models/userModel')
const ForgotPwdReq = require('../models/forgot-pwd-req')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Sib = require('sib-api-v3-sdk');




function generateToken(id, name) {
    return jwt.sign({ userId: id, name }, process.env.TOKEN_SECRET_KEY)
}



exports.postCreateUsers = (req, res, next) => {
    console.log(true)
    try {
        const saltrounds = 10
        bcrypt.hash(req.body.password, saltrounds, async (err, hash) => {
            const result = new Users(req.body.name, req.body.username, hash, req.body.email)
            await result.saveUser()
            console.log('User added')
            res.json(result)
        })
    }
    catch (error) {
        res.status(500).json(error)
    }
}



exports.getSearchUsers = async (req, res, next) => {
    try {
        let findUsername = req.params.username

        const user = await Users.findUserByUsername(findUsername)
        res.json(user)
    }
    catch (error) {
        res.status(500).json(error)
    }

}



exports.postLogin = async (req, res, next) => {
    try {
        let { username, password } = req.body
        const user = await Users.findUserByUsername(username)
        if (!user.length) {
            res.status(404).json({ error: 'userNotFound' })
        }
        else {
            let fetchedPassword = user[0].password
            bcrypt.compare(password, fetchedPassword, (err, bcryptResult) => {
                if (err) {
                    throw new Error('Something went wrong')
                }
                if (bcryptResult === false) {
                    res.status(401).json({ error: 'passwordWrong' })
                }
                else {
                    res.status(200).json({ passwordMatch: true, token: generateToken(user[0].id, user[0].name), id: user[0].id })
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



exports.postForgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await Users.findUserByEmail(email)
        const userId = user[0]._id.toString()
        const forgotPwdReq = new ForgotPwdReq(userId)
        const saveFPR = await forgotPwdReq.saveForgotPwdReq()
        const FPRid = saveFPR.insertedId.toString()

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SENDINBLUE_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = { email: 'nishant.dumbre@gmail.com' };
        const receiver = [{ email }];
        await tranEmailApi.sendTransacEmail({
            sender,
            to: receiver,
            subject: 'Forgot password Sharpener Expense Tracker',
            textContent: `Following is the link to reset password: http://localhost:8080/password/reset-password/${FPRid}`
        });
        res.json('success');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(400).json('Something went wrong');
    }
};



exports.getResetPassword = async (req, res, next) => {
    try {
        const id = req.params.id

        const result = await ForgotPwdReq.findForgotPwdReqActive(id)
        if (!result.length) {
            throw new Error('Request expired')
        }
        await ForgotPwdReq.updateForgotPwdReq(id)

        res.status(200).send(`<html>
                                        <script>
                                            function formsubmitted(e){
                                                e.preventDefault();
                                                console.log('called')
                                            }
                                        </script>
    
                                        <form action="/password/updatepassword/${id}" method="get">
                                            <label for="newpassword">Enter New password</label>
                                            <input name="newpassword" type="password" required></input>
                                            <button>reset password</button>
                                        </form>
                                    </html>`
        )
        res.end()
    }
    catch (error) {
        res.status(400).json({ message: 'Request expired' })
    }
}



exports.updatePassword = async (req, res, next) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        
        const request = await ForgotPwdReq.findForgotPwdReq(resetpasswordid)
        console.log(request)
        const saltrounds = 10
        bcrypt.hash(newpassword, saltrounds, async (err, hash) => {
            console.log(err, 'this is erropr')
            await Users.updatePassword(request[0].userId, hash)
            res.status(201).json({ message: 'Successfuly update the new password' })
        })
    }
    catch (error) {
        res.status(400).json({ message: 'Could not change password' })
    }
}



