// export function splitArrayInto4Pieces(array) {
//   const quarterLength = Math.ceil(array.length / 4);

//   const firstQuarter = array.slice(0, quarterLength);
//   const secondQuarter = array.slice(quarterLength, quarterLength * 2);
//   const thirdQuarter = array.slice(quarterLength * 2, quarterLength * 3);
//   const fourthQuarter = array.slice(quarterLength * 3);

//   return [firstQuarter, secondQuarter, thirdQuarter, fourthQuarter];
// }

function removeDuplicates(array) {
  // Create a new set to store the unique elements of the array.
  const set = new Set();

  // Iterate over the array and add each element to the set.
  for (const element of array) {
    set.add(element);
  }

  // Convert the set back to an array.
  const uniqueArray = [...set];

  // Return the unique array.
  return uniqueArray;
}

export function fitlerLinks(links, identifier){
  const filteredLinks = [];
    for (const link of links) {
      if (link.includes(identifier)) {
        filteredLinks.push(link);
      }
    }
    const uniqeLinks = removeDuplicates(filteredLinks);
    return uniqeLinks;
}


