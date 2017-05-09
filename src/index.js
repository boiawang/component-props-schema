import traverse from 'babel-traverse';
import {readFileSync} from 'fs';
import {transform} from 'babel-core';

function getComponentPropsSchema(filename) {
  const content = readFileSync(filename, 'utf-8');

  const {ast} = transform(content, {
    presets: ['stage-0']
  });

  let properties = {};
  let schema = {};
  traverse(ast, {
    Program: {
      exit() {
        let propsSchema = {
          type: 'object'
        };
        propsSchema.properties = properties;
        schema.propsSchema = propsSchema;
      }
    },
    ExportDefaultDeclaration({node}) {
      const {declaration} = node;
      if (declaration.type === 'ClassDeclaration') {
        schema.name = declaration.id.name;
      }
      if (declaration.type === 'Identifier') {
        schema.name = declaration.name;
      }
    },
    MemberExpression({node, parent}) {
      const name = node.property.name
      if (name !== 'defaultProps' && name !== 'propTypes') {
        return;
      }
      const {right} = parent;

      if (right.type !== 'ObjectExpression') {
        return;
      }

      if (name === 'propTypes') {
        right.properties.forEach((node) => {
          const {value, key} = node;
          const {property} = value;
          const propertyName = property.name;
          const keyName = key.name;

          if (!properties[keyName]) {
            properties[keyName] = {};
          }

          // 只有字符串
          if (typeof propertyName === 'string') {
            if (propertyName === 'isRequired') {
              properties[keyName].isRequired = true;
            } else {
              properties[keyName].type = propertyName;
            }
          }
        });
      }

      if (name === 'defaultProps') {
        right.properties.forEach((node) => {
          const {value, key} = node;
          const keyName = key.name;
          const defaultValue = value.value;

          if (!properties[keyName]) {
            properties[keyName] = {};
          }
          if (properties[keyName]) {
            properties[keyName].default = defaultValue;
          }
        });
      }
    }
  });

  return schema;
}

module.exports = getComponentPropsSchema;
