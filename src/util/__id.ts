export function __id(obj) {
  if (Array.isArray(obj)) return obj.map(el => replace_id(el));
  return replace_id(obj);
}

function replace_id(obj) {
  if (!obj || !(typeof obj === 'object') || !('_id' in obj)) {
    return obj;
  }
  obj.id = obj._id;
  delete obj._id;
  return obj;
}
