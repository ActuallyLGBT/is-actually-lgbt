module.exports = {
  baseUrl: '',
  auth: {
    cookieName: '',
    jwtSecret: ''
  },
  passport: {
    strategies: {

      google: {
        name: 'Google',
        protocol: 'oauth2',
        strategy: require('passport-google-oauth2').Strategy,
        scope: ['email'],
        options: {
          clientID: '',
          clientSecret: ''
        }
      }
    }
  }
}
