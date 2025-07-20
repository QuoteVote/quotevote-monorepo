import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Paper, Typography, List, ListItem } from '@mui/material';
import PropTypes from 'prop-types';
import { GET_LATEST_QUOTES } from '../../graphql/query';

export default function LatestQuotes({ limit = 5 }) {
  const [quotes, setQuotes] = useState([]);
  const { data } = useQuery(GET_LATEST_QUOTES, {
    variables: { limit },
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data && data.latestQuotes) {
      setQuotes((prev) => {
        const existingIds = prev.map((q) => q._id);
        const fresh = data.latestQuotes.filter((q) => !existingIds.includes(q._id));
        return [...fresh, ...prev];
      });
    }
  }, [data]);

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h6" gutterBottom>
        Latest Quotes
      </Typography>
      <List>
        {quotes.map((q) => (
          <ListItem key={q._id} style={{ display: 'block' }}>
            <Typography variant="body2">
              <strong>{q.user?.username}</strong>: {q.quote}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

LatestQuotes.propTypes = {
  limit: PropTypes.number,
};
