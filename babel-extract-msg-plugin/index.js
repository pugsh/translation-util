const fs = require('fs');
const MESSAGES = Symbol('i18n_messages');

const saveToFile = (fileName, msg) => {
  let messages = [];
  try {
    messages = JSON.parse(fs.readFileSync(fileName));
  } catch (e) {
    messages = [];
  }
  fs.writeFileSync(fileName, JSON.stringify([...messages, ...msg]));
};

module.exports = function extractStrings({ types: t }) {
  return {
    visitor: {
      CallExpression(path, { file }) {
        const { callee } = path.node;
        const args = path.node.arguments;
        const { functionName = 't' } = this.opts;

        if (callee.name !== functionName) return;
        if (!args.length) return;
        if (!t.isStringLiteral(args[0])) return;

        const { value } = args[0];
        file.get(MESSAGES).add(value);
      },
    },
    pre(file) {
      if (!file.has(MESSAGES)) {
        file.set(MESSAGES, new Set());
      }
    },
    post(file) {
      const { outputFile } = this.opts;
      const messages = [...file.get(MESSAGES)];
      saveToFile(outputFile, messages);
    },
  };
};
