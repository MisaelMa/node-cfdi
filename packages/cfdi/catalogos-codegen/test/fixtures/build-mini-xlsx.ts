/**
 * Script auxiliar para generar `catCFDI-mini.xlsx` desde datos en TS.
 * Se ejecuta una vez al cambiar los datos:
 *   tsx test/fixtures/build-mini-xlsx.ts
 *
 * El XLSX resultante se commitea al repo y se carga directamente en los tests.
 */
import path from 'path';
import * as XLSX from 'xlsx';

const wb = XLSX.utils.book_new();

const formaPago = [
  ['Codigo', 'Descripcion'],
  ['01', 'Efectivo'],
  ['02', 'Cheque nominativo'],
  ['99', 'Por definir'],
].map(([a, b]) => ({ A: '', B: a, C: b }));
const wsFormaPago = XLSX.utils.json_to_sheet(formaPago, {
  header: ['A', 'B', 'C'],
  skipHeader: true,
});
XLSX.utils.book_append_sheet(wb, wsFormaPago, 'c_FormaPago');

const tipoComp = [
  ['Codigo', 'Descripcion'],
  ['I', 'Ingreso'],
  ['E', 'Egreso'],
  ['T', 'Traslado'],
  ['P', 'Pago'],
  ['N', 'Nomina'],
].map(([a, b]) => ({ A: '', B: a, C: b }));
const wsTipoComp = XLSX.utils.json_to_sheet(tipoComp, {
  header: ['A', 'B', 'C'],
  skipHeader: true,
});
XLSX.utils.book_append_sheet(wb, wsTipoComp, 'c_TipoDeComprobante');

const outPath = path.resolve(__dirname, 'catCFDI-mini.xlsx');
XLSX.writeFile(wb, outPath);
console.log(`Wrote ${outPath}`);
