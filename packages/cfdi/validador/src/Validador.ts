import fs from 'fs';
import { parseXml } from './parser';
import * as rules from './rules';
import type { ValidationIssue, ValidationResult, ValidationRule } from './types';

export class Validador {
  private _rules: ValidationRule[];

  constructor() {
    this._rules = [
      ...rules.estructuraRules,
      ...rules.montosRules,
      ...rules.emisorRules,
      ...rules.receptorRules,
      ...rules.conceptosRules,
      ...rules.impuestosRules,
      ...rules.timbreRules,
      ...rules.selloRules,
    ];
  }

  validate(xml: string): ValidationResult {
    const data = parseXml(xml);
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    for (const rule of this._rules) {
      const issues = rule(data);
      for (const issue of issues) {
        if (issue.code.endsWith('W')) {
          warnings.push(issue);
        } else {
          errors.push(issue);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      version: data.version,
    };
  }

  validateFile(filePath: string): ValidationResult {
    const xml = fs.readFileSync(filePath, 'utf-8');
    return this.validate(xml);
  }
}
