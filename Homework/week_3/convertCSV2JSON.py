import pandas as pd

# global standards
INPUT ='GGGDTAITA188N.csv'

# read input and put in dataframe
df = pd.read_csv(INPUT)

# turn into JSON file
df.set_index("DATE").to_json('JSON_file.json', orient='index')
