import xmlJs from 'xml-js';
import type { AttrRule, TextRule, ChildRule, TemplateRegistry, XmlElement } from './types';

export function normalizeSpace(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export function requerido(value: string | undefined): string {
  return `|${normalizeSpace(value ?? '')}`;
}

export function opcional(value: string | undefined): string {
  if (value === undefined || value === null) return '';
  return `|${normalizeSpace(value)}`;
}

export function generateCadenaOriginal(
  xmlContent: string,
  registry: TemplateRegistry
): string {
  const doc = xmlJs.xml2js(xmlContent, { compact: false }) as {
    elements?: XmlElement[];
  };

  const root = doc.elements?.find(e => e.type === 'element');
  if (!root) return '||||';

  // Find the root element that matches any template in the registry
  const rootTemplate = findRootElement(doc.elements!, registry);
  if (!rootTemplate) return '|||';

  // Verify namespaces: the XML must declare the same namespace URIs as the XSLT
  if (!namespacesMatch(rootTemplate, registry)) {
    return '|||';
  }

  const result = processNode(rootTemplate, registry);
  return `|${result}||`;
}

function namespacesMatch(
  xmlElement: XmlElement,
  registry: TemplateRegistry
): boolean {
  if (registry.namespaces.size === 0) return true;

  for (const [prefix, xsltUri] of registry.namespaces) {
    const xmlUri = xmlElement.attributes?.[`xmlns:${prefix}`] as string | undefined;
    if (xmlUri && xmlUri !== xsltUri) {
      return false;
    }
  }
  return true;
}

function findRootElement(
  elements: XmlElement[],
  registry: TemplateRegistry
): XmlElement | undefined {
  for (const el of elements) {
    if (el.type === 'element' && registry.templates.has(el.name)) {
      return el;
    }
    if (el.elements) {
      const found = findRootElement(el.elements, registry);
      if (found) return found;
    }
  }
  return undefined;
}

export function processNode(
  node: XmlElement,
  registry: TemplateRegistry
): string {
  const template = registry.templates.get(node.name);
  if (!template) return '';

  let result = '';

  for (const rule of template.rules) {
    if (rule.type === 'attr') {
      result += processAttrRule(node, rule);
    } else if (rule.type === 'text') {
      result += processTextRule(node, rule);
    } else {
      result += processChildRule(node, rule, registry);
    }
  }

  return result;
}

function processAttrRule(node: XmlElement, rule: AttrRule): string {
  const value = node.attributes?.[rule.name] as string | undefined;
  return rule.required ? requerido(value) : opcional(value);
}

function processTextRule(node: XmlElement, rule: TextRule): string {
  let value: string | undefined;

  if (rule.select === '.') {
    value = getTextContent(node);
  } else {
    const elements = resolveSelect(node, rule.select);
    if (elements.length > 0) {
      value = getTextContent(elements[0]);
    }
  }

  return rule.required ? requerido(value) : opcional(value);
}

function getTextContent(node: XmlElement): string | undefined {
  if (!node.elements) return undefined;
  const parts: string[] = [];
  for (const child of node.elements) {
    if ((child as any).type === 'text' && (child as any).text !== undefined) {
      parts.push(String((child as any).text));
    }
  }
  return parts.length > 0 ? parts.join('') : undefined;
}

function processChildRule(
  node: XmlElement,
  rule: ChildRule,
  registry: TemplateRegistry
): string {
  if (rule.condition) {
    const conditionElements = resolveSelect(node, rule.condition);
    if (conditionElements.length === 0) return '';
  }

  if (rule.wildcard) {
    return processWildcard(node, registry);
  }

  const elements = rule.descendant
    ? resolveDescendant(node, getLastSegment(rule.select))
    : resolveSelect(node, rule.select);

  let result = '';

  if (rule.forEach || elements.length > 0) {
    for (const el of elements) {
      if (rule.inline.length > 0) {
        for (const inlineRule of rule.inline) {
          if (inlineRule.type === 'attr') {
            result += processAttrRule(el, inlineRule);
          } else {
            result += processTextRule(el, inlineRule);
          }
        }
      }
      if (rule.applyTemplates) {
        result += processNode(el, registry);
      }
    }
  } else if (!rule.forEach && rule.applyTemplates) {
    for (const el of elements) {
      result += processNode(el, registry);
    }
  }

  return result;
}

function processWildcard(node: XmlElement, registry: TemplateRegistry): string {
  if (!node.elements) return '';
  let result = '';
  for (const child of node.elements) {
    if (child.type === 'element') {
      result += processNode(child, registry);
    }
  }
  return result;
}

export function resolveSelect(
  node: XmlElement,
  selectPath: string
): XmlElement[] {
  const cleanPath = selectPath.replace(/^\.\//, '');
  const segments = cleanPath.split('/');
  let current: XmlElement[] = [node];

  for (const segment of segments) {
    const next: XmlElement[] = [];
    for (const el of current) {
      if (el.elements) {
        for (const child of el.elements) {
          if (child.type === 'element' && child.name === segment) {
            next.push(child);
          }
        }
      }
    }
    current = next;
  }

  return current;
}

function resolveDescendant(
  node: XmlElement,
  elementName: string
): XmlElement[] {
  const results: XmlElement[] = [];
  collectDescendants(node, elementName, results);
  return results;
}

function collectDescendants(
  node: XmlElement,
  elementName: string,
  results: XmlElement[]
): void {
  if (!node.elements) return;
  for (const child of node.elements) {
    if (child.type === 'element') {
      if (child.name === elementName) {
        results.push(child);
      }
      collectDescendants(child, elementName, results);
    }
  }
}

function getLastSegment(path: string): string {
  const segments = path.split('/');
  return segments[segments.length - 1];
}
