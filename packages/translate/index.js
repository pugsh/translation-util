import format from 'string-format';

function getMessage(id) {
  if (window.__TRANSLATION__ && window.__TRANSLATION__[locale]) {
    const locale = window.__TRANSLATION__.LOCALE;
    return window.__TRANSLATION__[locale][id];
  }
  return id;
}

export function t(message, args, opts = {}) {
  const messageId = opts.id ? opts.id : message;
  return format(getMessage(messageId), args);
}

export function changeLanguage(locale) {
  window.__TRANSLATION__.LOCALE = locale;
}

export function setMessages(locale, messages) {
  window.__TRANSLATION__[locale] = messages;
  changeLanguage(locale);
}
