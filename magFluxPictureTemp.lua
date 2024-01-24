-- open the file

open("./iterations/outerDiameter/35/template.fem")
-- run analysis on the mag flux picture
mi_analyze()

open("./iterations/outerDiameter/35/template.ans")

mo_zoomnatural()
-- mo_zoomout()

-- generate the mag flux picture
mo_showdensityplot(1, 0, 2, 0, "bmag") 

mo_resize(1080, 720)

-- save the mag flux picture   
mo_savebitmap("./iterations/outerDiameter/densityplots/35.png")

quit()