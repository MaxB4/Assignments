#!/usr/bin/env python
# Name: Max Baneke
# Student number: 10797564
"""
This script scrapes something.
"""
import pandas as pd
import numpy as np
import csv
import matplotlib.pyplot as plt
import json

# global constants
INPUT ='input.csv'


def parse(file):
    # read input and put in dataframe
    df = pd.read_csv(file)
    return df


def preprocess(df):
    """
    Cleane and preprocess data
    """
    df['GDP ($ per capita) dollars'].replace(regex=True,inplace=True,to_replace=r'\D',value=r'')
    df['Region'] = df['Region'].str.strip()

    df['GDP ($ per capita) dollars'] = pd.to_numeric(df['GDP ($ per capita) dollars'], errors='coerce')
    df['Infant mortality (per 1000 births)'] = df['Infant mortality (per 1000 births)'].str.replace(",",".").astype(float)
    return df


def analyze(df):
    """
    Compute Central Tendency, Five Number Summary and visualize the data
    """    
    mean_GDP=df.loc[:,'GDP ($ per capita) dollars'].mean()
    
    median_GDP=df.loc[:,'GDP ($ per capita) dollars'].median()
    
    mode_GDP=df.loc[:,'GDP ($ per capita) dollars'].mode()[0]
    
    std_GDP=df.loc[:,'GDP ($ per capita) dollars'].std()
    
    # replace outliers by Nan
    df['GDP ($ per capita) dollars'].mask(df['GDP ($ per capita) dollars']>(mean_GDP + 3 * std_GDP), inplace=True)
    df['GDP ($ per capita) dollars'].mask(df['GDP ($ per capita) dollars']<(mean_GDP - 3 * std_GDP), inplace=True)

    # plot histogram of GDP
    df['GDP ($ per capita) dollars'].hist()
    plt.show()

    # five number summary of infant mortality
    summary_infant_mortality_column=df['Infant mortality (per 1000 births)'].describe()
    print(summary_infant_mortality_column)

    # show infant morality (per 1000 births)
    df.boxplot(column=['Infant mortality (per 1000 births)'])
    plt.show()

    return(df,median_GDP,mean_GDP,mode_GDP,std_GDP)


def present(df):
    """
    Save specific columns in JSON
    """
    adjusted_df = df.drop(df.columns[[2, 3, 5, 6, 9, 10, 11 ,12, 13, 14, 15, 16, 17, 18, 19]], axis=1)
    adjusted_df.set_index("Country").to_json('JSON_file.json', orient='index')

if __name__=="__main__":
    df=parse(INPUT)
    preprocess(df)
    df, mean_GDP, median_GDP, mode_GDP, std_GDP = analyze(df)
    print('mean GDP:', mean_GDP,'median GDP:', median_GDP,'mode GDP:', mode_GDP,'std GDP:', std_GDP)
    present(df)