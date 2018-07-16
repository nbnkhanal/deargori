module.exports = {
    auth: {
        user: 'nabinjenny11@gmail.com',
        pass: 'jenabinny11'
    },
    
    facebook: {
        clientID: '1861759354108916', //Facebook login app id
        clientSecret: 'c88516cf29c19d5d591189d013a7c254', //Facebook login secret key
        profileFields: ['email', 'displayName'],
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        passReqToCallback: true
    }
}