const Orders = require('../models/ordersModel')
const Razorpay = require('razorpay')

exports.getPurchasePremium = async (req, res, next) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEYID,
            key_secret: process.env.RAZORPAY_KEYSECRET
        })

        const amount = 2500
        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err))
            }
            await req.user.createOrder({ orderId: order.id, status: 'PENDING' })
            return res.status(201).json({ order, key_id: rzp.key_id })
        })
    }
    catch (error) {
        res.status(401).JSON({ message: 'Something went wrong', error })
    }
}


exports.postUpdateTransactionStatus = async (req, res, next) => {
    try {
        const { orderId, paymentId, success } = req.body
        console.log(orderId, paymentId)
        let order = await Orders.findOne({ where: { orderId } })
        if (success == true) {
            let promise1 = order.update({ paymentId: paymentId, status: 'SUCCESSFUL' })
            let promise2 = req.user.update({ isPremium: true })
            
            Promise.all([promise1,promise2])
                .then(()=>{
                    return res.status(200).json({ success: true, message: 'Transaction successful' })
                })
                .catch((error)=>{
                    throw new Error(error)
                })
        }
        else {
            await order.update({ paymentId: paymentId, status: 'FAILED' })
            return res.status(400).json({ success: false, message: 'Transaction failed' })
        }

    }
    catch (error) {
        res.status(400).json({ success: false, message: 'Transaction failed', error })
    }
}