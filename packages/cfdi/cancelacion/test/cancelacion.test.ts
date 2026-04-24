import { describe, it, expect } from 'vitest';
import {
  buildCancelacionXml,
  buildCancelarRequest,
  parseCancelarResponse,
} from '../src/soap/cancelar';
import {
  buildAceptacionRechazoRequest,
  parseAceptacionRechazoResponse,
  buildConsultaPendientesRequest,
  parsePendientesResponse,
} from '../src/soap/aceptacion-rechazo';
import {
  MotivoCancelacion,
  RespuestaAceptacionRechazo,
  EstatusCancelacion,
} from '../src/types';

const RFC = 'AAA010101AAA';
const UUID = 'a3d08a33-d0d8-4f36-a857-ab4b2a5edc7c';
const UUID_SUSTITUCION = 'b4e19b44-e1e9-5f47-b968-bc5c3b6fed8d';
const TOKEN = '2024-01-01T00:00:00Z';
const CERT = 'MIIFbase64certdata==';
const SIGNATURE = 'base64signaturevalue==';
const SERIAL = '30001000000400002434';
const FECHA = '2024-06-15T10:30:00';

describe('buildCancelacionXml', () => {
  it('genera XML con el UUID y motivo', () => {
    const xml = buildCancelacionXml(
      { rfcEmisor: RFC, uuid: UUID, motivo: MotivoCancelacion.SinRelacion },
      RFC,
      FECHA,
      CERT,
      SIGNATURE,
      SERIAL
    );
    expect(xml).toContain(`UUID="${UUID}"`);
    expect(xml).toContain('Motivo="02"');
    expect(xml).toContain(`RfcEmisor="${RFC}"`);
  });

  it('incluye FolioSustitucion cuando motivo es 01', () => {
    const xml = buildCancelacionXml(
      {
        rfcEmisor: RFC,
        uuid: UUID,
        motivo: MotivoCancelacion.ConRelacion,
        folioSustitucion: UUID_SUSTITUCION,
      },
      RFC,
      FECHA,
      CERT,
      SIGNATURE,
      SERIAL
    );
    expect(xml).toContain(`FolioSustitucion="${UUID_SUSTITUCION}"`);
    expect(xml).toContain('Motivo="01"');
  });

  it('no incluye FolioSustitucion cuando motivo es 02', () => {
    const xml = buildCancelacionXml(
      { rfcEmisor: RFC, uuid: UUID, motivo: MotivoCancelacion.SinRelacion },
      RFC,
      FECHA,
      CERT,
      SIGNATURE,
      SERIAL
    );
    expect(xml).not.toContain('FolioSustitucion');
  });

  it('incluye la firma y el numero de serie', () => {
    const xml = buildCancelacionXml(
      { rfcEmisor: RFC, uuid: UUID, motivo: MotivoCancelacion.NoOperacion },
      RFC,
      FECHA,
      CERT,
      SIGNATURE,
      SERIAL
    );
    expect(xml).toContain(SIGNATURE);
    expect(xml).toContain(SERIAL);
    expect(xml).toContain(CERT);
  });
});

describe('buildCancelarRequest', () => {
  it('genera un envelope SOAP valido', () => {
    const xml = buildCancelarRequest('<Cancelacion/>', TOKEN, CERT, SIGNATURE);
    expect(xml).toContain('s:Envelope');
    expect(xml).toContain('s:Body');
    expect(xml).toContain('CancelaCFD');
  });

  it('incluye el token en el header de seguridad', () => {
    const xml = buildCancelarRequest('<Cancelacion/>', TOKEN, CERT, SIGNATURE);
    expect(xml).toContain(TOKEN);
  });
});

describe('parseCancelarResponse', () => {
  const RESPONSE_OK = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <CancelaCFDResponse xmlns="http://tempuri.org/">
      <CancelaCFDResult CodEstatus="201" Mensaje="UUID Cancelado">
        <Folio UUID="${UUID}" EstatusUUID="Cancelado"/>
      </CancelaCFDResult>
    </CancelaCFDResponse>
  </s:Body>
</s:Envelope>`;

  const RESPONSE_FAULT = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <s:Fault>
      <faultcode>s:Client</faultcode>
      <faultstring>Certificado invalido</faultstring>
    </s:Fault>
  </s:Body>
</s:Envelope>`;

  it('extrae el UUID de la respuesta exitosa', () => {
    const result = parseCancelarResponse(RESPONSE_OK);
    expect(result.uuid).toBe(UUID);
  });

  it('extrae el estatus Cancelado', () => {
    const result = parseCancelarResponse(RESPONSE_OK);
    expect(result.estatus).toBe(EstatusCancelacion.Cancelado);
  });

  it('extrae el CodEstatus', () => {
    const result = parseCancelarResponse(RESPONSE_OK);
    expect(result.codEstatus).toBe('201');
  });

  it('lanza Error ante un SOAP Fault', () => {
    expect(() => parseCancelarResponse(RESPONSE_FAULT)).toThrow('SOAP Fault');
    expect(() => parseCancelarResponse(RESPONSE_FAULT)).toThrow(
      'Certificado invalido'
    );
  });
});

describe('buildAceptacionRechazoRequest', () => {
  it('genera un envelope SOAP valido con los datos correctos', () => {
    const xml = buildAceptacionRechazoRequest(
      {
        rfcReceptor: RFC,
        uuid: UUID,
        respuesta: RespuestaAceptacionRechazo.Aceptacion,
      },
      TOKEN,
      CERT,
      SIGNATURE,
      FECHA
    );
    expect(xml).toContain('s:Envelope');
    expect(xml).toContain('ProcesarRespuesta');
    expect(xml).toContain(`<UUID>${UUID}</UUID>`);
    expect(xml).toContain(`<Respuesta>Aceptacion</Respuesta>`);
    expect(xml).toContain(`<RfcReceptor>${RFC}</RfcReceptor>`);
  });

  it('soporta respuesta de rechazo', () => {
    const xml = buildAceptacionRechazoRequest(
      {
        rfcReceptor: RFC,
        uuid: UUID,
        respuesta: RespuestaAceptacionRechazo.Rechazo,
      },
      TOKEN,
      CERT,
      SIGNATURE,
      FECHA
    );
    expect(xml).toContain('<Respuesta>Rechazo</Respuesta>');
  });
});

describe('parseAceptacionRechazoResponse', () => {
  const RESPONSE_OK = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <ProcesarRespuestaResponse xmlns="http://cancelacfd.sat.gob.mx/">
      <ProcesarRespuestaResult UUID="${UUID}" CodEstatus="1000" Mensaje="Aceptacion registrada"/>
    </ProcesarRespuestaResponse>
  </s:Body>
</s:Envelope>`;

  it('extrae el UUID de la respuesta', () => {
    const result = parseAceptacionRechazoResponse(RESPONSE_OK);
    expect(result.uuid).toBe(UUID);
  });

  it('extrae el CodEstatus', () => {
    const result = parseAceptacionRechazoResponse(RESPONSE_OK);
    expect(result.codEstatus).toBe('1000');
  });

  it('extrae el Mensaje', () => {
    const result = parseAceptacionRechazoResponse(RESPONSE_OK);
    expect(result.mensaje).toBe('Aceptacion registrada');
  });
});

describe('buildConsultaPendientesRequest', () => {
  it('genera un envelope SOAP con el RFC receptor', () => {
    const xml = buildConsultaPendientesRequest(RFC, TOKEN, CERT, SIGNATURE);
    expect(xml).toContain('ConsultaPendientes');
    expect(xml).toContain(`<RfcReceptor>${RFC}</RfcReceptor>`);
  });
});

describe('parsePendientesResponse', () => {
  const RESPONSE_CON_PENDIENTES = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <ConsultaPendientesResponse xmlns="http://cancelacfd.sat.gob.mx/">
      <Pendientes>
        <Pendiente>
          <UUID>${UUID}</UUID>
          <RfcEmisor>BBB020202BBB</RfcEmisor>
          <FechaSolicitud>2024-06-15T10:30:00</FechaSolicitud>
        </Pendiente>
      </Pendientes>
    </ConsultaPendientesResponse>
  </s:Body>
</s:Envelope>`;

  const RESPONSE_SIN_PENDIENTES = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <ConsultaPendientesResponse xmlns="http://cancelacfd.sat.gob.mx/">
      <Pendientes/>
    </ConsultaPendientesResponse>
  </s:Body>
</s:Envelope>`;

  it('extrae las cancelaciones pendientes', () => {
    const results = parsePendientesResponse(RESPONSE_CON_PENDIENTES);
    expect(results).toHaveLength(1);
    expect(results[0].uuid).toBe(UUID);
    expect(results[0].rfcEmisor).toBe('BBB020202BBB');
  });

  it('retorna lista vacia cuando no hay pendientes', () => {
    const results = parsePendientesResponse(RESPONSE_SIN_PENDIENTES);
    expect(results).toHaveLength(0);
  });
});
