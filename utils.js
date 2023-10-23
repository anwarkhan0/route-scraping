export function splitArrayInto4Pieces(array) {
  const quarterLength = Math.ceil(array.length / 4);

  const firstQuarter = array.slice(0, quarterLength);
  const secondQuarter = array.slice(quarterLength, quarterLength * 2);
  const thirdQuarter = array.slice(quarterLength * 2, quarterLength * 3);
  const fourthQuarter = array.slice(quarterLength * 3);

  return [firstQuarter, secondQuarter, thirdQuarter, fourthQuarter];
}
