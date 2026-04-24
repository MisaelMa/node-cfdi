import { birthday, birthdayFormatFromRenapo, REGEX_CURP } from '../common/constants';
import { getState } from '../curp';
import { Renapo } from '../types/gob.types';
import { Mexican } from '../types/mexican.types';
const genderISOConverter = new Map([
  ['HOMBRE', '1'],
  ['MUJER', '2'],
  ['No binario', '3'],
]);
export const ensure = (code: string) => {
  switch (code) {
    case '01':
      return;
    case '02':
    case '03':
    case '04':
    case '05':
    case '07':
      throw new Error('Invalid 07');
    case '11':
    case '13':
      throw new Error('');
    case '180001':
    case '190001':
      return;
    default:
      throw new Error('');
  }
}

export const parseResponse = (payload: Renapo): Mexican => {
  const register = payload.registros[0] as any;
  return {
    curp: register.curp,
    fatherName: register.primerApellido,
    motherName: register.segundoApellido,
    name: register.nombres,
    gender: genderISOConverter.get(register.sexo) ?? '',
    birthday: register.fechaNacimiento.replace(
      birthdayFormatFromRenapo,
      birthday
    ),
    state: getState(register.curp),
    statusCurp: register.statusCurp,
    nationality: register.nacionalidad,
    probatoryDocument: register.docProbatorio,
    pdf: `https://consultas.curp.gob.mx/CurpSP/pdfgobmx${register.parametro}`,
    probatoryDocumentData: {
      ...register.datosDocProbatorio,
    },
  };
}
