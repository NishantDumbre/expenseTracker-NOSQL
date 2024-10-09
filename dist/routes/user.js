"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
router.post('/check-signup-creds', user_1.checkUserExists);
router.post('/signup', user_1.createUser);
router.post('/login', user_1.login);
router.post('/forgot-password', user_1.sendForgotPwdEmail);
router.get('/reset-password/:id', user_1.newPasswordURL);
router.get('/update-password/:resetpasswordid', user_1.updatePassword);
router.get('/check-premium', authenticate_1.default, user_1.getCheckPremium);
exports.default = router;
