import { Paper, Typography } from '@mui/material';

export default function StatCard({ label, value, color, icon, hint }) {
  return (
    <Paper className="p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl grid place-items-center shrink-0" style={{ background: color + '1A', color }}>
        {icon}
      </div>
      <div className="min-w-0">
        <Typography variant="body2" color="text.secondary" fontWeight={600}>{label}</Typography>
        <Typography variant="h5" fontWeight={800} noWrap>{value}</Typography>
        {hint && <Typography variant="caption" color="text.secondary">{hint}</Typography>}
      </div>
    </Paper>
  );
}
