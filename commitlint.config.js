module.exports = {
  "extends": ["./common/autoinstallers/rush-commitlint/node_modules/@commitlint/config-conventional/lib/index.js"],
    rules: {
        // https://commitlint.js.org/#/reference-rules
        // Level [0..2]: 0 disables the rule. For 1 it will be considered a warning for 2 an error.
        // Applicable always|never: never inverts the rule.
        // Value: value to use for this rule.
        "subject-case": [2, 'always', ['lower-case', 'sentence-case']],
        "body-max-line-length": [2, 'always', 200],
        'scope-enum': [
          2,
          'always',
          [
            'config',
            'core',
            'catalogs',
            'csd',
            'csf',
            'curp',
            'pdf',
            'rfc',
            'utils',
            'xml',
            'complementos',
            'only-complementos',
            'openssl',
            'saxon',
            'publish',
            'xsd',
            'schema',
            'transform',
            'types',
            'elements',
            'expresiones',
            '2json',
            'sat',
            'estado',
            'descarga',
            'validador',
            'cleaner'
          ]
      ],
      'type-enum': [
        2,
        'always',
        [
          'feat', 'fix', 'docs', 'style', 'refactor', 'test', 'revert', 'content', 'npm', 'chore' // For articles, tutorials, etc...
        ],
      ],
    }
}
