export function checkXAxisType(firstValue: any) {
  let type;
  if (isNaN(Date.parse(firstValue))) {
    type = 'string';
  } else {
    if (typeof firstValue === 'number') {
      type = 'number';
    } else {
      type = 'date';
    }
  }
  return type;
}
