export default {
  port: 5000,
  mongoHost: process.env.MONGO_HOST || 'mongo',
  allowedCorsHost: '*',
  adminEmail: 'torela@torela.ee',
  smtpHost: 'codeborne.com',
  password: process.env.PASSWORD,
  bookingFee: {
    amount: 40,
    days: 3
  }
}
