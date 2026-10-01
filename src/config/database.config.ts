import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  // We apply automatic password encoding here
  uri: `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DOMAIN}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTHSOURCE}`,
}));
