/**
 *ExeptionCSD
 */
export class ExeptionCSD extends Error {
  /**
   *constructor
   *
   * @param foo
   * string
   * @param {...any} params
   */
  public foo: string;
  public date: Date;
  constructor(foo = 'bar', ...params: any[]) {
    // Pasa los argumentos restantes (incluidos los específicos del proveedor) al constructor padre
    super(...params);

    // Mantiene un seguimiento adecuado de la pila para el lugar donde se lanzó nuestro error (solo disponible en V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this);
    }

    this.name = 'CustomError';
    // Información de depuración personalizada
    this.foo = foo;
    this.date = new Date();
  }
}
