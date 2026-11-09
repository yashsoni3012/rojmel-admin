import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import Button from '../components/common/Button.jsx';

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center text-center p-6">
      <div>
        <Typography variant="h2" fontWeight={800}>404</Typography>
        <Typography color="text.secondary" mb={3}>This page does not exist.</Typography>
        <Button component={Link} to="/">Back to dashboard</Button>
      </div>
    </div>
  );
}
