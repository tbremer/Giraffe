const toString = Object.prototype.toString;

function isGeneric(reg=/Object/, obj) {
  return reg.test(toString.call(obj));
}

function isArray(obj) {
  return isGeneric(/Array/, obj);
}

export { isArray };
