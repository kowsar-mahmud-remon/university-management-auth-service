import express, { Application } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { UserRoutes } from './app/modules/user/user.route';

const app: Application = express();

app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// application routes
// console.log(process.env)
app.use('/api/v1/users/', UserRoutes);

// testing
// app.get('/', async (req: Request, res: Response, next: NextFunction) => {
//   console.log(x)
// })

app.use(globalErrorHandler);

export default app;
