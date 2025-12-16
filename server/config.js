export const config = {
  port: Number(process.env.PORT || 5175),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
}
