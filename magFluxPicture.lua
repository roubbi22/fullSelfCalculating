-- open the file

open("root/parameterValue/template.fem")
-- run analysis on the mag flux picture
mi_analyze()

open("root/parameterValue/template.ans")

mo_zoomnatural()
-- mo_zoomout()

-- generate the mag flux picture
mo_showdensityplot(1, 0, 2, 0, "bmag") 

mo_resize(1080, 720)

-- save the mag flux picture   
mo_savebitmap("root/densityplots/parameterValue.png")

quit()