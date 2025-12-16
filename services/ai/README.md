# Reddit Comment Predictor

## Description

A basic text classifier that will predict what range of points a piece of text would receive, if posted as a comment on Reddit.
This model is close enough to our use case that we believe, trained on Scoreboard data, it would be able to meet our business requirements for the text sentiment prediction feature.
It is trained based on an open access to Reddit comment data hosted on Google's BigQuery Server.

**Note**: The training dataset currently contains only 500 samples, so predictions may not be statistically reliable. The GraphQL API reports this via the `significant` flag.

## Acknowledgements

| Contributer | Contribution |
| --- | --- |
| Brahmananda Reddy |  providing proof of concept for model functionality |
| David Nicholson |  providing deployment code for the machine learning model |

## How to Query

The current dev host is https://tranquil-reaches-15918.herokuapp.com/graphql

It uses GraphQl so the query will look like this:

```
query{
  score(redditComment:"Insert query string here"){
     comment
     confidence
     significant
  }
}
```

* `redditComment`: Here you will add your sentence(s) to get a score.
* `comment`: returns the input text.
* `confidence`: returns the confidence score for the input text.
* `significant`: whether the prediction is statistically relevant based on the training dataset size (500 samples).

The response will look like:

```
{
    "data": {
        "score": {
            "comment": "Insert query string here",
            "confidence": 0.48202717304229736,
            "significant": false
        }
    }
}
```

## Predict Reception

You can also estimate how a piece of text might be received on Quote.Vote using the `predictReception` query:

```
query {
  predictReception(text: "Insert text here") {
    upvoteRange
    agreementScore
    confidence
  }
}
```

The server uses a simple heuristic model to guess whether the text is truthful and popular. The `upvoteRange` gives a broad estimate of potential likes, `agreementScore` is a value between 0 and 1 indicating perceived truthfulness, and `confidence` reflects the lower of the truthfulness and popularity scores.

