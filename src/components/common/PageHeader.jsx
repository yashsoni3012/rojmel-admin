import { Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Button from './Button.jsx';
import Input from './Input.jsx';

export default function PageHeader({ title, subtitle, month, onMonth, onAdd, addLabel = 'Add entry', accent = '#3454D1' }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <Typography variant="h4">{title}</Typography>
        {subtitle && <Typography color="text.secondary">{subtitle}</Typography>}
      </div>
      <div className="flex items-center gap-2">
        {onMonth && <Input type="month" size="small" fullWidth={false} value={month} onChange={(e) => onMonth(e.target.value)} sx={{ background: '#fff', borderRadius: 3 }} />}
        {onAdd && (
          <Button startIcon={<AddIcon />} onClick={onAdd} sx={{ background: accent, '&:hover': { background: accent, filter: 'brightness(.92)' } }}>
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
