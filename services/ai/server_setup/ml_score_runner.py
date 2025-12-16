from flask import Flask
from graphene_flask import GraphQLView
from ml_score_api import create_schema
from flask_cors import CORS

app = Flask(__name__)
app.debug=True
app.config['CORS_ALLOW_HEADERS'] = "Content-Type"
app.config['CORS_RESOURCES'] = {r"/graphql/*": {"origins": "*"}}

cors = CORS(app)
schema = create_schema()
app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=False))

if __name__ == '__main__':
    app.run()