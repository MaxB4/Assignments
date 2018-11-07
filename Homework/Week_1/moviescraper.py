#!/usr/bin/env python
# Name: Max Baneke
# Student number: 10797564
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""
import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = './Homework/Week_1/movies.html'
OUTPUT_CSV = './Homework/Week_1/movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
   
    # get movie titles
    titles_list=[]
    for titles in dom.find_all("h3"):
        for titles in titles.find_all("a"):
            titles=titles.contents[0]
            titles_list.append(titles)
    
    
    # get movie ratings
    ratings_list=[]
    for ratings in dom.find_all("span", "value"):
        ratings=float(ratings.contents[0])
        ratings_list.append(ratings)
        
    # get years of release for movies
    years_list=[]
    for years in dom.find_all("h3"):
        for new_year in years.find_all("span", class_="lister-item-year text-muted unbold"):
            new_year=new_year.get_text()
            years_list.append(new_year[-5:-1])
            
    # get actors of movies
    actors_list=[]
    for movie_content in dom.find_all("div", class_='lister-item-content'):
        movie_actors_list=[]
        for actor in movie_content.find_all("a"):
            if "_st" in actor.get('href'):
                movie_actors_list.append(actor.get_text())
        actors_list.append(movie_actors_list)     
              
    # get runtime of movies 
    runtime_list=[]
    for runtime in dom.find_all('span', class_ = 'runtime'):
        runtime=runtime.get_text()
        runtime_list.append(runtime)
        runtime_list = [s.replace(' min', '') for s in runtime_list]
       
    
    return(titles_list,ratings_list,years_list,actors_list,runtime_list)

def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    columns = ['Title', 'Rating', 'Year', 'Actors', 'Runtime']
    writer.writerow(columns)
    
    title = movies[0]
    rating = movies[1]
    year = movies[2]
    actors = movies[3]
    runtime = movies[4]
        
    for row in range(50):
        writer.writerow([title[row], rating[row], year[row], actors[row], runtime[row]])
        
    
def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')
    
    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)