import { describe, it, expect } from 'vitest';
import {
  buildSolicitarRequest,
  parseSolicitarResponse,
} from '../src/soap/solicitar';
import {
  buildVerificarRequest,
  parseVerificarResponse,
} from '../src/soap/verificar';
import {
  buildDescargarRequest,
  parseDescargarResponse,
} from '../src/soap/descargar';
import { digestSha256, canonicalize } from '../src/soap/signer';
import { TipoSolicitud, TipoDescarga, EstadoSolicitud, EstadoComprobante } from '../src/types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const RFC = 'AAA010101AAA';
const TOKEN = '2024-01-01T00:00:00Z';
const CERT = 'MIIFbase64certdata==';
const SIGNATURE = 'base64signaturevalue==';
const ID_SOLICITUD = 'a3d08a33-d0d8-4f36-a857-ab4b2a5edc7c';
const ID_PAQUETE = 'a3d08a33-d0d8-4f36-a857-ab4b2a5edc7c_01';

const SOLICITUD_PARAMS = {
  rfcSolicitante: RFC,
  fechaInicio: '2024-01-01',
  fechaFin: '2024-01-31',
  tipoSolicitud: TipoSolicitud.CFDI,
  tipoDescarga: TipoDescarga.Emitidos,
};

// ---------------------------------------------------------------------------
// Signer helpers
// ---------------------------------------------------------------------------
describe('canonicalize', () => {
  it('elimina la declaracion XML', () => {
    const result = canonicalize(
      '<?xml version="1.0" encoding="utf-8"?><root/>'
    );
    expect(result).toBe('<root/>');
  });

  it('retorna el mismo string si no tiene declaracion XML', () => {
    const result = canonicalize('<root><child/></root>');
    expect(result).toBe('<root><child/></root>');
  });

  it('elimina espacios al inicio y final', () => {
    const result = canonicalize('  <root/>  ');
    expect(result).toBe('<root/>');
  });
});

describe('digestSha256', () => {
  it('retorna un string Base64 valido', () => {
    const digest = digestSha256('hola mundo');
    expect(digest).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(digest.length).toBeGreaterThan(20);
  });

  it('produce el mismo digest para la misma entrada', () => {
    const a = digestSha256('contenido de prueba');
    const b = digestSha256('contenido de prueba');
    expect(a).toBe(b);
  });

  it('produce digests diferentes para entradas diferentes', () => {
    const a = digestSha256('contenido A');
    const b = digestSha256('contenido B');
    expect(a).not.toBe(b);
  });
});

// ---------------------------------------------------------------------------
// buildSolicitarRequest
// ---------------------------------------------------------------------------
describe('buildSolicitarRequest', () => {
  it('genera un envelope SOAP valido con los namespaces correctos', () => {
    const xml = buildSolicitarRequest(
      SOLICITUD_PARAMS,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain('xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"');
    expect(xml).toContain('xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx/"');
    expect(xml).toContain('s:Envelope');
    expect(xml).toContain('s:Body');
  });

  it('incluye el elemento SolicitaDescarga', () => {
    const xml = buildSolicitarRequest(
      SOLICITUD_PARAMS,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain('des:SolicitaDescarga');
    expect(xml).toContain('des:solicitud');
  });

  it('incluye la fecha inicial en formato ISO', () => {
    const xml = buildSolicitarRequest(
      SOLICITUD_PARAMS,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain('FechaInicial="2024-01-01T00:00:00"');
  });

  it('incluye la fecha final en formato ISO', () => {
    const xml = buildSolicitarRequest(
      SOLICITUD_PARAMS,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain('FechaFinal="2024-01-31T23:59:59"');
  });

  it('incluye el RFC solicitante', () => {
    const xml = buildSolicitarRequest(
      SOLICITUD_PARAMS,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(`RfcSolicitante="${RFC}"`);
  });

  it('incluye el tipo de solicitud CFDI', () => {
    const xml = buildSolicitarRequest(
      SOLICITUD_PARAMS,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain('TipoSolicitud="CFDI"');
  });

  it('incluye el tipo de solicitud Metadata cuando se especifica', () => {
    const xml = buildSolicitarRequest(
      { ...SOLICITUD_PARAMS, tipoSolicitud: TipoSolicitud.Metadata },
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain('TipoSolicitud="Metadata"');
  });

  it('incluye RfcEmisor para descarga de emitidos', () => {
    const xml = buildSolicitarRequest(
      SOLICITUD_PARAMS,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(`RfcEmisor="${RFC}"`);
  });

  it('incluye RfcReceptor para descarga de recibidos', () => {
    const xml = buildSolicitarRequest(
      {
        ...SOLICITUD_PARAMS,
        tipoDescarga: TipoDescarga.Recibidos,
        rfcReceptor: 'BBB020202BBB',
      },
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain('RfcReceptor="BBB020202BBB"');
  });

  it('no incluye EstadoComprobante cuando no se especifica', () => {
    const xml = buildSolicitarRequest(
      SOLICITUD_PARAMS,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).not.toContain('EstadoComprobante');
  });

  it('incluye EstadoComprobante="1" para vigentes', () => {
    const xml = buildSolicitarRequest(
      { ...SOLICITUD_PARAMS, estadoComprobante: EstadoComprobante.Vigente },
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain('EstadoComprobante="1"');
  });

  it('incluye EstadoComprobante="0" para cancelados', () => {
    const xml = buildSolicitarRequest(
      { ...SOLICITUD_PARAMS, estadoComprobante: EstadoComprobante.Cancelado },
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain('EstadoComprobante="0"');
  });

  it('incluye el certificado en el header de seguridad', () => {
    const xml = buildSolicitarRequest(
      SOLICITUD_PARAMS,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(CERT);
  });

  it('incluye el valor de firma', () => {
    const xml = buildSolicitarRequest(
      SOLICITUD_PARAMS,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(SIGNATURE);
  });

  it('incluye el token en el timestamp del header', () => {
    const xml = buildSolicitarRequest(
      SOLICITUD_PARAMS,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(TOKEN);
  });

  it('incluye los algoritmos de firma RSA-SHA256', () => {
    const xml = buildSolicitarRequest(
      SOLICITUD_PARAMS,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(
      'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256'
    );
  });
});

// ---------------------------------------------------------------------------
// parseSolicitarResponse
// ---------------------------------------------------------------------------
const RESPONSE_SOLICITAR_OK = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <SolicitaDescargaResponse xmlns="http://DescargaMasivaTerceros.sat.gob.mx/">
      <SolicitaDescargaResult CodEstatus="5000"
                               IdSolicitud="${ID_SOLICITUD}"
                               Mensaje="Solicitud Aceptada"/>
    </SolicitaDescargaResponse>
  </s:Body>
</s:Envelope>`;

const RESPONSE_SOLICITAR_FAULT = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <s:Fault>
      <faultcode>s:Client</faultcode>
      <faultstring>RFC no valido</faultstring>
    </s:Fault>
  </s:Body>
</s:Envelope>`;

describe('parseSolicitarResponse', () => {
  it('extrae el IdSolicitud de la respuesta exitosa', () => {
    const result = parseSolicitarResponse(RESPONSE_SOLICITAR_OK);
    expect(result.idSolicitud).toBe(ID_SOLICITUD);
  });

  it('extrae el CodEstatus de la respuesta exitosa', () => {
    const result = parseSolicitarResponse(RESPONSE_SOLICITAR_OK);
    expect(result.codEstatus).toBe('5000');
  });

  it('extrae el Mensaje de la respuesta exitosa', () => {
    const result = parseSolicitarResponse(RESPONSE_SOLICITAR_OK);
    expect(result.mensaje).toBe('Solicitud Aceptada');
  });

  it('lanza Error cuando la respuesta contiene un SOAP Fault', () => {
    expect(() => parseSolicitarResponse(RESPONSE_SOLICITAR_FAULT)).toThrow(
      'SOAP Fault'
    );
  });

  it('incluye el mensaje del SOAP Fault en el error', () => {
    expect(() => parseSolicitarResponse(RESPONSE_SOLICITAR_FAULT)).toThrow(
      'RFC no valido'
    );
  });
});

// ---------------------------------------------------------------------------
// buildVerificarRequest
// ---------------------------------------------------------------------------
describe('buildVerificarRequest', () => {
  it('genera un envelope SOAP valido', () => {
    const xml = buildVerificarRequest(
      ID_SOLICITUD,
      RFC,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain('s:Envelope');
    expect(xml).toContain('s:Body');
    expect(xml).toContain('des:VerificaSolicitudDescarga');
  });

  it('incluye el IdSolicitud en el body', () => {
    const xml = buildVerificarRequest(
      ID_SOLICITUD,
      RFC,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(`IdSolicitud="${ID_SOLICITUD}"`);
  });

  it('incluye el RFC solicitante', () => {
    const xml = buildVerificarRequest(
      ID_SOLICITUD,
      RFC,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(`RfcSolicitante="${RFC}"`);
  });

  it('incluye el certificado', () => {
    const xml = buildVerificarRequest(
      ID_SOLICITUD,
      RFC,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(CERT);
  });

  it('incluye el valor de firma', () => {
    const xml = buildVerificarRequest(
      ID_SOLICITUD,
      RFC,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(SIGNATURE);
  });
});

// ---------------------------------------------------------------------------
// parseVerificarResponse
// ---------------------------------------------------------------------------
const RESPONSE_VERIFICAR_TERMINADA = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <VerificaSolicitudDescargaResponse xmlns="http://DescargaMasivaTerceros.sat.gob.mx/">
      <VerificaSolicitudDescargaResult CodEstatus="5000"
                                        EstadoSolicitud="3"
                                        NumeroCFDIs="150"
                                        Mensaje="Solicitud Terminada">
        <IdsPaquetes>${ID_PAQUETE}</IdsPaquetes>
      </VerificaSolicitudDescargaResult>
    </VerificaSolicitudDescargaResponse>
  </s:Body>
</s:Envelope>`;

const RESPONSE_VERIFICAR_EN_PROCESO = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <VerificaSolicitudDescargaResponse xmlns="http://DescargaMasivaTerceros.sat.gob.mx/">
      <VerificaSolicitudDescargaResult CodEstatus="5001"
                                        EstadoSolicitud="2"
                                        NumeroCFDIs="0"
                                        Mensaje="En proceso"/>
    </VerificaSolicitudDescargaResponse>
  </s:Body>
</s:Envelope>`;

const RESPONSE_VERIFICAR_FAULT = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <s:Fault>
      <faultcode>s:Client</faultcode>
      <faultstring>Token invalido</faultstring>
    </s:Fault>
  </s:Body>
</s:Envelope>`;

describe('parseVerificarResponse', () => {
  describe('solicitud terminada', () => {
    it('extrae el estado Terminada (3)', () => {
      const result = parseVerificarResponse(RESPONSE_VERIFICAR_TERMINADA);
      expect(result.estado).toBe(EstadoSolicitud.Terminada);
    });

    it('extrae la descripcion del estado', () => {
      const result = parseVerificarResponse(RESPONSE_VERIFICAR_TERMINADA);
      expect(result.estadoDescripcion).toBe('Terminada');
    });

    it('extrae el CodEstatus', () => {
      const result = parseVerificarResponse(RESPONSE_VERIFICAR_TERMINADA);
      expect(result.codEstatus).toBe('5000');
    });

    it('extrae el Mensaje', () => {
      const result = parseVerificarResponse(RESPONSE_VERIFICAR_TERMINADA);
      expect(result.mensaje).toBe('Solicitud Terminada');
    });

    it('extrae el NumeroCFDIs', () => {
      const result = parseVerificarResponse(RESPONSE_VERIFICAR_TERMINADA);
      expect(result.numeroCfdis).toBe(150);
    });

    it('extrae los IdsPaquetes', () => {
      const result = parseVerificarResponse(RESPONSE_VERIFICAR_TERMINADA);
      expect(result.idsPaquetes).toContain(ID_PAQUETE);
    });
  });

  describe('solicitud en proceso', () => {
    it('extrae el estado EnProceso (2)', () => {
      const result = parseVerificarResponse(RESPONSE_VERIFICAR_EN_PROCESO);
      expect(result.estado).toBe(EstadoSolicitud.EnProceso);
    });

    it('la lista de paquetes esta vacia', () => {
      const result = parseVerificarResponse(RESPONSE_VERIFICAR_EN_PROCESO);
      expect(result.idsPaquetes).toHaveLength(0);
    });

    it('numeroCfdis es 0 mientras esta en proceso', () => {
      const result = parseVerificarResponse(RESPONSE_VERIFICAR_EN_PROCESO);
      expect(result.numeroCfdis).toBe(0);
    });
  });

  describe('SOAP Fault', () => {
    it('lanza Error cuando la respuesta contiene un SOAP Fault', () => {
      expect(() => parseVerificarResponse(RESPONSE_VERIFICAR_FAULT)).toThrow(
        'SOAP Fault'
      );
    });

    it('incluye el mensaje del fault', () => {
      expect(() => parseVerificarResponse(RESPONSE_VERIFICAR_FAULT)).toThrow(
        'Token invalido'
      );
    });
  });
});

// ---------------------------------------------------------------------------
// buildDescargarRequest
// ---------------------------------------------------------------------------
describe('buildDescargarRequest', () => {
  it('genera un envelope SOAP valido', () => {
    const xml = buildDescargarRequest(
      ID_PAQUETE,
      RFC,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain('s:Envelope');
    expect(xml).toContain('s:Body');
    expect(xml).toContain('des:PeticionDescargaMasivaTercerosEntrada');
  });

  it('incluye el IdPaquete en el body', () => {
    const xml = buildDescargarRequest(
      ID_PAQUETE,
      RFC,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(`IdPaquete="${ID_PAQUETE}"`);
  });

  it('incluye el RFC solicitante', () => {
    const xml = buildDescargarRequest(
      ID_PAQUETE,
      RFC,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(`RfcSolicitante="${RFC}"`);
  });

  it('incluye el certificado', () => {
    const xml = buildDescargarRequest(
      ID_PAQUETE,
      RFC,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(CERT);
  });

  it('incluye el valor de firma', () => {
    const xml = buildDescargarRequest(
      ID_PAQUETE,
      RFC,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(SIGNATURE);
  });

  it('incluye el namespace de descarga masiva', () => {
    const xml = buildDescargarRequest(
      ID_PAQUETE,
      RFC,
      TOKEN,
      CERT,
      SIGNATURE
    );
    expect(xml).toContain(
      'xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx/"'
    );
  });
});

// ---------------------------------------------------------------------------
// parseDescargarResponse
// ---------------------------------------------------------------------------
const ZIP_CONTENT = Buffer.from('PK\x03\x04fake zip content');
const ZIP_B64 = ZIP_CONTENT.toString('base64');

const RESPONSE_DESCARGAR_OK = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <PeticionDescargaMasivaTercerosSalida xmlns="http://DescargaMasivaTerceros.sat.gob.mx/">
      <Paquete>${ZIP_B64}</Paquete>
    </PeticionDescargaMasivaTercerosSalida>
  </s:Body>
</s:Envelope>`;

const RESPONSE_DESCARGAR_FAULT = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <s:Fault>
      <faultcode>s:Client</faultcode>
      <faultstring>Paquete no encontrado</faultstring>
    </s:Fault>
  </s:Body>
</s:Envelope>`;

const RESPONSE_DESCARGAR_SIN_PAQUETE = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <PeticionDescargaMasivaTercerosSalida xmlns="http://DescargaMasivaTerceros.sat.gob.mx/">
    </PeticionDescargaMasivaTercerosSalida>
  </s:Body>
</s:Envelope>`;

describe('parseDescargarResponse', () => {
  it('retorna el contenido del ZIP como Buffer', () => {
    const result = parseDescargarResponse(RESPONSE_DESCARGAR_OK);
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  it('el Buffer contiene el contenido correcto decodificado de Base64', () => {
    const result = parseDescargarResponse(RESPONSE_DESCARGAR_OK);
    expect(result).toEqual(ZIP_CONTENT);
  });

  it('lanza Error cuando la respuesta contiene un SOAP Fault', () => {
    expect(() => parseDescargarResponse(RESPONSE_DESCARGAR_FAULT)).toThrow(
      'SOAP Fault'
    );
  });

  it('incluye el mensaje del fault en el error', () => {
    expect(() => parseDescargarResponse(RESPONSE_DESCARGAR_FAULT)).toThrow(
      'Paquete no encontrado'
    );
  });

  it('lanza Error cuando no hay elemento Paquete en la respuesta', () => {
    expect(() =>
      parseDescargarResponse(RESPONSE_DESCARGAR_SIN_PAQUETE)
    ).toThrow('no contiene el elemento Paquete');
  });
});
