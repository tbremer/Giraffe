function isGeneric(reg=/Object/, obj) {
  return reg.test(Object.prototype.toString.call(obj));
}

function isArray(obj) {
  return isGeneric(/Array/, obj);
}

export { isArray };
