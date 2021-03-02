/* global WIKI */

// ------------------------------------
// CAS Account
// ------------------------------------

const ESNCASStrategy = require('passport-cas').Strategy

module.exports = {
  init (passport, conf) {
    passport.use('esnaccounts',
      new ESNCASStrategy({
        version: "CAS3.0",
        esnCountry: conf.esnCountry,
        ssoBaseURL: conf.ssoBaseURL,
        serverBaseURL: conf.serverBaseURL,
        validateUrl: '/serviceValidate',
        serviceURL: conf.callbackURL,
        passReqToCallback: true
      }, async (req, profile, cb) => {
        try {
          if (profile.attributes.country != conf.esnCountry) {
            throw new WIKI.Error.AuthLoginFailed()
          }
          const user = await WIKI.models.users.processProfile({
            providerKey: req.params.strategy,
            profile: {
              id: profile.user,
              user: profile.user,
              mail: profile.attributes.mail,
              displayName: profile.attributes.first.concat(" " + profile.attributes.last),
              picture: profile.attributes.picture
            }
          })
          cb(null, user)
        } catch (err) {
          cb(err, null)
        }
      })
    )
  },
  logout (conf) {
    return '/'
  }
}
