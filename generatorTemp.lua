-- lua version 4.0

dofile("./iterations/innerDiameter/20/generatorParams.lua")
-- dofile("iterate.lua")

pi = 3.14159265359

function transformPoint(y, x, angle)
    return y * cos (angle) + x * sin(angle), -y * sin(angle) + x * cos(angle)
end
function transformPoint2(y, x, angle)
    return {y * cos (angle) + x * sin(angle), -y * sin(angle) + x * cos(angle)}
end

function addNodeWithGroup(x, y, group)
    mi_addnode(x, y)
    mi_selectnode(x, y)
    mi_setgroup(group)
end

function addNodeWithGroup2(point, group)
    mi_addnode(point[1], point[2])
    mi_selectnode(point[1], point[2])
    mi_setgroup(group)
end

function addSegmentWithGroup2(point1, point2, group)
    mi_addsegment(point1[1], point1[2], point2[1], point2[2])
    mi_selectsegment((point1[1] + point2[1])/2, (point1[2] + point2[2])/2)
    mi_setgroup(group)
end
    
function addArcWithGroup2(point1, point2, angle, group)
    mi_addarc(point1[1], point1[2], point2[1], point2[2], angle, 1)
    mi_selectarcsegment(point1[1], point1[2])
    mi_setgroup(group)
end

open("empty.fem")

showconsole()
 
-- create the inner diameter and set the group of every node, segment and arc to 100
addNodeWithGroup(0, innerDiameter / 2, 100)
addNodeWithGroup(0, -innerDiameter / 2, 100)
print("innerDiameter / 2 = " .. innerDiameter / 2)
mi_addarc(0, innerDiameter / 2, 0, -innerDiameter / 2, 180, 1) mi_selectarcsegment(0, innerDiameter / 2) mi_setgroup(100)
mi_addarc(0, -innerDiameter / 2, 0, innerDiameter / 2, 180, 1) mi_selectarcsegment(1, -innerDiameter / 2) mi_setgroup(100)

-- set the group for the inner diameter to 100
mi_selectarcsegment(0, innerDiameter / 2)
mi_selectarcsegment(0, -innerDiameter / 2)
mi_setgroup(100)


-- create the outer diameter
yokeBaseY = sqrt((outerDiameter/2)^2 - (yokeBaseWidth/2)^2)

-- create the yoke base 
for i = 0, nYokes-1 do
    addNodeWithGroup2(transformPoint2(yokeBaseWidth/2, yokeBaseY, 2*i*pi/nYokes), 100)
    addNodeWithGroup2(transformPoint2(-yokeBaseWidth/2, yokeBaseY, 2*i*pi/nYokes), 100)
end

outerSegmentAngle = (360 / nYokes) - (2 * asin(yokeBaseWidth / outerDiameter) * 180 / pi)

for i = 0, nYokes-1 do
    p1 = transformPoint2(-yokeBaseWidth/2, yokeBaseY, 2*(i+1)*pi/nYokes)
    p2 = transformPoint2(yokeBaseWidth/2, yokeBaseY, 2*i*pi/nYokes)
    addArcWithGroup2(p1, p2, outerSegmentAngle, 100)
end

-- create nodes for the yoke
for i = 0, nYokes-1 do
    -- create the nodes for the right side of the yoke
    addNodeWithGroup2(transformPoint2(yokeBaseWidth/2, yokeBaseY, 2*i*pi/nYokes), 100)
    addNodeWithGroup2(transformPoint2(yokeBaseWidth/2, yokeBaseY + yokeBaseHeight, 2*i*pi/nYokes), 100)
    addNodeWithGroup2(transformPoint2(yokeUpperWidth/2, yokeBaseY + yokeBaseHeight, 2*i*pi/nYokes), 100)
    -- addNodeWithGroup2(transformPoint2(yokeUpperWidth/2, yokeBaseY + yokeBaseHeight + youkeUpperOuterHeight, 2*i*pi/nYokes), 100)
    addNodeWithGroup2(transformPoint2(yokeUpperWidth/2, sqrt((innerStatorRadius - airGap) ^ 2 - (yokeUpperWidth/2) ^ 2), 2*i*pi/nYokes), 100)
    -- create the nodes for the left side of the yoke
    addNodeWithGroup2(transformPoint2(-yokeBaseWidth/2, yokeBaseY, 2*i*pi/nYokes), 100)
    addNodeWithGroup2(transformPoint2(-yokeBaseWidth/2, yokeBaseY + yokeBaseHeight, 2*i*pi/nYokes), 100)
    addNodeWithGroup2(transformPoint2(- yokeUpperWidth/2, yokeBaseY + yokeBaseHeight, 2*i*pi/nYokes), 100)
    -- addNodeWithGroup2(transformPoint2(- yokeUpperWidth/2, yokeBaseY + yokeBaseHeight + youkeUpperOuterHeight, 2*i*pi/nYokes), 100)
    addNodeWithGroup2(transformPoint2(-yokeUpperWidth/2, sqrt((innerStatorRadius - airGap) ^ 2 - (yokeUpperWidth/2) ^ 2), 2*i*pi/nYokes), 100)
end

-- connect the nodes for the yoke
for i = 0, nYokes-1 do
    -- connect the nodes for the right side of the yoke
    rp1 = transformPoint2(yokeBaseWidth/2, yokeBaseY, 2*i*pi/nYokes)
    rp2 = transformPoint2(yokeBaseWidth/2, yokeBaseY + yokeBaseHeight, 2*i*pi/nYokes)
    rp3 = transformPoint2(yokeUpperWidth/2, yokeBaseY + yokeBaseHeight, 2*i*pi/nYokes)
    -- rp4 = transformPoint2(yokeUpperWidth/2, yokeBaseY + yokeBaseHeight + youkeUpperOuterHeight, 2*i*pi/nYokes)
    rp4 = transformPoint2(yokeUpperWidth/2, sqrt((innerStatorRadius - airGap) ^ 2 - (yokeUpperWidth/2) ^ 2), 2*i*pi/nYokes)
    addSegmentWithGroup2(rp1, rp2, 100)
    addSegmentWithGroup2(rp2, rp3, 100)
    addSegmentWithGroup2(rp3, rp4, 100)
    -- connect the nodes for the left side of the yoke
    lp1 = transformPoint2(-yokeBaseWidth/2, yokeBaseY, 2*i*pi/nYokes)
    lp2 = transformPoint2(-yokeBaseWidth/2, yokeBaseY + yokeBaseHeight, 2*i*pi/nYokes)
    lp3 = transformPoint2(- yokeUpperWidth/2, yokeBaseY + yokeBaseHeight, 2*i*pi/nYokes)
    -- lp4 = transformPoint2(- yokeUpperWidth/2, yokeBaseY + yokeBaseHeight + youkeUpperOuterHeight, 2*i*pi/nYokes)
    lp4 = transformPoint2(-yokeUpperWidth/2, sqrt((innerStatorRadius - airGap) ^ 2 - (yokeUpperWidth/2) ^ 2), 2*i*pi/nYokes)
    addSegmentWithGroup2(lp1, lp2, 100)
    addSegmentWithGroup2(lp2, lp3, 100)
    addSegmentWithGroup2(lp3, lp4, 100)

    -- connect remaining by arc
    -- calculate the angle of the arc
    arcAngle = 2 * (atan((yokeUpperWidth/2)/(sqrt((innerStatorRadius - airGap) ^ 2 - (yokeUpperWidth/2) ^ 2)))/pi) * 180
    addArcWithGroup2(rp4, lp4, arcAngle, 100)

end

-- create the field winding spaces
for i = 0, nYokes-1 do
    -- create the nodes for the right side of the yoke
    rp1 = transformPoint2(yokeBaseWidth/2 + padding, yokeBaseY + yokeBaseHeight - padding - FWHeight , 2*i*pi/nYokes)
    rp2 = transformPoint2(yokeBaseWidth/2 + padding + FWWidth, yokeBaseY + yokeBaseHeight - padding - FWHeight , 2*i*pi/nYokes)
    rp3 = transformPoint2(yokeBaseWidth/2 + padding + FWWidth, yokeBaseY + yokeBaseHeight - padding, 2*i*pi/nYokes)
    rp4 = transformPoint2(yokeBaseWidth/2 + padding, yokeBaseY + yokeBaseHeight - padding, 2*i*pi/nYokes)

    addNodeWithGroup2(rp1, 101)
    addNodeWithGroup2(rp2, 101)
    addNodeWithGroup2(rp3, 101)
    addNodeWithGroup2(rp4, 101)

    addSegmentWithGroup2(rp1, rp2, 101)
    addSegmentWithGroup2(rp2, rp3, 101)
    addSegmentWithGroup2(rp3, rp4, 101)
    addSegmentWithGroup2(rp4, rp1, 101)

    mi_addblocklabel((rp1[1] + rp3[1])/2, (rp1[2] + rp3[2])/2)
    mi_selectlabel((rp1[1] + rp3[1])/2, (rp1[2] + rp3[2])/2)
    -- if i is even then the windings are positive
    if i == 0 or i == 2 or i == 4 or i == 6 then
        mi_setblockprop("FW", 1, 0, "Rotor", 0, 101, rotorTurns)
    else
        mi_setblockprop("FW", 1, 0, "Rotor", 0, 101, -rotorTurns)
    end
    mi_clearselected()

    -- create the nodes for the left side of the yoke
    lp1 = transformPoint2(-yokeBaseWidth/2 - padding, yokeBaseY + yokeBaseHeight - padding - FWHeight , 2*i*pi/nYokes)
    lp2 = transformPoint2(-yokeBaseWidth/2 - padding - FWWidth, yokeBaseY + yokeBaseHeight - padding - FWHeight , 2*i*pi/nYokes)
    lp3 = transformPoint2(-yokeBaseWidth/2 - padding - FWWidth, yokeBaseY + yokeBaseHeight - padding, 2*i*pi/nYokes)
    lp4 = transformPoint2(-yokeBaseWidth/2 - padding, yokeBaseY + yokeBaseHeight - padding, 2*i*pi/nYokes)

    addNodeWithGroup2(lp1, 101)
    addNodeWithGroup2(lp2, 101)
    addNodeWithGroup2(lp3, 101)
    addNodeWithGroup2(lp4, 101)

    addSegmentWithGroup2(lp1, lp2, 101)
    addSegmentWithGroup2(lp2, lp3, 101)
    addSegmentWithGroup2(lp3, lp4, 101)
    addSegmentWithGroup2(lp4, lp1, 101)

    mi_addblocklabel((lp1[1] + lp3[1])/2, (lp1[2] + lp3[2])/2)
    mi_selectlabel((lp1[1] + lp3[1])/2, (lp1[2] + lp3[2])/2)
    -- if i is even then the windings are negative
    if i == 0 or i == 2 or i == 4 or i == 6 then
        mi_setblockprop("FW", 1, 0, "Rotor", 0, 101, -rotorTurns)
    else
        mi_setblockprop("FW", 1, 0, "Rotor", 0, 101, rotorTurns)
    end
    mi_clearselected()
    
end



-- add block labels
mi_addblocklabel(0, 0)
mi_selectlabel(0, 0)
mi_setblockprop("Air", 1, 0, "<None>", 0, 101, 0)
mi_clearselected()

mi_addblocklabel(sin(pi/nYokes) * 0.5 * outerDiameter + 1 , cos(pi/nYokes) * 0.5 * outerDiameter + 1 )
mi_selectlabel(sin(pi/nYokes) * 0.5 * outerDiameter + 1 , cos(pi/nYokes) * 0.5 * outerDiameter + 1 )
mi_setblockprop("Air", 1, 0, "<None>", 0, 101, 0)
mi_clearselected()

mi_addblocklabel(0, innerDiameter + (((outerDiameter / 2) - (innerDiameter / 2))/2))
mi_selectlabel(0, innerDiameter + (((outerDiameter / 2) - (innerDiameter / 2))/2))
mi_setblockprop("Amag-Steel", 1, 0, "<None>", 0, 100, 0)
mi_clearselected()

-- set current of Rotor circuit
mi_modifycircprop("Rotor", 1, rotorCurrent)

-- save file as ./iterations/innerDiameter/20/template.FEM
mi_saveas("./iterations/innerDiameter/20/template.FEM")

-- close femm window
quit()

