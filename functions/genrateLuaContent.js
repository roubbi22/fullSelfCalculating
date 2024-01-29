const genrateLuaContent = ({
  innerDiameter,
  outerDiameter,
  yokeBaseWidth,
  yokeBaseHeight,
  yokeUpperWidth,
  youkeUpperOuterHeight,
  nYokes,
  FWWidth,
  FWHeight,
  padding,
  rotorTurns,
  rotorCurrent,
  innerStatorRadius,
  airGap,
  rotorWireDiameter,
  rotorFillFactor,
  FWyokeBaseFraction,
}) => {
  const calculatedFWHeight =
    (Math.sqrt((innerStatorRadius - airGap) ** 2 - (yokeUpperWidth / 2) ** 2) -
      youkeUpperOuterHeight -
      Math.sqrt((outerDiameter / 2) ** 2 - (yokeBaseWidth / 2) ** 2) -
      2 * padding) *
    FWyokeBaseFraction;

  const calculatedFWWidth =
    (rotorTurns * (Math.PI * rotorWireDiameter ** 2)) /
    4 /
    (rotorFillFactor * calculatedFWHeight);

  return `innerDiameter = ${innerDiameter} --mm
outerDiameter = ${outerDiameter} --mm
yokeBaseWidth = ${yokeBaseWidth} --mm
yokeBaseHeight = ${yokeBaseHeight} --mm
yokeUpperWidth = ${yokeUpperWidth} --mm
youkeUpperOuterHeight = ${youkeUpperOuterHeight} --mm
nYokes = ${nYokes}
FWWidth = ${calculatedFWWidth} --mm
FWHeight = ${calculatedFWHeight} --mm
padding = ${padding} --mm
rotorTurns = ${rotorTurns} --turns
rotorCurrent = ${rotorCurrent} --A
innerStatorRadius = ${innerStatorRadius} --mm
airGap = ${airGap} --mm
`;
};

module.exports = genrateLuaContent;
