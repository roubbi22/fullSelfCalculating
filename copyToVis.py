# import openpyxl module
import openpyxl
from openpyxl.utils.dataframe import dataframe_to_rows
import pandas as pd

def insert_to_sheet(wb, sheet, df, start_row=1, start_col=1):
    M_elRows = list(dataframe_to_rows(df, index=False, header=True))
    for row_index, row_data in enumerate(M_elRows, start=start_row):
        for col_index, col_data in enumerate(row_data, start=1):
            # convert value to number if possible
            try:
                # replace "," with "." and convert to float
                # if it is a string
                if isinstance(col_data, str):
                    col_data = col_data.replace(",", ".")
                col_data = float(col_data)
            except ValueError:
                pass
            sheet.cell(row=row_index, column=col_index, value=col_data)

# open the file
wb=openpyxl.load_workbook('./analysis/Visualisation of calc results.xlsx')

# get the sheet
sheet=wb['M_el(φ,I)']

# get the data from M_el.csv

M_el=pd.read_csv('./analysis/M_el.csv',sep=';')
F_ump_amp=pd.read_csv('./analysis/F_ump_amp.csv',sep=';')
F_ump_phase=pd.read_csv('./analysis/F_ump_phase.csv',sep=';')
Psi_a=pd.read_csv('./analysis/Psi_a.csv',sep=';')
k_e_a=pd.read_csv('./analysis/k_e_a.csv',sep=';')
k_e_LL=pd.read_csv('./analysis/k_e_LL.csv',sep=';')

insert_to_sheet(wb, wb['M_el(φ,I)'], M_el, start_row=5, start_col=1)
insert_to_sheet(wb, wb['F_ump_amp(φ,I)'], F_ump_amp, start_row=5, start_col=1)
insert_to_sheet(wb, wb['F_ump_phase(φ,I)'], F_ump_phase, start_row=1, start_col=1)
insert_to_sheet(wb, wb['Ψ_a(φ,I)'], Psi_a, start_row=1, start_col=1)
insert_to_sheet(wb, wb['k_e_a(φ,I)'], k_e_a, start_row=8, start_col=7)
insert_to_sheet(wb, wb['k_e_LL(φ,I)'], k_e_LL, start_row=8, start_col=9)

# save as new file
wb.save('./analysis/Visualisation.xlsx')