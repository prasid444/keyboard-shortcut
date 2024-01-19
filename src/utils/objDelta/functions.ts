const convertBasicToNested = (flatObject: Record<string, any> = {}) => {
  const nestedObject: Record<any, any> = {};
  Object.keys(flatObject).forEach((key) => {
    const value = flatObject[key];

    // Split the key into parts using the dot (.) separator
    const parts = key.split('.');

    let currentObject = nestedObject;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (part.includes('[') && part.includes(']')) {
        // Extract key and index
        const propertyName = part.slice(0, part.indexOf('['));
        const index = part.slice(part.indexOf('[') + 1, part.indexOf(']'));

        if (!currentObject[propertyName]) {
          // Create new array
          currentObject[propertyName] = [];
        }
        if (!currentObject[propertyName][index] && i !== parts.length - 1) {
          // Create a new object at the specified index if it doesn't exist,
          // as there are nested keys inside
          currentObject[propertyName][index] = {};
        } else if (!currentObject[propertyName][index] && i === parts.length - 1) {
          // this is for key[9]:"asdasd" i.e no object in array
          currentObject[propertyName][index] = value;
        }
        // Update the current object to the object at the specified index
        currentObject = currentObject[propertyName][index];
      } else if (i === parts.length - 1) {
        currentObject[part] = value;
      } else {
        if (!currentObject[part]) {
          // Create a new object for the property if it doesn't exist
          currentObject[part] = {};
        }

        // Update the current object to the object with the specified property
        currentObject = currentObject[part];
      }
    }
  });
  return nestedObject;
};

const convertNestedToBasic = (nestedObject: Record<any, any> = {}) => {
  const basicObject: Record<string, any> = {};

  const flattenObject = (obj: Record<any, any>, prefix = '') => {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        flattenObject(obj[key], prefix + key + '.');
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item: any, index: number) => {
          const arrayKey = prefix + key + '[' + index + ']';
          if (typeof item === 'object') {
            flattenObject(item, arrayKey + '.');
          } else {
            basicObject[arrayKey] = item;
          }
        });
      } else {
        basicObject[prefix + key] = obj[key];
      }
    }
  };

  flattenObject(nestedObject);
  return basicObject;
};

const calculateDeltaBaseObject = (
  oldBaseObject: Record<any, any> = {},
  newBaseObject: Record<any, any> = {}
) => {
  const deltaObject: Record<string, any> = {};
  Object.keys(newBaseObject).forEach((key) => {
    if (newBaseObject[key] != oldBaseObject[key]) {
      deltaObject[key] = newBaseObject[key];
    }
  });
  return deltaObject;
};

export { calculateDeltaBaseObject, convertBasicToNested, convertNestedToBasic };
