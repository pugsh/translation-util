const fs = require('fs');
const MESSAGES = Symbol('i18n_messages');

const saveToFile = (fileName, msg) => {
  let messages = {};
  try {
    messages = JSON.parse(fs.readFileSync(fileName));
  } catch (e) {
    messages = {};
  }
  fs.writeFileSync(fileName, JSON.stringify({ ...messages, ...msg }));
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

        const { value: message } = args[0];
        let messageId = message;
        if (args[2]) {
          const { value } = args[2];
          messageId = value;
        }
        file.get(MESSAGES)[messageId] = message;
      },
    },
    pre(file) {
      if (!file.has(MESSAGES)) {
        file.set(MESSAGES, {});
      }
    },
    post(file) {
      const { outputFile } = this.opts;
      saveToFile(outputFile, file.get(MESSAGES));
    },
  };
};
