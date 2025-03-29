const toCompactElements = (
    elements: Element[],
    { isPlural, parent }: any
  ) => {
    let result: any = [];
    console.log('elements', elements);

    elements.forEach((element) => {
      const name = element.name as string;
      const attributes = Boolean(element.attributes);
      const res = parent.replace(name, '');
      console.log('res', res);
      const isLocalPlural = ['s', 'es'].includes(res);
      if (attributes && !isPlural) {
        if (isLocalPlural) {
          result.push(element.attributes)
        } else {
          result[name] = element.attributes;
        }
      }

      const d = toCompactElements(element.elements ?? [], {
        isPlural: isLocalPlural,
        parent: name,
      });

      console.log(`
          ============
          parent: ${parent}
          name: ${name}
          isPlural: ${isPlural}
          isLocalPlural: ${isLocalPlural}
          d: ${JSON.stringify(d)}
          ===========
        `);
      console.log('result', result);

      if (!isLocalPlural) {
       /*  result[name] = {
          ...result[name],
          ...d,
        }; */
      }
    });

    return result;
  };

  const toCompact = (node: Element, options: any) => {
    const { parent = '', isPlural } = options || {};
    const nodeName = node.name as string;
    console.log('node', node);

    let result: any = {};

    if (node.attributes) {
      Object.assign(result, node.attributes);
    }

    if (node.elements && node.elements.length > 0) {
      node.elements.forEach((element) => {
        const name = element.name as string;
        const attributes = Boolean(element.attributes);
        const res = parent.replace(name, '');
        console.log('res', res);
        const isLocalPlural = ['s', 'es'].includes(res);
        if (attributes && !isPlural) {
          if (isLocalPlural) {
            result = element.attributes;
          } else {
            result[name] = element.attributes;
          }
        }

        const d = toCompactElements(element.elements ?? [], {
          isPlural: isLocalPlural,
          parent: name,
        });

        console.log(`
          ============
          parent: ${parent}
          name: ${name}
          isPlural: ${isPlural}
          isLocalPlural: ${isLocalPlural}
          d: ${JSON.stringify(d)}
          ===========
        `);
        console.log('result', result);

        if (!isLocalPlural) {
          result[name] = {
            ...result[name],
            ...d,
          };
        }
      });
    }

    return result;
  };