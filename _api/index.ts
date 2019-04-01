import * as express from 'express';
import * as morgan from 'morgan';
import config from './config';

const app = express();

const logger = morgan('[:date] :method :url :status :res[content-length] - :response-time ms');
app.use(logger);

app.get('/api/booked', (req, res) => {
  res.json({
    '2019-04-04 10:00': {},
    '2019-04-07 14:00': {},
    '2019-04-07 18:00': {}
  })
});

app.use(express.static('../_site'));

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));
