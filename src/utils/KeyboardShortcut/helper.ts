const areArraysSame = <T>(arr1: T[], arr2: T[]): boolean => {
  console.log("Checking for ", arr1, arr2);
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((element, index) => element === arr2[index]);
};

const getActualKey = (keyCode: string) => {
  let keyString: string | undefined;
  if (keyCode.startsWith("Key") || keyCode.startsWith("Digit")) {
    //filter out only those keys that are alphabetical or number(digit)
    keyString = keyCode.replace("Key", "").replace("Digit", "");
  }
  if (keyCode.startsWith("Alt")) {
    //got alt key press, remove Left and Right from there
    keyString = keyCode.replace("Left", "").replace("Right", "");
  }
  return keyString?.toUpperCase();
};

export { areArraysSame, getActualKey };
