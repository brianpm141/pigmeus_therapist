import { AppointmentService } from "../services/appointmentService";
import { MOCK_APPOINTMENTS } from "../mocks";

export const seedDatabase = async () => {

  try {
    // Recorremos el array de mocks y los subimos uno por uno
    for (const appt of MOCK_APPOINTMENTS) {
      // Eliminamos el ID ficticio porque Firebase generará uno real
      const { id, ...apptData } = appt;
      
      await AppointmentService.createAppointment(apptData);
    }
  } catch (error) {
    console.error("Error en el seed:", error);
  }
};