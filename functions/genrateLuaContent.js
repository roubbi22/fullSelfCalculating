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
}) => {
  return `innerDiameter = ${innerDiameter} --mm
outerDiameter = ${outerDiameter} --mm
yokeBaseWidth = ${yokeBaseWidth} --mm
yokeBaseHeight = ${yokeBaseHeight} --mm
yokeUpperWidth = ${yokeUpperWidth} --mm
youkeUpperOuterHeight = ${youkeUpperOuterHeight} --mm
nYokes = ${nYokes}
FWWidth = ${FWWidth} --mm
FWHeight = ${FWHeight} --mm
padding = ${padding} --mm
rotorTurns = ${rotorTurns} --turns
rotorCurrent = ${rotorCurrent} --A
innerStatorRadius = ${innerStatorRadius} --mm
airGap = ${airGap} --mm
`;
};

module.exports = genrateLuaContent;
