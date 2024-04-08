import express from 'express';
import { ScheduleController } from './schedule.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', auth(UserRole.DOCTOR), ScheduleController.getAllFromDB)
router.post('/', ScheduleController.inserIntoDB)


export const scheduleRoutes = router;