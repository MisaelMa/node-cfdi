import { writeFileSync } from 'fs';

import { Renapo, TypeFinde, WithCurp, WithData } from '../types/gob.types';
import { Mexican } from '../types/mexican.types';
import { ensure, parseResponse } from '../utils/parse.reponse';
import { captchaSolver } from '../utils/recaptach';
import { apiBase } from './api';

interface ConsutalWithData extends WithData, TypeFinde {
  fechaNacimiento: string
}
interface ConsutalWithCurpt extends WithCurp, TypeFinde {

}
const constulta = async (data: ConsutalWithData | ConsutalWithCurpt): Promise<Renapo> => {
  const captchaSolution = await captchaSolver(
    '6LdJssgUAAAAAKkVr-Aj-xP5QQzclPeGZmhRwXeY',
    'https://www.gob.mx/curp'
  );

  return apiBase.post<Renapo>('renapoCURP/consulta', {
    ...data,
    ip: '127.0.0.1',
    response: captchaSolution,
  }).then(res => res.data);
}
export const findByCurp = async (curp: string): Promise<Mexican | { error: string } | null> => {
  const res = await constulta({
    curp: curp,
    tipoBusqueda: "curp"
  })
  ensure(res.codigo);
  if (res.registros == undefined) {
    return {
      curp: curp,
      error: 'CURP not found',
    };
  }
  return parseResponse(res);
}
export const findByData = async (data: WithData) => {
  const res = await constulta({
    ...data,
    fechaNacimiento: `${data.diaNacimiento}/${data.mesNacimiento}/${data.selectedYear}`,
    tipoBusqueda: "datos",
  })
  ensure(res.codigo);
  if (res.registros == undefined) {
    return {
      curp: "",
      error: 'CURP not found',
    };
  }
  return parseResponse(res);

}

export const getBase64Pdf = (params: string) => {
  // 'data:application/pdf;base64,'
  apiBase.get(`https://consultas.curp.gob.mx/CurpSP/pdfgobmx${params}`).then((res) => res.data)
}
export const savePDF = (options: {
  file: string,
  fullPath: string
}) => {
  const { file, fullPath } = options
  writeFileSync(fullPath, Buffer.from(file, 'base64'), 'utf8');
}
