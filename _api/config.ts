export default {
  port: 5000,
  mongoHost: process.env.MONGO_HOST || 'localhost',
  allowedCorsHost: '*',
  fromEmail: 'torela@torela.ee',
  adminEmail: 'torelamangutuba@gmail.com',
  smtpHost: 'smtp.codeborne.com',
  password: process.env.PASSWORD,
  bookingFee: {
    amount: 40,
    days: 3
  }
}
