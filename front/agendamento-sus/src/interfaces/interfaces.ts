export interface UnitESUS {
  label: string;
  no_unidade_saude: string;
  ds_logradouro: string;
  nu_numero: string;
  no_bairro: string;
}

export interface Unidade {
  id: number;
  name: string;
  open_time: string;
  close_time: string;
  appointment_quantity: number;
  available_days: string[];
}

export interface Appointment {
  id: number;
  name: string;
  cpf: string;
  date: string;
  unit_id: number;
  appointment_type_id: number;
  status: string;
  phone_number: number;
  is_phone_number_whatsapp: boolean;
}

export interface AppointmentType {
  id: number;
  duration: number;
  name: string;
}

export interface Agente {
  id: number;
  name: string;
  email: string;
}

export interface DaysInterface {
  day: string;
  slots: number;
}

export interface Secretaries {
  appointment_type_id: number;
  days: DaysInterface[];
  unit_id: number;
}
