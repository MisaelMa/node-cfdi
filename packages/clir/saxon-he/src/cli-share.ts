import { execaCommandSync } from '@esm2cjs/execa';
import { existsSync } from 'fs';

/**
 *
 */
export class CliShare {
  public commandline = '';

  public commandlineArray: string[] = [];

  public saxonBin = '';

  /**
   *constructor
   */
  constructor() {
    this.commandline = this.saxonBin;
  }

  /**
   *catalog
   *
   * @param filenames
   * string
   */
  public catalog(filenames: string): this {
    this.commandline += ` -catalog:${filenames}`;
    this.commandlineArray.push(`-catalog:${filenames}`);
    return this;
  }

  /**
   *dtd
   *
   * @param options
   * 'on' | 'off' | 'recover'
   */
  public dtd(options: 'on' | 'off' | 'recover'): this {
    this.commandline += ` -dtd:${options}`;
    this.commandlineArray.push(`-dtd:${options}`);
    return this;
  }

  /**
   *expand
   *
   * @param options
   *  'on' | 'off'
   */
  public expand(options: 'on' | 'off'): this {
    this.commandline += ` -expand:${options}`;
    this.commandlineArray.push(`-expand:${options}`);
    return this;
  }

  /**
   *ext
   *
   * @param options
   * 'on' | 'off
   */
  public ext(options: 'on' | 'off'): this {
    this.commandline += ` -ext:${options}`;
    this.commandlineArray.push(`-ext:${options}`);
    return this;
  }

  /**
   *init
   *
   * @param initializer
   *string
   */
  public init(initializer: string): this {
    this.commandline += ` -init:${initializer}`;
    this.commandlineArray.push(`-init:${initializer}`);
    return this;
  }

  /**
   * L
   *
   * @param options
   * on' | 'off'
   */
  public l(options: 'on' | 'off'): this {
    this.commandline += ` -l:${options}`;
    this.commandlineArray.push(`-l:${options}`);
    return this;
  }

  /**
   *now
   *
   * @param format
   * string
   */
  public now(format: string): this {
    this.commandline += ` -now:${format}`;
    this.commandlineArray.push(`-now:${format}`);
    return this;
  }

  /**
   * o
   *
   * @param filename
   * filename
   */
  public o(filename: string): this {
    this.commandline += ` -o:${filename}`;
    this.commandlineArray.push(`-o:${filename}`);
    return this;
  }

  /**
   *opt
   *
   * @param flags
   * string
   */
  public opt(
    flags:
      | 'c'
      | 'd'
      | 'e'
      | 'f'
      | 'g'
      | 'j'
      | 'k'
      | 'l'
      | 'm'
      | 'n'
      | 'r'
      | 's'
      | 't'
      | 'v'
      | 'w'
      | 'x'
  ): this {
    this.commandline += ` -opt:-${flags}`;
    this.commandlineArray.push(`-opt:-${flags}`);
    return this;
  }

  /**
   *outval
   *
   * @param options
   * 'recover' | 'fatal'
   */
  public outval(options: 'recover' | 'fatal'): this {
    this.commandline += ` -outval:${options}`;
    this.commandlineArray.push(`-outval:${options}`);
    return this;
  }

  /**
   *p
   *
   * @param options
   * 'on' | 'off
   */
  public p(options: 'on' | 'off'): this {
    this.commandline += ` -p:${options}`;
    this.commandlineArray.push(`-p:${options}`);
    return this;
  }

  /**
   *quit
   *
   * @param options
   * 'on' | 'off'
   */
  public quit(options: 'on' | 'off'): this {
    this.commandline += ` -quit:${options}`;
    this.commandlineArray.push(`-quit:${options}`);
    return this;
  }

  /**
   *r
   *
   * @param classname
   * string
   */
  public r(classname: string): this {
    this.commandline += ` -r:${classname}`;
    this.commandlineArray.push(`-r:${classname}`);
    return this;
  }

  /**
   *repeat
   *
   * @param integer
   * number
   */
  public repeat(integer: number): this {
    this.commandline += ` -repeat:${integer}`;
    this.commandlineArray.push(`-repeat:${integer}`);
    return this;
  }

  /**
   *s
   *
   * @param filename
   * string
   */
  public s(filename: string): this {
    if (!existsSync(filename)) {
      throw new Error('No se puede encontrar el xml processar. => ' + filename);
    }
    this.commandline += ` -s:${filename}`;
    this.commandlineArray.push(`-s:${filename}`);
    return this;
  }

  /**
   *sa
   */
  public sa(): this {
    this.commandline += ` -sa`;
    this.commandlineArray.push(`-sa`);
    return this;
  }

  /**
   *scmin
   *
   * @param filename
   * string
   */
  public scmin(filename: string): this {
    this.commandline += ` -scmin:${filename}`;
    this.commandlineArray.push(`-scmin:${filename}`);
    return this;
  }

  /**
   *strip
   *
   * @param options
   *  'all' | 'none' | 'ignorable'
   */
  public strip(options: 'all' | 'none' | 'ignorable'): this {
    this.commandline += ` -relocate:${options}`;
    this.commandlineArray.push(`-relocate:${options}`);
    return this;
  }

  /**
   *t
   */
  public t(): this {
    this.commandline += ` -t`;
    this.commandlineArray.push(`-t`);
    return this;
  }

  /**
   * T
   *
   * @param classname
   * string
   */
  public T(classname: string): this {
    this.commandline += ` -T:${classname}`;
    this.commandlineArray.push(`-T:${classname}`);
    return this;
  }

  /**
   *TB
   *
   * @param filename
   * filename
   */
  public TB(filename: string): this {
    this.commandline += ` -TB:${filename}`;
    this.commandlineArray.push(`-TB:${filename}`);
    return this;
  }

  /**
   *TJ
   */
  public TJ(): this {
    this.commandline += ` -TJ`;
    this.commandlineArray.push(`-TJ`);
    return this;
  }

  /**
   *Tlevel
   *
   * @param level
   *  'none' | 'low' | 'normal' | 'high'
   */
  public Tlevel(level: 'none' | 'low' | 'normal' | 'high'): this {
    this.commandline += ` -Tlevel:${level}`;
    this.commandlineArray.push(`-Tlevel:${level}`);
    return this;
  }

  /**
   *Tout
   *
   * @param filename
   * string
   */
  public Tout(filename: string): this {
    this.commandline += ` -Tout:${filename}`;
    this.commandlineArray.push(`-Tout:${filename}`);
    return this;
  }

  /**
   *TP
   *
   * @param filename
   * string
   */
  public TP(filename: string): this {
    this.commandline += ` -TP:${filename}`;
    this.commandlineArray.push(`-TP:${filename}`);
    return this;
  }

  /**
   *traceout
   *
   * @param filename
   * string
   */
  public traceout(filename: string): this {
    this.commandline += ` -traceout:${filename}`;
    this.commandlineArray.push(`-traceout:${filename}`);
    return this;
  }

  /**
   *tree
   *
   * @param level
   * 'linked' | 'tiny' | 'tinyc'
   */
  public tree(level: 'linked' | 'tiny' | 'tinyc'): this {
    this.commandline += ` -tree:${level}`;
    this.commandlineArray.push(`-tree:${level}`);
    return this;
  }

  /**
   *u
   */
  public u(): this {
    this.commandline += ` -u`;
    this.commandlineArray.push(`-u`);
    return this;
  }

  /**
   *val
   *
   * @param validation
   * 'strict' | 'lax'
   */
  public val(validation: 'strict' | 'lax'): this {
    this.commandline += ` -val:${validation}`;
    this.commandlineArray.push(`-val:${validation}`);
    return this;
  }

  /**
   *x
   *
   * @param classname
   * string
   */
  public x(classname: string): this {
    this.commandline += ` -x:${classname}`;
    this.commandlineArray.push(`-x:${classname}`);
    return this;
  }

  /**
   *xi
   *
   * @param options
   * 'on' | 'off'
   */
  public xi(options: 'on' | 'off'): this {
    this.commandline += ` -xi:${options}`;
    this.commandlineArray.push(`-xi:${options}`);
    return this;
  }

  /**
   *xmlversion
   *
   * @param options
   * '1.0' | '1.1'
   */
  public xmlversion(options: '1.0' | '1.1'): this {
    this.commandline += ` -xmlversion:${options}`;
    this.commandlineArray.push(`-xmlversion:${options}`);
    return this;
  }

  /**
   *xsd
   *
   * @param file
   * string
   */
  public xsd(file: string): this {
    this.commandline += ` -xsd:${file}`;
    this.commandlineArray.push(`-xsd:${file}`);
    return this;
  }

  /**
   *xsdversion
   *
   * @param options
   * '1.0' | '1.1'
   */
  public xsdversion(options: '1.0' | '1.1'): this {
    this.commandline += ` -xsdversion:${options}`;
    this.commandlineArray.push(`-xsdversion:${options}`);
    return this;
  }

  /**
   *xsiloc
   *
   * @param options
   * 'on' | 'off'
   */
  public xsiloc(options: 'on' | 'off'): this {
    this.commandline += ` -xsiloc:${options}`;
    this.commandlineArray.push(`-xsiloc:${options}`);
    return this;
  }

  /**
   *feature
   *
   * @param value
   * string
   */
  public feature(value: string): this {
    this.commandline += ` --feature:${value}`;
    this.commandlineArray.push(`--feature:${value}`);
    return this;
  }

  /**
   *run
   */
  public run(): string {
    try {
      const saxonProc = execaCommandSync(this.commandline).stdout;
      return saxonProc;
    } catch (e) {
      throw new Error('CLI Saxon Error =>' + this.commandline);
    }
  }
}
