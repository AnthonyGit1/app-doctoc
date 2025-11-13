import { Navigation, Footer } from '../layouts';
import { DoctorBookingView } from '../features/doctor-calendar/DoctorBookingView';

export interface CalendarInfo {
  datosCalendarioCompletos?: {
    doctor: {
      id: string;
      name: string;
    };
    info: {
      updatedAt?: string;
      isPublic?: boolean;
    };
    horarios: {
      fijos?: {
        [day: string]: Array<{
          startTime: string;
          endTime: string;
        }>;
      };
      dinamicos?: Array<{
        startDate: string;
        endDate: string;
        description?: string;
        horarios: {
          [day: string]: Array<{
            startTime: string;
            endTime: string;
          }>;
        };
      }>;
    };
    exeptionsBlock?: Array<{
      date: string;
      isFullDay: boolean;
      timeBlocks?: Array<{
        startTime: string;
        endTime: string;
      }>;
      reason?: string;
    }>;
    paymentMethods?: {
      yapeNumbers?: Array<{
        name: string;
        number: string;
      }>;
    };
    customPrices?: {
      [typeId: string]: number;
    };
    associatedTypes?: {
      [typeId: string]: number;
    };
  };
}

interface DoctorCalendarPageProps {
  calendarInfo: CalendarInfo;
}

export const DoctorCalendarPage = ({ calendarInfo }: DoctorCalendarPageProps) => {
  const data = calendarInfo.datosCalendarioCompletos;

  if (!data) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
              <h1 className="text-2xl font-bold text-white mb-4">
                Calendario no encontrado
              </h1>
              <p className="text-gray-400 mb-6">
                No se pudo cargar la información del calendario del doctor.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Vista simplificada de agendamiento */}
          <DoctorBookingView 
            doctor={data.doctor}
            horarios={data.horarios}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};