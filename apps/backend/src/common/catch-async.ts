import { Request, Response, NextFunction } from "express";

export function CatchAsync() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      Promise.resolve(originalMethod.call(this, req, res, next)).catch(
        (error) => {
          // You can customize error handling here
          res.status(error.statusCode || 500).json({
            statusCode: error.statusCode || 500,
            message: error.message || "Internal Server Error",
          });
        }
      );
    };
    return descriptor;
  };
}

export function CatchAsyncClass() {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);

        const propertyNames = Object.getOwnPropertyNames(constructor.prototype);
        for (const propertyName of propertyNames) {
          const descriptor = Object.getOwnPropertyDescriptor(
            constructor.prototype,
            propertyName
          );
          if (
            propertyName !== "constructor" &&
            typeof descriptor?.value === "function"
          ) {
            // Bind the method to 'this' and wrap it with error catcher
            const originalMethod = descriptor.value;
            (this as any)[propertyName] = async (...methodArgs: any[]) => {
              try {
                return await originalMethod.apply(this, methodArgs);
              } catch (err) {
                const next = methodArgs[2]; // Express: (req, res, next)
                if (typeof next === "function") {
                  return next(err);
                } else {
                  console.error("Unhandled error:", err);
                }
              }
            };
          }
        }
      }
    };
  };
}
