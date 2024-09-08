import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';

const { NODE_ENV, PORT, DB = '' } = process.env;
const onDevelopment = NODE_ENV === 'development';

const app = express();

if (onDevelopment) {
  app.use(morgan('dev'));
}

(async () => {
  try {
    await mongoose.connect(DB);
    onDevelopment && mongoose.set({ debug: true });

    console.log('DB connected successfully');
  } catch (err) {
    console.log(err);
  }
})();

app.get('/', (req, res) => {
  console.log('get request');
});

app.listen(Number(PORT), '127.0.0.1', () => {
  console.log(`Listening on the port ${PORT} in ${NODE_ENV}`);
});
