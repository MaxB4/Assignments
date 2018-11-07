#!/usr/bin/env python
# Name: Max Baneke
# Student number: 10797564
"""
This script visualizes data obtained from a .csv file
"""
import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "./Homework/Week_1/movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

with open(INPUT_CSV, 'r') as csv_file:
    reader = csv.reader(csv_file, delimiter=',')
    next(reader)
    for row in reader:
        print(row)
        data_dict[row[2]].append(float(row[1]))
    
# calculate average rating of movies per year
average_rating=[]
for ratings in list(data_dict.values()):
    average_rating.append(round(sum(ratings)/len(ratings),1))

# plot average rating using line chart
plt.plot(list(data_dict),average_rating)
plt.title('Average rating per year')
plt.ylabel('IMDb rating')
plt.xlabel('Year')
plt.show()

if __name__ == "__main__":
    print(data_dict)