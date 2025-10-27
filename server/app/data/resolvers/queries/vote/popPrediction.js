import axios from 'axios';

export const popPrediction = (pubsub) => {
  return async (_, args) => {
    try {
      const { comment } = args;
      const dataParams = JSON.stringify({
        query: ` query score($comment: String!) {
                \n  score(redditComment: $comment) {
                \n    comment
                \n    confidence
                \n    label
                \n  }
            \n}
        \n`,
        variables: { comment },
      });

      const config = {
        method: 'get',
        url: 'https://tranquil-reaches-15918.herokuapp.com/graphql',
        headers: {
          'Content-Type': 'application/json',
        },
        data: dataParams,
      };

      const { data } = await axios(config);
      console.log({ data });

      return data && data.data;
    } catch (err) {
      throw new Error(err);
    }
  };
};
