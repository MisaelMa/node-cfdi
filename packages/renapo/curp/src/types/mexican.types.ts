export interface Mexican {
  curp: string;
  fatherName: string;
  motherName: string;
  name: string;
  gender?: string; // https://en.wikipedia.org/wiki/ISO/IEC_5218
  birthday: string; // https://en.wikipedia.org/wiki/ISO_8601
  state: string; // https://www.iso.org/obp/ui/#iso:code:3166:MX
  statusCurp?: string; // https://www.notion.so/sanchezcarlosjr/statusCurp-68e3bd32a9274fd1976a3e9a6be33096
  pdf?: string;
  nationality?: string;
  probatoryDocument?: number | string;
  probatoryDocumentData?: Record<string, string | number | undefined>;
}
