import { AnyValidateFunction, ErrorObject, SchemaObject } from 'ajv/dist/core';

import { DataValidationCxt } from 'ajv/dist/types';
import { JSV } from '../JSV';
import { Schemakey } from '../types/key-schema';

export class ValidateXSD {
  private static instances: Map<Schemakey, ValidateXSD> = new Map();

  protected schema!: AnyValidateFunction;
  protected key!: Schemakey;

  constructor(key: Schemakey) {
    this.setSchema(key);
  }

  setSchema(key: Schemakey) {
    this.key = key;
    this.schema = JSV.of().getSchema(key);
  }

  public static of(key: Schemakey): ValidateXSD {
    if (!ValidateXSD.instances.has(key)) {
      ValidateXSD.instances.set(key, new ValidateXSD(key));
    }
    const instance = ValidateXSD.instances.get(key)!;
    instance.setSchema(key);

    return instance;
  }

  get errors() {
    return this.schema.errors;
  }

  public validate(data: Record<string, any>, dataCxt?: DataValidationCxt) {
    const valid = this.schema(data, dataCxt);
    console.log(`[KEY] => ${this.key}`, data, this.errors);
    if (!valid) {
      console.log(`[KEY] => ${this.key}`, this.errors);
    }
    return valid;
  }
}
