from flask import Flask
import sys,tweepy,csv,re
from textblob import TextBlob
from flask_cors import CORS

import json

def cleanTweet(tweet):
	return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t]) | (\w +:\ / \ / \S +)", " ", tweet).split())

app = Flask(__name__)
CORS(app)

@app.route('/<query>')
def index(query):
	consumer_key = ""
	consumer_secret = ""

	access_token = ""
	access_token_secret = ""

	auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
	auth.set_access_token(access_token, access_token_secret)

	api = tweepy.API(auth)

	fetched_tweets = api.search(q = query, count = 100)

	tosend = []
	polarity = 0
	positive = 0
	wpositive = 0
	spositive = 0
	negative = 0
	wnegative = 0
	snegative = 0
	neutral = 0


	for tweet in fetched_tweets:
		analysis = TextBlob(cleanTweet(tweet.text))
		polarity += analysis.sentiment.polarity
		if (analysis.sentiment.polarity == 0):  # adding reaction of how people are reacting to find average later
			neutral += 1
		elif (analysis.sentiment.polarity > 0 and analysis.sentiment.polarity <= 0.3):
			wpositive += 1
		elif (analysis.sentiment.polarity > 0.3 and analysis.sentiment.polarity <= 0.6):
			positive += 1
		elif (analysis.sentiment.polarity > 0.6 and analysis.sentiment.polarity <= 1):
			spositive += 1
		elif (analysis.sentiment.polarity > -0.3 and analysis.sentiment.polarity <= 0):
			wnegative += 1
		elif (analysis.sentiment.polarity > -0.6 and analysis.sentiment.polarity <= -0.3):
			negative += 1
		elif (analysis.sentiment.polarity > -1 and analysis.sentiment.polarity <= -0.6):
			snegative += 1
		tosend.append({"t": tweet.text, "a": analysis.sentiment.polarity})

	polarity = polarity / 100

	summary = {"polarity": polarity, "positive": positive, "wpositive": wpositive, "spositive": spositive, "negative": negative, "wnegative": wnegative, "snegative": snegative, "neutral": neutral}

	return json.dumps({'data': tosend, "summary": summary})

if __name__ == "__main__":
	app.run()