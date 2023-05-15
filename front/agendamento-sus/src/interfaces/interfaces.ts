import { weekdaysTranslation } from '../utils/consts';

export type APIResponse<T> = {
  sucess: boolean;
  data: T;
  message: string;
};

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
  rua: string;
  numero: string;
  bairro: string;
  open_time: string;
  close_time: string;
}

export interface Appointment {
  id: number;
  name: string;
  cpf: string;
  date: string;
  status: string;
  phone_number: number;
  is_phone_number_whatsapp: boolean;
  atendimento: string;
}

export interface AppointmentType {
  id: number;
  duration: number;
  name: string;
}

export interface RegisterAppointmentTypeParams {
  name: string;
  duration: number;
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

export interface Secretarie {
  appointment_type_id: number;
  appointment_type_name: string;
  days: DaysInterface[];
  unit_id: number;
}

export type AvaliableDay = Pick<Secretarie, 'appointment_type_id' | 'days'>;

export type Patient = {
  co_seq_cidadao: number;
  nu_cpf: string;
  no_cidadao: string;
};

export type PatientUnit = {
  no_unidade_saude: string;
};

export type RegisterAppointmentParams = {
  name: string;
  cpf: string;
  date: Date;
  unit_id: number;
  status: string;
  phone_number: string;
  is_phone_number_whatsapp: boolean;
  appointment_type_id: number;
};

export type RegisterUnitParams = {
  name: string;
  open_time: Date;
  close_time: Date;
  bairro: string;
  rua: string;
  numero: string;
};

export type RegisterUserParams = {
  name: string;
  email: string;
  password: string;
  c_password: string;
};

export type LoginParams = {
  email: string;
  password: string;
};

export type RegisterParams = {
  name: string;
  email: string;
  password: string;
  c_password: string;
};

export type LoginResponse = {
  name: 'string';
  token: 'string';
};

type Days = {
  day: string;
  slots: number;
};

export type RegisterSecretarieParams = {
  unit_id: number;
  appointment_type_id: number;
  days: Days[];
};
