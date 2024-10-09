import { Request, Response, NextFunction } from "express";
import Order from '../models/order'
import Razorpay from 'razorpay'

interface AuthenticatedRequest extends Request {
    user?: any
  }

export const getPurchasePremium = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEYID as string,
            key_secret: process.env.RAZORPAY_KEYSECRET as string
        })

        const amount = 2500
        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err))
            }
            const instance = new Order({
                order_id: order.id,
                status: 'PENDING',
                user_id: req.user!._id
            })
            const newOrder = await instance.save()
            return res.status(201).json({ order, key_id: rzp.key_id })
        })
    }
    catch (error) {
        res.status(401).json({ message: 'Something went wrong', error })
    }
}


export const postUpdateTransactionStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const { order_id, payment_id, success } = req.body
        console.log(order_id, payment_id)
        console.log(req.body)
        const order = await Order.findOne({ order_id })
        if (success === true) {
            const promise1 = order!.updateOne({ $set: { payment_id: payment_id, status: 'SUCCESSFUL' } })
            const promise2 = req.user.updateOne({ $set: { premium: true } })

            Promise.all([promise1, promise2])
                .then(() => {
                    return res.status(200).json({ success: true, message: 'Transaction successful' })
                })
                .catch((error) => {
                    throw new Error(error)
                })
        }
        else {
            await order!.updateOne({ payment_id: payment_id, status: 'FAILED' })
            return res.status(400).json({ success: false, message: 'Transaction failed' })
        }

    }
    catch (error) {
        res.status(400).json({ success: false, message: 'Transaction failed', error })
    }
}