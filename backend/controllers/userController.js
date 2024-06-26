const Users = require('../models/userModel')
const ForgotPasswordRequests = require('../models/forgotPasswordrRequestsMode')
const Sequelize = require('../utils/database');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const Sib = require('sib-api-v3-sdk');




function generateToken(id, name) {
    return jwt.sign({ userId: id, name }, process.env.TOKEN_SECRET_KEY)
}



exports.postCreateUsers = (req, res, next) => {
    try {
        const saltrounds = 10
        bcrypt.hash(req.body.password, saltrounds, async (err, hash) => {
            console.log(err, 'this is erropr')
            const result = await Users.create({
                name: req.body.name,
                username: req.body.username,
                password: hash,
                email: req.body.email,
                isPremium: false
            })
            const user = new Users(uuidv4(), req.body.name, req.body.username, hash, req.body.email)
            await user.save()
            console.log('User added')
            res.json(result.dataValues)
        })
    }
    catch (error) {
        res.status(500).json(error)
    }
}



exports.getSearchUsers = async (req, res, next) => {
    try {
        let findUsername = req.params.username
        let found = false
        const result = await Users.findAll({ where: { username: findUsername } })
        if (result.length > 0) {
            found = true
        }
        res.json(found)
    }
    catch (error) {
        res.status(500).json(error)
    }

}



exports.postLogin = async (req, res, next) => {
    try {
        let { username, password } = req.body
        const result = await Users.findAll({ where: { username } })
        if (!result.length) {
            res.status(404).json({ error: 'userNotFound' })
        }
        else {
            let fetchedPassword = result[0].dataValues.password
            bcrypt.compare(password, fetchedPassword, (err, bcryptResult) => {
                if (err) {
                    throw new Error('Something went wrong')
                }
                if (bcryptResult === false) {
                    res.status(401).json({ error: 'passwordWrong' })
                }
                else {
                    res.status(200).json({ passwordMatch: true, token: generateToken(result[0].dataValues.id, result[0].dataValues.name), id: result[0].dataValues.id })
                }
            })
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}



exports.getCheckPremium = async (req, res, next) => {
    try {
        let user = await Users.findAll({ where: { id: req.user.dataValues.id } })
        res.json({ isPremium: user[0].dataValues.isPremium })
    }
    catch (error) {
        res.status(400).json('Something went wrong')
    }
}



exports.postForgotPassword = async (req, res, next) => {
    try {
        const t = await Sequelize.transaction()
        const { email } = req.body;

        const user = await Users.findAll({ where: { email } })
        const request = await ForgotPasswordRequests.create({
            id: uuidv4(),
            userId: user[0].id
        }, { transaction: t })

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
            textContent: `Following is the link to reset password: http://localhost:8080/password/reset-password/${request.id}`
        });
        t.commit()
        res.json('success');
    } catch (error) {
        t.rollback()
        console.error('Error sending email:', error);
        res.status(400).json('Something went wrong');
    }
};



exports.getResetPassword = async (req, res, next) => {
    try {
        const t = await Sequelize.transaction()
        const id = req.params.id

        let result = await ForgotPasswordRequests.findAll({ where: { id, isActive: true } })
        if (!result.length) {
            throw new Error('Request expired')
        }
        await ForgotPasswordRequests.update({
            isActive: false
        }, {
            where: { id },
            transaction: t
        })
        t.commit()
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
        const t = await Sequelize.transaction()
        const request = await ForgotPasswordRequests.findAll({ where: { id: resetpasswordid } })
        const user = await Users.findAll({ where: { id: request[0].userId } })
        const saltrounds = 10
        bcrypt.hash(newpassword, saltrounds, async (err, hash) => {
            console.log(err, 'this is erropr')
            await Users.update({
                password: hash
            }, {
                where: { id: request[0].userId },
                transaction: t
            })
            t.commit()
            res.status(201).json({ message: 'Successfuly update the new password' })
        })
    }
    catch (error) {
        res.status(400).json({ message: 'Could not change password' })
    }
}



