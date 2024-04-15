import express, {
  Application,
  NextFunction,
  Request,
  Response,
  request,
  response,
} from "express";

import cosrs from "cors";
import router from "./app/routes";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import { AppointmentService } from "./app/modules/Appointment/appointment.service";
import cron from "node-cron";

const app: Application = express();
express;
// middlewares
app.use(cosrs());
app.use(cookieParser());
// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cron.schedule("* * * * *", () => {
  AppointmentService.cancelUnpaidAppointments();
});

app.get("/", (req: Request, res: Response) => {
  res.send({ server: "server is running" });
});

// all routes
app.use("/api/v1", router);

// global error handler
app.use(globalErrorHandler);

// no routes found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    status: false,
    message: "API NOT FOUND",
    error: {
      path: req.originalUrl,
    },
  });
});

export default app;
