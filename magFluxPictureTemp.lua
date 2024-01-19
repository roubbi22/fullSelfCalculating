-- open the file

open("./iterations/yokeBaseWidth/1/template.fem")
-- run analysis on the mag flux picture
mi_analyze()

open("./iterations/yokeBaseWidth/1/template.ans")

mo_zoomnatural()
-- mo_zoomout()

-- generate the mag flux picture
mo_showdensityplot(1, 0, 2, 0, "bmag") 

mo_resize(1080, 720)

-- save the mag flux picture   
mo_savebitmap("./iterations/yokeBaseWidth/densityplots/1.png")

quit()