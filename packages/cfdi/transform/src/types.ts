export interface AttrRule {
  type: 'attr';
  name: string;
  required: boolean;
}

export interface ChildRule {
  type: 'child';
  select: string;
  forEach: boolean;
  inline: (AttrRule | TextRule)[];
  applyTemplates: boolean;
  condition?: string;
  wildcard?: boolean;
  descendant?: boolean;
}

export interface TextRule {
  type: 'text';
  select: string;
  required: boolean;
}

export type Rule = AttrRule | TextRule | ChildRule;

export interface ParsedTemplate {
  match: string;
  rules: Rule[];
}

export interface XsltParseResult {
  templates: Map<string, ParsedTemplate>;
  namespaces: Map<string, string>;
}

export type TemplateRegistry = XsltParseResult;

export interface XmlElement {
  type: 'element';
  name: string;
  attributes?: Record<string, string>;
  elements?: XmlElement[];
}

export interface XmlDocument {
  elements?: XmlElement[];
}
