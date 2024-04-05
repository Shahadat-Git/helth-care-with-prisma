import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { Schedule } from "@prisma/client";

const inserIntoDB = async (payload: any): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const intervelTime = 30;

  const schedules = [];

  const currentDate = new Date(startDate); //start date
  const lastDate = new Date(endDate); //end date

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          format(currentDate, "yyyy-MM-dd"),
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    // another way
    /*  const endDateTime = new Date(
        addHours(
            `${format(lastDate, 'yyyy-MM-dd')}`,
            Number(endTime.split(':')[0])
        )
    ); */

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, intervelTime),
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + intervelTime);
      // console.log(scheduleData);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

export const ScheduleService = {
  inserIntoDB,
};