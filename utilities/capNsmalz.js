exports.neat = function (yourName) {
  let firstChar = yourName.slice(0, 1);
  firstChar = firstChar.toUpperCase();
  let restChar = yourName.slice(1, yourName.length);
  restChar = restChar.toLowerCase();
  const newName = firstChar + restChar;

  return newName;
};
exports.neatSmallz = function (yourName) {
  let firstChar = yourName;
  let newChar = firstChar.toLowerCase();

  return newChar;
};
exports.neatCapz = function (yourName) {
  let firstChar = yourName;
  let newChar = firstChar.toUpperCase();

  return newChar;
};

exports.regimeTypePrefix = (regimeType) => {
  if (regimeType.toLowerCase() === "concert") {
    return "CT";
  } else if (regimeType.toLowerCase() === "conference"){
    return "CF";
  } else if (regimeType.toLowerCase() === "theatre"){
    return "TH";
  } else if (regimeType.toLowerCase() === "pageantry"){
    return "PG";
  } else if (regimeType.toLowerCase() === "service"){
    return "SC";
  } else if (regimeType.toLowerCase() === "education"){
    return "ED";
  } else if (regimeType.toLowerCase() === "carnival"){
    return "CV";
  } else if (regimeType.toLowerCase() === "festival"){
    return "FV";
  } else if (regimeType.toLowerCase() === "party"){
    return "PT";
  } else if (regimeType.toLowerCase() === "sport"){
    return "SP";
  } else if (regimeType.toLowerCase() === "talentshow"){
    return "TS";
  } else {
    return "Error method not allowed";
  }
}