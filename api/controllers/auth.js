import { expressjwt } from "express-jwt";
import User from '../models/user';
import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import { getRegisterEmailParams, getForgotPasswordEmailParams } from '../helpers/email';
import shortId from 'shortid';
import _ from 'lodash';

require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export const register = (req, res, next) => {
    const { name, email, password } = req.body;

    // check if user exist in our db
    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({ error: 'Email is taken' })
        }

        // generate token with name, email, password
        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, {
            expiresIn: '20m'
        });

        // send token to the user
        const params = getRegisterEmailParams(email, token);
        const sendEmailOnRegister = ses.sendEmail(params).promise();

        sendEmailOnRegister
            .then(data => {
                return res.json({
                    message: `Email has been sent to ${email}, follow the instructions in the email to complete your registration`
                });
            })
            .catch(err => {
                console.log('ses email on register', err);
                return res.status(400).json({
                    error: `We could not verify your email, please try again!`
                });
            })
    })


};

export const userRegisterActivate = (req, res, next) => {
    const { token } = req.body;

    // verify token for user account activation
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {

        // if error
        if (err) {
            return res.status(401).json({
                error: 'Expired link. Try again'
            });
        }

        // decoded token
        const { name, email, password } = decoded;
        const username = shortId.generate();

        //check if user exist
        User.findOne({ email }).exec((err, user) => {

            if (user) {
                return res.status(401).json({ error: 'Email is taken' })
            }

            // Register new user
            const newUser = new User({ username, name, email, password });
            newUser.save((err, user) => {

                if (err)
                    return res.status(401).json({ error: 'Unable to save the user in database. Try later.' });

                return res.json({
                    message: 'Account is activated successfully. Please login.'
                });

            })

        })

    });

}

export const userLogin = (req, res, next) => {

    const { email, password } = req.body;

    User.findOne({ email }).exec((err, user) => {

        if (err || !user)
            return res.status(400).json({
                error: 'User with that email address dose not exist. Please register'
            });

        // check if the user is authenticated
        if (!user.authenticate(password))
            // the user authentication failed
            return res.status(401).json({
                error: 'Login failed, please check your email address'
            });

        const { _id, name, email, role } = user;

        // generate a token with user id ( _id )
        const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        return res.json({
            token,
            user: { _id, name, email, role },
            message: 'Login success.'
        });

    })

};

export const userForgotPassword = (req, res, next) => {

    const { email } = req.body;

    // check if user exist with that email.
    User.findOne({ email }).exec((err, user) => {

        if (err || !user)
            return res.status(400).json({
                error: 'User with that email address dose not exist. Please register'
            });

        const { _id, name, email, role } = user;

        // generate a token with user id ( name )
        const token = jwt.sign({ name }, process.env.JWT_RESET_PASSWORD, {
            expiresIn: '10m'
        });

        // populate the db > user > resetPasswordLink
        return User.updateOne({ resetPasswordLink: token }, (err, success) => {

            // check if there is any error
            if (err || !success) {
                return res.status(400).json({
                    error: `Password reset failed, please try later`
                });
            }

            // send token to the user
            const params = getForgotPasswordEmailParams(email, token);
            const sendEmail = ses.sendEmail(params).promise();
            sendEmail
                .then(data => {
                    return res.json({
                        message: `Email has been sent to ${email}, follow the instructions in the email to reset your password`
                    });
                })
                .catch(err => {
                    console.log('ses email on forgot password', err);
                    return res.status(400).json({
                        error: `We could not verify your email, please try again!`
                    });
                })


        })

    })

};

export const resetPassword = (req, res, next) => {
    const { newPassword, resetPasswordLink } = req.body;

    // verify token for user account activation
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err, decoded) => {

        // if error
        if (err) {
            return res.status(401).json({
                error: 'Expired link. Try again'
            });
        }

        User.findOne({ resetPasswordLink }).exec((err, user) => {

            if (err || !user) {
                return res.status(401).json({
                    error: 'Failed to reset the password. Try later'
                });
            }

            const updatedFields = {
                password: newPassword,
                resetPasswordLink: ''
            }

            user = _.extend(user, updatedFields);

            user.save((err, result)=>{

                // check if there is any error
                if (err || !result) {
                    return res.status(400).json({
                        error: `Password reset failed, please try later`
                    });
                }

                res.json({ message: 'Great!, Now you can login  with your new password ' })

            })


        })

    })

}
// check if the user is sign in (Authenticated)
export const requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['sha1', 'RS256', 'HS256'],
}); // req.auth

// if user athenticated then retrive user info and put it to req.profile
// use this middleware when need to access to any athenticated (any role) user resorces
export const authMiddleware = (req, res, next) => {

    const authUserId = req.auth._id;

    // Find the user related to the authUserId
    User.findOne({ _id: authUserId }).exec((err, user) => {

        //if has error means it is not authorized
        if (err || !user)
            return res.status(401).json({
                error: 'User not found.'
            })

        // user is authenticated so put the info the profile object
        req.profile = user;
        next();

    });

}

// if user has admin role and athenticated then retrive user info and put it to req.profile
// use this middleware when need to access to admin role resorces
export const adminMiddleware = (req, res, next) => {

    const adminUserId = req.auth._id;

    // Find the user related to the authUserId
    User.findOne({ _id: adminUserId }).exec((err, user) => {

        //if has error means it is not authorized
        if (err || !user)
            return res.status(401).json({
                error: 'User not found.'
            })

        if (user.role !== 'admin') {
            return res.status(401).json({
                error: 'Admin recource. Access denied'
            })
        }

        // user is authenticated so put the info the profile object
        req.profile = user;
        next();

    });

}