import pandas as pd

# global standards
INPUT ="GDPcountries.csv"

# read input and put in dataframe
df = pd.read_csv(INPUT)

# turn into JSON file
df.set_index("Country Name").to_json('GDPcountries.json', orient='index')

