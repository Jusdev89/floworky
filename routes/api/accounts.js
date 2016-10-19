const express = require( 'express' )

const bcrypt = require('bcrypt')
const encryptPassword = require( '../../auth/encryptPassword' )
const RegistrationEmail = require( '../../src/mail/registration_email.js' )
const jwt = require( 'jsonwebtoken' )
const { testForCode, whereClause } = require( '../accounts/verify_user' )
const User = require('../../database/models').User

const router = express.Router()

const ERROR_MESSAGE = "Incorrect email or password. Have you verified your email?"

const findUser = ( email, password ) => {
  return User.findOne({ where: { email, email_verified: true }})
    .then( user =>
      new Promise( (resolve, reject) => {
        if( ! user ) {
          reject({ message: ERROR_MESSAGE })
        }

        bcrypt.compare( password, user.password, (error, result ) => {
          if( result ) {
            resolve( user )
          } else {
            reject( error )
          }
        })
      })
    )
}

router.post('/authenticate', (request, response) => {
  const User = request.app.get('models').User
  const { email, password } = request.body

  // find the user
  findUser( email, password ).then( user => {

    const token = jwt.sign( user, 'superSecret', {
      expiresIn: 1440 // expires in 24 hours
    })
    response.json({
      success: true,
      message: 'Enjoy your token!',
      token: token
    })
  })
  .catch(err => {

    response.json({ err, success: false, message: 'Authentication failed. Wrong password.' })
  })

})


module.exports = router
