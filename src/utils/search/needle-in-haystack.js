export default function needleInHaystack(name, value, haystack) {
  const l = haystack.length;
  let i = 0;

  for (; i < l; i++) {
    const needle = haystack[i];

    if (!(name in needle)) continue;
    if (needle[name] !== value) continue;

    return needle;
  }

  return undefined;
}
