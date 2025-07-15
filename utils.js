
function formatDateToYYYYMMDD(date) {
    const [day, month, year] = date.split(' ')[0].split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const d = new Date(formattedDate);
    const isValid = d instanceof Date && !isNaN(d.getTime());
    if (!isValid) {
        console.log('Invalid date');
        return null;
    }
    return formattedDate;
}

function removeInvalidValues(obj) {
  if (Array.isArray(obj)) {
    const filteredArray = obj.map(removeInvalidValues).filter(item =>
      item !== undefined &&
      item !== '(none)' &&
      !(typeof item === 'object' && Object.keys(item).length === 0)
    );
    
    return filteredArray.length > 0 ? filteredArray : undefined;
  }

  if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeInvalidValues(value);
      if (
        cleanedValue !== undefined &&
        cleanedValue !== '(none)' &&
        !(typeof cleanedValue === 'object' && Object.keys(cleanedValue).length === 0)
      ) {
        newObj[key] = cleanedValue;
      }
    }
    return Object.keys(newObj).length > 0 ? newObj : undefined;
  }

  return obj;
}

module.exports = utils = {
  formatDateToYYYYMMDD,
  removeInvalidValues
};