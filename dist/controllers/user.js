"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.newPasswordURL = exports.sendForgotPwdEmail = exports.getCheckPremium = exports.login = exports.checkUserExists = exports.createUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const forgot_pwd_req_1 = __importDefault(require("../models/forgot-pwd-req"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sib_api_v3_sdk_1 = __importDefault(require("sib-api-v3-sdk"));
function generateToken(id, name) {
    return jsonwebtoken_1.default.sign({ user_id: id, name }, process.env.TOKEN_SECRET_KEY);
}
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email, name } = req.body;
        const saltrounds = parseInt(process.env.SALT_ROUNDS, 10); // Ensure to parse as number
        const hash = yield bcrypt_1.default.hash(password, saltrounds);
        const instance = new user_1.default({
            name,
            username,
            password: hash,
            email,
            premium: false,
        });
        const user = yield instance.save();
        res.json(user);
    }
    catch (error) {
        res.status(502).json(error);
    }
});
exports.createUser = createUser;
const checkUserExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email } = req.body;
        const foundEmail = yield user_1.default.findOne({ email });
        if (foundEmail) {
            return res.status(200).json({ success: false, message: "Email already registered" });
        }
        const foundUsername = yield user_1.default.findOne({ username });
        if (foundUsername) {
            return res.status(200).json({ success: false, message: "Username already registered" });
        }
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.checkUserExists = checkUserExists;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const result = yield user_1.default.findOne({ username });
        if (!result) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const fetchedPassword = result.password;
        const bcryptResult = yield bcrypt_1.default.compare(password, fetchedPassword);
        if (!bcryptResult) {
            return res.status(401).json({ success: false, message: "Entered password is wrong" });
        }
        res.status(200).json({
            success: true,
            token: generateToken(result.id, result.name),
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.login = login;
const getCheckPremium = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        const user = yield user_1.default.findById(_id);
        res.json({ premium: user === null || user === void 0 ? void 0 : user.premium });
    }
    catch (error) {
        res.status(400).json("Something went wrong");
    }
});
exports.getCheckPremium = getCheckPremium;
const sendForgotPwdEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: false, message: "Email not found" });
    }
    const instance = new forgot_pwd_req_1.default({
        user_id: user._id,
        is_active: true,
    });
    const request = yield instance.save();
    const client = sib_api_v3_sdk_1.default.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SENDINBLUE_KEY;
    const tranEmailApi = new sib_api_v3_sdk_1.default.TransactionalEmailsApi();
    const sender = { email: "nishant.dumbre@gmail.com" };
    const receiver = [{ email }];
    try {
        yield tranEmailApi.sendTransacEmail({
            sender,
            to: receiver,
            subject: "Forgot password Sharpener Expense Tracker",
            textContent: `Following is the link to reset password: http://localhost:8080/user/reset-password/${request._id.toString()}`,
        });
        res.status(200).json({ success: true, message: "Reset link sent successfully" });
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(400).json({ success: false, message: "Something went wrong" });
    }
});
exports.sendForgotPwdEmail = sendForgotPwdEmail;
const newPasswordURL = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield forgot_pwd_req_1.default.findOneAndUpdate({
            _id: id,
            is_active: true,
        }, {
            is_active: false,
        });
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
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Invalid request" });
    }
});
exports.newPasswordURL = newPasswordURL;
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newpassword } = req.query; // Type assertion for query
        const { resetpasswordid } = req.params;
        const request = yield forgot_pwd_req_1.default.findById(resetpasswordid);
        const user = yield user_1.default.findById(request === null || request === void 0 ? void 0 : request.user_id);
        const saltrounds = Number(process.env.SALT_ROUNDS);
        const hash = yield bcrypt_1.default.hash(newpassword, saltrounds);
        yield user_1.default.findByIdAndUpdate(user._id, { password: hash }, { new: true });
        res.status(201).json({
            success: true,
            message: "Successfully updated the new password",
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Could not change password" });
    }
});
exports.updatePassword = updatePassword;
