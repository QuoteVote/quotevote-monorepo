export const uniqueArrayObjects = (arrArg) => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) === pos;
  });
};
