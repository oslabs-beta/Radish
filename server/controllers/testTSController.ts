
import { Request, Response, NextFunction } from 'express';

const testTSController: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {};

testTSController.test = (req: Request, res: Response, next: NextFunction): void  => {
  res.json({
    message: 'Test TypeScript Controller'
  });

  next();
};

export default testTSController;