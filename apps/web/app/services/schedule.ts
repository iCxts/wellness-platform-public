import {
  scheduleItemSchema,
  type ScheduleItem,
  type ScheduleTab,
} from '~/schemas/schedule'

const wait = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

const scheduleSeed: ScheduleItem[] = [
  {
    id: 'sch_1',
    title: 'YOGA Express',
    dateLabel: 'Today',
    startTime: '12:15',
    endTime: '13:00',
    location: 'Wellness Center A',
    trainer: 'Kru Ploy',
    tab: 'upcoming',
    status: 'booked',
  },
  {
    id: 'sch_2',
    title: 'Full Body Flex',
    dateLabel: 'Today',
    startTime: '12:15',
    endTime: '13:00',
    location: 'Wellness Center C',
    trainer: 'Kru Ploy',
    tab: 'upcoming',
    status: 'booked',
  },
  {
    id: 'sch_3',
    title: 'Vinyasa Flow',
    dateLabel: '18 APR',
    startTime: '13:15',
    endTime: '14:00',
    location: 'Wellness Center A',
    trainer: 'Kru Pim',
    tab: 'upcoming',
    status: 'booked',
  },
  {
    id: 'sch_4',
    title: 'HIIT Core',
    dateLabel: '24 Apr',
    startTime: '17:00',
    endTime: '17:30',
    location: 'Wellness Center B',
    trainer: 'Kru David',
    tab: 'upcoming',
    status: 'booked',
  },
  {
    id: 'sch_5',
    title: 'Morning Stretch',
    dateLabel: '09 Apr',
    startTime: '08:00',
    endTime: '08:30',
    location: 'Wellness Center A',
    trainer: 'Kru Mint',
    tab: 'history',
    status: 'completed',
  },
  {
    id: 'sch_6',
    title: 'Pilates Core',
    dateLabel: '03 Apr',
    startTime: '11:00',
    endTime: '11:45',
    location: 'Wellness Center C',
    trainer: 'Kru Beam',
    tab: 'history',
    status: 'completed',
  },
  {
    id: 'sch_7',
    title: 'Power Yoga',
    dateLabel: '30 Apr',
    startTime: '18:00',
    endTime: '18:45',
    location: 'Wellness Center B',
    trainer: 'Kru Ploy',
    tab: 'waitlist',
    status: 'waitlisted',
  },
  {
    id: 'sch_8',
    title: 'Boxing Fit',
    dateLabel: '02 May',
    startTime: '19:00',
    endTime: '19:45',
    location: 'Wellness Center C',
    trainer: 'Kru Jet',
    tab: 'waitlist',
    status: 'waitlisted',
  },
]

export async function fetchScheduleByTab(tab: ScheduleTab): Promise<ScheduleItem[]> {
  await wait()
  return scheduleSeed
    .filter((item) => item.tab === tab)
    .map((item) => scheduleItemSchema.parse(item))
}
