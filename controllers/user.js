const User = require("../models/user");
const ForgotPwdReq = require("../models/forgot-pwd-req");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sib = require("sib-api-v3-sdk");
const VerifyEmailReq = require("../models/verify-email-req");

function generateToken(id, name) {
    return jwt.sign({ user_id: id, name }, process.env.TOKEN_SECRET_KEY);
}

exports.createUser = async (req, res, next) => {
    try {
        const { password, email } = req.body;
        const saltrounds = parseInt(process.env.SALT_ROUNDS);

        bcrypt.hash(password, saltrounds, async (err, hash) => {
            if (err) {
                res.status(502).json({ message: "Internal server error", err });
            }
            try {
                const instance = new User({
                    password: hash,
                    email,
                    premium: false,
                });

                await instance.save();
                res
                    .status(200)
                    .json({ success: true, message: "Account created successfully!" });
            } catch (error) {
                console.log(error);
                res.status(409).json({ message: "Email already exists", error });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(502).json({ message: "Internal server error", error });
    }
};

// exports.checkUserExists = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     const foundEmail = await User.findOne({ email });
//     if (foundEmail) {
//       return res
//         .status(200)
//         .json({ success: false, message: "Email already registered" });
//     }

//     res.status(200).json({ success: true });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await User.findOne({ email });
        if (!result) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        } else {
            const fetchedPassword = result.password;
            bcrypt.compare(password, fetchedPassword, (err, bcryptResult) => {
                if (err) {
                    throw new Error("Something went wrong");
                }
                if (bcryptResult === false) {
                    res
                        .status(401)
                        .json({ success: false, message: "Entered password is wrong" });
                } else {
                    res.status(200).json({
                        success: true,
                        token: generateToken(result.id, result.name),
                    });
                }
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getCheckPremium = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const user = await User.findById(_id);
        res.json({ premium: user.premium });
    } catch (error) {
        res.status(400).json("Something went wrong");
    }
};

exports.sendForgotPwdEmail = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: false, message: "Email not found" });
    }

    const instance = new ForgotPwdReq({
        user_id: user._id,
        is_active: true,
    });
    const request = await instance.save();

    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SENDINBLUE_KEY;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = { email: "nishant.dumbre@gmail.com" };
    const receiver = [{ email }];
    try {
        await tranEmailApi.sendTransacEmail({
            sender,
            to: receiver,
            subject: "Forgot password Sharpener Expense Tracker",
            textContent: `Following is the link to reset password: http://localhost:8080/user/reset-password/${request._id.toString()}`,
        });
        res
            .status(200)
            .json({ success: true, message: "Reset link sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(400).json({ success: false, message: "Something went wrong" });
    }
};

exports.newPasswordURL = async (req, res, next) => {
    try {
        const id = req.params.id;

        const result = await ForgotPwdReq.findOneAndUpdate(
            {
                _id: id,
                is_active: true,
            },
            {
                is_active: false,
            }
        );

        if (!result) {
            throw new Error("Invalid request");
        }

        res.status(200).send(`<html>
                                        <script>
                                            function formsubmitted(e){
                                                e.preventDefault();
                                                console.log('called')
                                            }
                                        </script>
    
                                        <form action="/user/update-password/${id}" method="get">
                                            <label for="newpassword">Enter New password</label>
                                            <input name="newpassword" type="password" required></input>
                                            <button>reset password</button>
                                        </form>
                                    </html>`);
        res.end();
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid request" });
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;

        const request = await ForgotPwdReq.findById(resetpasswordid);
        const user = await User.findById(request.user_id);
        const saltrounds = Number(process.env.SALT_ROUNDS);

        bcrypt.hash(newpassword, saltrounds, async (err, hash) => {
            if (err) {
                console.log(err, "this is erropr");
                throw new Error("Could not change password");
            }

            await User.findByIdAndUpdate(
                user._id,
                {
                    password: hash,
                },
                { new: true }
            );
            res.status(201).json({
                success: true,
                message: "Successfuly update the new password",
            });
        });
    } catch (error) {
        res
            .status(400)
            .json({ success: false, message: "Could not change password" });
    }
};

exports.updateUserDetails = async (req, res, next) => {
    const { name, profileUrl } = req.body;
    console.log(req.user)
    const { _id } = req.user;
    try {
        const user = await User.findById(_id);
        user.name = name;
        user.profileUrl = profileUrl;
        await user.save();
        console.log('success')
        res.status(200).json({ success: true, message: "Updated user successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Something went wrong' })
    }
};


exports.verifyEmail = async (req, res, next) => {
    const { email } = req.user
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ success: false, message: "Email not found" });
    }

    const instance = new VerifyEmailReq({
        user_id: user._id,
        is_active: true,
    });

    const request = await instance.save();

    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SENDINBLUE_KEY;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = { email: "nishant.dumbre@gmail.com" };
    const receiver = [{ email }];
    try {
        await tranEmailApi.sendTransacEmail({
            sender,
            to: receiver,
            subject: "Forgot password Sharpener Expense Tracker",
            textContent: `Following is the link to reset password: http://localhost:8080/user/verify-user-email/${request._id.toString()}`,
        });
        res
            .status(200)
            .json({ success: true, message: "Reset link sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(400).json({ success: false, message: "Something went wrong" });
    }
}

exports.verifyUserEmail = async (req, res, next) => {
    const { id } = req.params

    try {
        const update = await VerifyEmailReq.findByIdAndUpdate({ _id: id, is_active: true }, { is_active: false }, { new: true })
        const user = await User.findByIdAndUpdate({ _id: update.user_id }, { verified: true })
        res.status(302).redirect(`http://localhost:3000/verify-details?verified=true&premium=${user.premium}`);
    } catch (error) {

    }
}


exports.getUserData = async (req, res, next) => {
    const { name, email, profileUrl, verified, premium } = req.user
    res.status(200).json({ name, email, profileUrl, verified, premium })
}