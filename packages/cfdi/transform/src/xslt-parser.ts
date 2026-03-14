import fs from 'fs';
import path from 'path';
import xmlJs from 'xml-js';
import type {
  AttrRule,
  TextRule,
  ChildRule,
  Rule,
  ParsedTemplate,
  TemplateRegistry,
  XmlElement,
} from './types';

const NAMED_TEMPLATES = ['Requerido', 'Opcional', 'ManejaEspacios'];

export function parseXslt(mainXsltPath: string): TemplateRegistry {
  const templates = new Map<string, ParsedTemplate>();
  const namespaces = new Map<string, string>();
  const { elements, stylesheetElement } = collectAllTemplateElements(mainXsltPath);

  if (stylesheetElement?.attributes) {
    for (const [key, value] of Object.entries(stylesheetElement.attributes)) {
      if (key.startsWith('xmlns:') && !key.startsWith('xmlns:xsl') && !key.startsWith('xmlns:xs') && !key.startsWith('xmlns:fn')) {
        const prefix = key.substring(6);
        namespaces.set(prefix, value as string);
      }
    }
  }

  for (const el of elements) {
    const matchAttr = el.attributes?.match as string | undefined;
    if (!matchAttr || matchAttr === '/') continue;

    const template = parseTemplate(el, matchAttr);
    templates.set(template.match, template);
  }

  return { templates, namespaces };
}

function collectAllTemplateElements(mainXsltPath: string): { elements: XmlElement[]; stylesheetElement: XmlElement | null } {
  const visited = new Set<string>();
  const templates: XmlElement[] = [];
  let stylesheetElement: XmlElement | null = null;

  const onStylesheet = (el: XmlElement, isMain: boolean) => {
    if (isMain) stylesheetElement = el;
  };

  collectFromFile(mainXsltPath, visited, templates, onStylesheet, true);
  return { elements: templates, stylesheetElement };
}

function collectFromFile(
  filePath: string,
  visited: Set<string>,
  templates: XmlElement[],
  onStylesheet?: (el: XmlElement, isMain: boolean) => void,
  isMain = false
): void {
  const resolved = path.resolve(filePath);
  if (visited.has(resolved)) return;
  visited.add(resolved);

  const content = fs.readFileSync(resolved, 'utf-8');
  const doc = xmlJs.xml2js(content, { compact: false }) as { elements?: XmlElement[] };

  const stylesheet = doc.elements?.find(
    e => e.name === 'xsl:stylesheet' || e.name === 'xsl:transform'
  );
  if (!stylesheet?.elements) return;

  onStylesheet?.(stylesheet, isMain);

  for (const el of stylesheet.elements) {
    if (el.name === 'xsl:include') {
      const href = el.attributes?.href as string | undefined;
      if (href) {
        const includePath = path.resolve(path.dirname(resolved), href);
        collectFromFile(includePath, visited, templates, onStylesheet, false);
      }
    } else if (el.name === 'xsl:template') {
      const matchAttr = el.attributes?.match as string | undefined;
      const nameAttr = el.attributes?.name as string | undefined;
      if (matchAttr && !NAMED_TEMPLATES.includes(nameAttr || '')) {
        templates.push(el);
      }
    }
  }
}

function parseTemplate(templateEl: XmlElement, match: string): ParsedTemplate {
  const rules: Rule[] = [];
  if (templateEl.elements) {
    extractRulesFromElements(templateEl.elements, rules);
  }
  return { match, rules };
}

function extractRulesFromElements(elements: XmlElement[], rules: Rule[]): void {
  for (const el of elements) {
    if (!el.name) continue;

    if (el.name === 'xsl:call-template') {
      const attrRule = parseCallTemplate(el);
      if (attrRule) rules.push(attrRule);
    } else if (el.name === 'xsl:apply-templates') {
      const select = el.attributes?.select as string | undefined;
      if (select && select !== '.') {
        rules.push({
          type: 'child',
          select: normalizeSelect(select),
          forEach: false,
          inline: [],
          applyTemplates: true,
        });
      }
    } else if (el.name === 'xsl:for-each') {
      const forEachRule = parseForEach(el);
      if (forEachRule) rules.push(forEachRule);
    } else if (el.name === 'xsl:if') {
      const test = el.attributes?.test as string | undefined;
      if (test && el.elements) {
        const innerRules: Rule[] = [];
        extractRulesFromElements(el.elements, innerRules);
        for (const r of innerRules) {
          if (r.type === 'child') {
            r.condition = normalizeSelect(test);
          }
          rules.push(r);
        }
      }
    }
  }
}

function parseCallTemplate(el: XmlElement): AttrRule | TextRule | null {
  const name = el.attributes?.name as string | undefined;
  if (name !== 'Requerido' && name !== 'Opcional') return null;

  const withParam = el.elements?.find(e => e.name === 'xsl:with-param');
  if (!withParam) return null;

  const select = withParam.attributes?.select as string | undefined;
  if (!select) return null;

  const attrName = extractAttrName(select);
  if (attrName) {
    return {
      type: 'attr',
      name: attrName,
      required: name === 'Requerido',
    };
  }

  // Text content extraction: select="." or select="ns:Element/ns:Child"
  return {
    type: 'text',
    select: normalizeSelect(select),
    required: name === 'Requerido',
  };
}

function parseForEach(el: XmlElement): ChildRule | null {
  const select = el.attributes?.select as string | undefined;
  if (!select) return null;

  const isWildcard = select === './*' || select === '*';
  const isDescendant = select.startsWith('.//');
  const normalizedSelect = normalizeSelect(select);

  const innerRules: Rule[] = [];
  if (el.elements) {
    extractRulesFromElements(el.elements, innerRules);
  }

  const hasApplyTemplates = el.elements?.some(
    e => e.name === 'xsl:apply-templates'
  );
  const inlineAttrs = innerRules.filter(
    (r): r is AttrRule | TextRule => r.type === 'attr' || r.type === 'text'
  );
  const innerChildren = innerRules.filter(
    (r): r is ChildRule => r.type === 'child'
  );

  if (isWildcard) {
    return {
      type: 'child',
      select: normalizedSelect,
      forEach: true,
      inline: [],
      applyTemplates: true,
      wildcard: true,
    };
  }

  if (hasApplyTemplates && inlineAttrs.length === 0 && innerChildren.length === 0) {
    return {
      type: 'child',
      select: normalizedSelect,
      forEach: true,
      inline: [],
      applyTemplates: true,
      descendant: isDescendant,
    };
  }

  if (inlineAttrs.length > 0) {
    const rule: ChildRule = {
      type: 'child',
      select: normalizedSelect,
      forEach: true,
      inline: inlineAttrs,
      applyTemplates: false,
      descendant: isDescendant,
    };
    if (innerChildren.length > 0) {
      rule.applyTemplates = true;
    }
    return rule;
  }

  if (innerChildren.length > 0) {
    return {
      type: 'child',
      select: normalizedSelect,
      forEach: true,
      inline: [],
      applyTemplates: true,
      descendant: isDescendant,
    };
  }

  return {
    type: 'child',
    select: normalizedSelect,
    forEach: true,
    inline: [],
    applyTemplates: !!hasApplyTemplates,
    descendant: isDescendant,
  };
}

function extractAttrName(select: string): string | null {
  // Pattern: ./@AttributeName or @AttributeName
  const match = select.match(/\.?\/?@(.+)$/);
  return match ? match[1] : null;
}

function normalizeSelect(select: string): string {
  return select.replace(/^\.\//, '');
}
