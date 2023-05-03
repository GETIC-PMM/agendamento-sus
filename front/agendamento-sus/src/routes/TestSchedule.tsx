import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

const TestSchedule = () => {
  const currentDate = new Date();

  //ANO - MES - DIA - HORA - MINUTO
  const schedulerData = [
    {
      startDate: '2023-03-14T09:45',
      endDate: '2023-03-14T11:00',
      title: 'Bruna Anastacio Bento',
      subtitle: '111.116.522-01',
    },
    {
      startDate: '2023-03-14T12:00',
      endDate: '2023-03-14T13:30',
      title: 'Thaís Pimenta Quaresma',
      subtitle: '712.111.563-89',
    },
  ];

  return (
    <div>
      <Scheduler locale={'pt-BR'} data={schedulerData}>
        <ViewState currentDate={currentDate} />
        <WeekView excludedDays={[0, 6]} startDayHour={7} endDayHour={17} />
        <Appointments />
      </Scheduler>
    </div>
  );
};

export default TestSchedule;
