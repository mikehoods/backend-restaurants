////////////////
/// DEPENDENCIES
////////////////
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurants.js')
const jwt = require('jsonwebtoken') // Token for later
// const auth = require('./auth')

// ANDY Auth Middleware
// const auth = (req, res, next) => {
//     try {
//         const token = req.header('x-auth-token')
//         if (!token) {
//             return res.status(401).json({msg: "Not authorized"})
//         }
//         const verified = jwt.verify(token, process.env.jwtSECRET)
//         if (!verified) {
//             return res.status(401).json({msg: "Not authorized"})
//         }
//         console.log(verified)
//     }   
//     catch (error) {
//         res.status(500).json({error: error.message})
//     }
// }

// AUTH MIDDLEWARE
const auth = async (req, res, next) => {
    //example header => "Authorization":"bearer kdf909sdfsd98f987d"
    const { authorization } = req.headers; //decon auth header
    //check if header is present
    if (authorization) {
        try {
            const token = authorization.split(' ')[1]; //parses token from header
            const payload = jwt.verify(token, 'secret');
            req.user = payload; //puts user data into request object
            next(); //go to the route
        } catch (error) {
            res.status(400).json(error);
        }
    } else {
        res.status(400).send('NO AUTHORIZATION HEADER');
    }
};
////////////////
/// ROUTES
////////////////

////Create Route////
router.post('/', auth, async (req, res) => {
    try {
        const createdRestaurant = await Restaurant.create(req.body)
        res.status(200).json(createdRestaurant)
    } catch(error) {
        res.status(400).json(error)
    }
})

////Read Route////
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({})
        res.status(200).json(restaurants)
    } catch(error){
        res.status(400).json(error)
    }
})

////Delete Route////
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id)
        res.status(200).json(deletedRestaurant)
    } catch(error) {
        res.status(400).json(error)
    }
})

////Update Route////
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body
        )
        res.status(200).json(updatedRestaurant)
    } catch(error) {
        res.status(400).json(error)
    }
})

module.exports = router