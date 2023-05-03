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

export type Patient = {
  co_seq_cidadao: number;
  nu_cpf: string;
  no_cidadao: string;
};

export type PatientUnit = {
  no_unidade_saude: string;
};

export type Days = {};

export type RegisterAppointmentParams = {
  name: string;
  cpf: string;
  date: Date;
  unit_id: number;
  status: string;
  user_id: number;
  phone_number: string;
  is_phone_number_whatsapp: boolean;
  appointment_type_id: number;
};

export type RegisterUnitParams = {
  name: string;
  open_time: string;
  close_time: string;
  code: number;
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
