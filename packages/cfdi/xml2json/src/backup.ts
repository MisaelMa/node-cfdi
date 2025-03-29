const cleanJson = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(cleanJson);
    } else if (typeof obj === 'object' && obj !== null) {
      const newObj: Record<string, unknown> = {};
      for (const key in obj) {
        const cleanKey = (
          key.includes(':') ? key.split(':').pop() : key
        ) as string;
        const value = cleanJson(obj[key]);
  
        if (key === '_attributes') {
          Object.assign(newObj, value);
        } else if (typeof value === 'object' && value !== null) {
          const keys = Object.keys(value);
          if (
            keys.length === 1 &&
            typeof value[keys[0]] === 'object' &&
            value[keys[0]] !== null
          ) {
            newObj[cleanKey] = Array.isArray(value[keys[0]])
              ? value[keys[0]]
              : [value[keys[0]]];
          } else {
            newObj[cleanKey] = value;
          }
        } else {
          newObj[cleanKey] = value;
        }
      }
  
      return newObj;
    }
  
    return obj;
  };
  
  interface Element {
    name: string;
    attributes: Record<string, string>;
    elements: Element[];
  }
  
  const cleanJson2 = (elements: Element[]): Record<string, unknown>[] => {
    const resolutions: Record<string, unknown>[] = [];
  
    elements.forEach((element) => {
      const name = element.name as string;
      const attributes = element.attributes;
      const child_elements = element.elements as Element[];
  
      // Creamos un objeto para almacenar los datos del elemento
      const elementData: Record<string, unknown> = {};
  
      // Agregamos los atributos del elemento al objeto
      Object.keys(attributes).forEach((key) => {
        elementData[key] = attributes[key];
      });
  
      // Si tiene elementos hijos, los procesamos de forma recursiva
      if (child_elements && child_elements.length > 0) {
        const childData: Record<string, unknown>[] = [];
        child_elements.forEach((child_element) => {
          const child_name = child_element.name as string;
          const child_attributes = child_element.attributes;
  
          const child_elementData: Record<string, unknown> = {};
  
          // Agregamos los atributos del hijo
          Object.keys(child_attributes).forEach((key) => {
            child_elementData[key] = child_attributes[key];
          });
  
          // Recursión para manejar subelementos anidados
          const grandchild_elements = child_element.elements as Element[];
          if (grandchild_elements && grandchild_elements.length > 0) {
            child_elementData[child_name] = cleanJson2(grandchild_elements);
          }
  
          childData.push(child_elementData);
        });
  
        // Se agregan los hijos al objeto principal
        elementData[name] = childData;
      }
  
      // Añadimos el objeto al array de resultados
      resolutions.push(elementData);
    });
  
    return resolutions;
  };
  const extractElement = (node: Element, options = {}): any => {
    const { parentName = '', isPlural } = options as {
      parentName?: string;
      isPlural?: boolean;
    };
    const isPluralLocal = parentName.endsWith('s') && parentName.slice(0, -1) === node.name;
    const data = {};

    const subelements = node.elements;
    let subelementos2 = []
    if (subelements && subelements.length > 0){
         subelementos2 = extractElements(subelements, { parentName: node.name, isPlural: isPluralLocal });
    }
    
    if (isPluralLocal) {
       
      Object.assign(data, node.attributes);

    } else {
      Object.assign(data, {
        [`${node.name}`]: node.attributes ? node.attributes : subelementos2,
      });
    }
    console.log("data", data);
    return data;
  };

  const extractElements = (elements: Element[], options = {}): any => {
    const { parentName = '', isPlural = false } = options as {
        parentName?: string;
        isPlural?: boolean;
      };
   const extracted = elements.map((el, i) => {
      const result_child = extractElement(el, { parentName, isPlural});
      return result_child
    });

    return extracted;
  };
  const transformToCompact = (node: Element, options: any) => {
    const { isPlural = false } = options;
    if (!node || typeof node !== 'object') return node;

    const result = {};

    if (node.attributes) {
      Object.assign(result, node.attributes);
    }

    // Convierte elementos
    if (node.elements && node.elements.length > 0) {
        const subelementos = extractElements(node.elements, {
          parentName: node.name,
          isPlural,
        });
        console.log("subelementos", subelementos);
         subelementos.forEach((el) => {
          Object.assign(result, el);
        }); 
    }

    return {
        [node.name]: result
    };
  };  