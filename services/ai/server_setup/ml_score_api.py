from pathlib import Path
import pickle

import numpy as np
import spacy
import torch
import graphene as gql

from ml_model_training.ml_model import RedditTransformerPredictor

# Simple keyword heuristics for truthiness and popularity
FALSE_KEYWORDS = {"fake", "false", "misinformation", "wrong", "lie", "hoax"}
POSITIVE_KEYWORDS = {"good", "great", "excellent", "love", "like", "amazing"}
NEGATIVE_KEYWORDS = {"bad", "terrible", "hate", "awful", "dislike"}

DATASET_SIZE = 500
MIN_SIGNIFICANT_SIZE = 1000


class Score(gql.ObjectType):
    comment = gql.String(default_value="Reddit Comment")
    confidence = gql.Float(default_value=0)
    significant = gql.Boolean(default_value=False)


class Reception(gql.ObjectType):
    upvote_range = gql.String()
    agreement_score = gql.Float()
    confidence = gql.Float()


def create_schema():
    """Load models and return a GraphQL schema."""
    nlp = spacy.load("en_core_web_sm")
    model = RedditTransformerPredictor(
        vocab_length=15137,
        max_length=300,
        vocab_dim=100,
        dropout=[0.25, 0.25, 0.25, 0.25, 0.25],
    )
    model.load_state_dict(
        torch.load(
            Path("ml_model_training/model_load/transformer/reddit_transformer_predictor.pth").resolve(),
            map_location=torch.device("cpu"),
        )
    )
    model.eval()

    word_vector_model = pickle.load(
        open(
            Path("ml_model_training/model_load/transformer/model_vocab.pkl").resolve(),
            "rb",
        )
    )
    word_vector_model = {key.lower(): word_vector_model[key] for key in word_vector_model}

    def ml_predict(comment: str) -> float:
        np.random.seed(100)
        torch.manual_seed(100)

        parsed_comment = nlp(comment)

        comment_vec = [
            word_vector_model[tok.lemma_.lower()] if tok.lemma_.lower() in word_vector_model else 1
            for tok in parsed_comment
        ]

        comment_vec = torch.LongTensor(
            [
                np.pad(data, (0, 300 - len(data)), "constant", constant_values=0)
                for data in [comment_vec]
            ]
        )

        model_prediction = model.predict(comment_vec).item()
        prediction = float(np.round(model_prediction, 0))
        return prediction

    def predict_truth(comment: str) -> float:
        text = comment.lower()
        hits = sum(1 for w in FALSE_KEYWORDS if w in text)
        score = max(0.0, 1.0 - 0.2 * hits)
        return score

    def predict_like(comment: str) -> float:
        text = comment.lower()
        pos = sum(1 for w in POSITIVE_KEYWORDS if w in text)
        neg = sum(1 for w in NEGATIVE_KEYWORDS if w in text)
        score = 0.5 + 0.1 * (pos - neg)
        return min(max(score, 0.0), 1.0)

    def upvote_range(score: float) -> str:
        if score < 0.3:
            return "0-5"
        if score < 0.6:
            return "5-10"
        return "10+"

    class Query(gql.ObjectType):
        score = gql.Field(Score, args={"reddit_comment": gql.String()})
        predict_reception = gql.Field( Reception, args={"text": gql.String()} )

        def resolve_score(parent, info, reddit_comment: str = "Reddit Comment"):
            if reddit_comment == "Reddit Comment":
                return Score(significant=DATASET_SIZE >= MIN_SIGNIFICANT_SIZE)
            prediction = ml_predict(reddit_comment)
            return Score(
                comment=reddit_comment,
                confidence=prediction,
                significant=DATASET_SIZE >= MIN_SIGNIFICANT_SIZE,
            )

        def resolve_predict_reception(parent, info, text: str):
            truth = predict_truth(text)
            like = predict_like(text)
            return Reception(
                upvote_range=upvote_range(like),
                agreement_score=truth,
                confidence= like if like < truth else truth,
            )

    return gql.Schema(query=Query)

