import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { Prisma, Schedule } from "@prisma/client";
import { TPaginationOptions } from "../../interfaces/paginations";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { TAuthUser } from "../../interfaces/common";

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


const getAllFromDB = async (
  filters: any,
  options: TPaginationOptions,
  user: TAuthUser
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { startDateTime, endDateTime, ...filterData } = filters;

  const andConditions = [];
  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDateTime
          }
        },
        {
          endDateTime: {
            lte: endDateTime
          }
        }
      ]
    })
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }


  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};


  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email
      }
    }
  })

  const doctorScheduleIds =  doctorSchedules.map(schedule => schedule.scheduleId)


  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds
      }
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
          createdAt: 'desc',
        }
  });
  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds
      }
    }
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};


export const ScheduleService = {
  inserIntoDB,
  getAllFromDB
};
