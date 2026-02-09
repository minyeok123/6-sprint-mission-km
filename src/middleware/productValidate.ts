import { assert, Struct } from 'superstruct';
import { Request, Response, NextFunction } from 'express';

export function productValidate<T, S>(struct: Struct<T, S>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      if (body.price) {
        body.price = parseInt(body.price, 10);
      }
      if (body.stock) {
        body.stock = parseInt(body.stock, 10);
      }
      if (body.tag) {
        body.tag = body.tag;
      }
      assert(req.body, struct);
      next();
    } catch (e) {
      next(e);
    }
  };
}
