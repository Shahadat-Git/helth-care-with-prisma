import express from 'express';


const router = express.Router();

router.post('/', ScheduleController.inserIntoDB)


export const doctorScheduleRoutes = router;