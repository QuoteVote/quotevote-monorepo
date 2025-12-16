import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from server_setup.ml_score_api import create_schema

schema = create_schema()


def test_default_score():
    result = schema.execute("query { score { comment confidence significant } }")
    assert result.errors is None
    assert result.data["score"]["comment"] == "Reddit Comment"
    assert isinstance(result.data["score"]["confidence"], float)
    assert isinstance(result.data["score"]["significant"], bool)


def test_score_with_comment():
    text = "test comment"
    result = schema.execute(
        'query { score(redditComment: "%s") { comment confidence significant } }' % text
    )
    assert result.errors is None
    assert result.data["score"]["comment"] == text
    assert isinstance(result.data["score"]["confidence"], float)
    assert isinstance(result.data["score"]["significant"], bool)


def test_predict_reception():
    result = schema.execute(
        'query { predictReception(text: "great job") { upvoteRange agreementScore confidence } }'
    )
    assert result.errors is None
    assert "upvoteRange" in result.data["predictReception"]
    assert "agreementScore" in result.data["predictReception"]
    assert "confidence" in result.data["predictReception"]
