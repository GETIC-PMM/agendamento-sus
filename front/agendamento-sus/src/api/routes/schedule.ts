import { useQuery } from '@tanstack/react-query';
import { APIResponse, Patient, PatientUnit } from '../../interfaces/interfaces';
import { instance } from '../instance';

export const usePatientNameByCPF = (cpf: string) => {
  const cpfWithoutMask = cpf.replace('.', '').replace('.', '').replace('-', '');
  return useQuery({
    queryKey: ['patientNameByCPF', cpfWithoutMask],
    queryFn: () =>
      instance.get<APIResponse<Patient>>(`/patients/${cpfWithoutMask}`).then(
        response => response.data,
        error => console.error(error),
      ),
    enabled: false,
  });
};

export const usePatientUnitByCPF = (cpf: string) => {
  const cpfWithoutMask = cpf.replace('.', '').replace('.', '').replace('-', '');
  return useQuery({
    queryKey: ['patientUnitByCPF', cpfWithoutMask],
    queryFn: () =>
      instance
        .get<APIResponse<PatientUnit>>(`/patients/lastRecord/${cpfWithoutMask}`)
        .then(
          response => response.data,
          error => console.error(error),
        ),
    enabled: false,
  });
};
