import openpyxl 
from openpyxl.utils.dataframe import dataframe_to_rows
import pandas as pd
import os
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors

df = pd.read_json('calcOrder.json')
df.columns = ['calcOrder']

sources = []

for index, row in df.iterrows():
    # split the string into a list
    calcOrder = row['calcOrder'].split('/')
    sources.append([ row['calcOrder'], calcOrder[2], calcOrder[3]])

csvFiles = ['M_el.csv', 'F_ump_amp.csv', 'F_ump_phase.csv', 'k_e_a.csv', 'k_e_LL.csv', 'Psi_a.csv']

csvFilesWithParams = [
    {
        'csvFile': 'M_el.csv',
        'title' : 'Torque M_el as a function of the rotor angle phi',
        'xLabel': 'Rotor angle phi in °',
        'yLabel': 'Torque M_el in Nm',
    },
    {
        'csvFile': 'F_ump_amp.csv',
        'title' : 'Amplitude of the ump force F_ump_amp as a function of the rotor angle phi',
        'xLabel': 'Rotor angle phi in °',
        'yLabel': 'Ump force F_ump_amp in N',
    },
    {
        'csvFile': 'F_ump_phase.csv',
        'title' : 'Phase of the ump force F_ump_phase as a function of the rotor angle phi',
        'xLabel': 'Rotor angle phi in °',
        'yLabel': 'Argument (phase angle) of the ump force F_ump_phase in °',
    },
    {
        'csvFile': 'k_e_a.csv',
        'title' : 'Phase voltage factor k_e_a as function of the rotor angle phi',
        'xLabel': 'Rotor angle phi in °',
        'yLabel': 'Voltage factor k_e_a in V*s/rad',
    },
    {
        'csvFile': 'k_e_LL.csv',
        'title' : 'Phase voltage U_a (in D-connection) and line ´-to-line-voltage U_B (in Y-connection) at the specified speed n as function of the rotor angle phi',
        'xLabel': 'Rotor angle phi in °',
        'yLabel': 'U_a and U_ll at speed n in V',
    },
    {
        'csvFile': 'Psi_a.csv',
        'title' : 'Pahase flux linkage psi_a as a function of the rotor angle phi',
        'xLabel': 'Rotor angle phi in °',
        'yLabel': 'Phase flux linkage psi_a in Wb',
    },
]

# check if directory ./iterations/comparisonGraphs exists
# if not, create it
if not os.path.exists('./iterations/comparisonGraphs'):
    os.makedirs('./iterations/comparisonGraphs')

wb = openpyxl.Workbook()

for csvFile in enumerate(csvFilesWithParams):
    # create a new sheet for each csv file
    print(csvFile[1].get('csvFile'))
    ws = wb.create_sheet(csvFile[1].get('csvFile'))
    df = pd.DataFrame()
    for index, source in enumerate(sources):
        print(source[0], source[1], source[2], csvFile[1])
        csv_data = pd.read_csv(source[0] + '/' + csvFile[1].get('csvFile'), sep=';')
        # replace all commas with dots
        csv_data = csv_data.replace(',','.', regex=True)
        
        # convert all entries to float values if possible
        csv_data = csv_data.apply(pd.to_numeric, errors='ignore')

        if(index == 0):
            # append the first column to the dataframe
            df = csv_data.iloc[:, [0]]
        csv_data = csv_data.iloc[:, [-1]]

        # append the csv_data to the dataframe and name it after the source
        csv_data.columns = [source[1] + '_' + source[2]]
        df = pd.concat([df, csv_data], axis=1)

    # using matplotlib to plot the data
        # for plots with the same prefix, use the same hue
    plt.figure()
    plt.title(csvFile[1].get('title'))
    plt.xlabel(csvFile[1].get('xLabel'))
    plt.ylabel(csvFile[1].get('yLabel'))
    plt.grid(True)
    print(df.columns.values.tolist())
    pervPrefix = ''
    prevHue = 0
    prevBrightness = 0
    prevSaturation = 0
    for column in df.columns.values.tolist()[1:]:
        if column.split('_')[0] != pervPrefix:
            # plot the data with a new hue
            prevHue = (prevHue + 120)%360
            pervPrefix = column.split('_')[0]
            prevBrightness = 1
            prevSaturation = 1
            plt.plot(df.iloc[:, 0], df[column], label=column, color=mcolors.hsv_to_rgb((prevHue/360, prevSaturation, prevBrightness)))
        else:
            # plot the data with the same hue but a different saturation and brightness
            prevBrightness *= 0.7
            prevSaturation *= 0.9
            plt.plot(df.iloc[:, 0], df[column], label=column, color=mcolors.hsv_to_rgb((prevHue/360, prevSaturation, prevBrightness)))
    plt.legend()
    # set the size of the plot to 1920x1080
    # plt.savefig('./iterations/comparisonGraphs/' + csvFile[1].get('csvFile') + '.png')
    plt.savefig('./iterations/comparisonGraphs/' + csvFile[1].get('csvFile') + '.png', dpi=300)
    plt.close()

    for r in dataframe_to_rows(df, index=False, header=True):
        ws.append(r)

del wb['Sheet']
wb.save('./iterations/comparison.xlsx')