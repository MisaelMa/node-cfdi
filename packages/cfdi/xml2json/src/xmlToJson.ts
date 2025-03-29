import { XmlCdfi } from '@cfdi/types';
import { readFileSync } from 'fs';
import { ElementCompact, Element, Options, xml2js } from 'xml-js';
import { isPath } from '@cfdi/utils';

export function XmlToJson(
  xmlPath: string,
  config?: { original?: boolean; compact?: boolean }
): any {
  const original = Boolean(config?.original);
  const compact = Boolean(config?.compact);
  const stringXml = isPath(xmlPath) ? readFileSync(xmlPath, 'utf8') : xmlPath;
  const options: Options.XML2JS = {
    ignoreComment: false,
    compact: false,
    ignoreDeclaration: false,
    elementNameFn: (name: string) =>
      original ? name : name.replace(/^.*:/, ''),
  };
  const json = xml2js(stringXml, options);

  const toCompacts = (elements: Element[], options: any) => {
    const { parent = '', isPlural } = options || {};
    let result: any;
   /*   console.log('parent', parent);
    console.log('isPlural', isPlural); */

    //console.log('------------------') 
    elements.forEach((element, i) => {
      const name = element.name as string;
      const attributes = Boolean(element.attributes);
      const res = parent.replace(name, '');
      const isElementPlural = ['s', 'es'].includes(res);

      if (attributes && !isPlural) {
        if (isElementPlural) {
          if (!result) {
            result = [];
          }
          result[i] = element.attributes
        } else {
          if (!result) {
            result = {};
          }
          result[name] = element.attributes;
        }
      }
      /* console.log(`
          ============
          parent: ${parent}
          name: ${name}
          isPlural: ${isPlural}
          isElementPlural: ${isElementPlural}
          attributes: ${JSON.stringify(attributes)}
          ===========`); */
      if (element.elements && element.elements.length > 0) {
        if (isElementPlural) {
        /*   console.log('isElementPlural if ', isElementPlural);
          console.log('element', element); */
          const compact = toCompacts(element.elements, {
            parent: name,
            isPlural: false,
          });
        /*   console.log('compact parent if', name);
          console.log('compact --->', JSON.stringify(compact, null, 2));
          console.log("result", result) */
          result[i] = {
            ...result[i],
            ...compact
          }
          //result['amir'] = {
           // compact
            //...element.attributes,
            //...result[name],
            //...compact
          //}
        } else {
          const compact = toCompacts(element.elements, {
            parent: name,
            isPlural: isElementPlural,
          });
          /* console.log('compact parent else', name);
          console.log('compact --->', compact);
          console.log('isElementPlural', isElementPlural);
          console.log('isPlural', isPlural);  */
          if (!isPlural) {
            if (!result) {
              result = {};
            }
            let r: any;
            if (Array.isArray(compact)) {
              r = {
                [name]: compact,
              };
              result ={
               ...result,
              ...r,
              }
            } else {
              r = compact;
              result[name] = {
                ...result[name],
                ...r,
              };
            }
          } else {
            console.log('isPlural else', isPlural);
            // result.push(compact);
          }
        }
      }
    });

  /*   console.log('==============');
    console.log('result', JSON.stringify(result, null, 2));
    console.log('=============='); */

    return result;
  };

  const compactJson = toCompacts(json.elements, {
    isPlural: false,
    parent: 'Comprobante',
  });

  return compactJson;
}
