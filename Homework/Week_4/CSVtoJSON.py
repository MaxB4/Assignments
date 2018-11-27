import pandas as pd

# global standards
INPUT ="LTRUCKSA.csv"

# read input and put in dataframe
df = pd.read_csv(INPUT)

# turn into JSON file
df.set_index("DATE").to_json('carsales.json', orient='index')

