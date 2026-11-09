import { Switch as MuiSwitch, Typography } from '@mui/material';

export default function Switch({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <Typography fontWeight={700}>{label}</Typography>
        {hint && <Typography variant="body2" color="text.secondary">{hint}</Typography>}
      </div>
      <MuiSwitch checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </div>
  );
}
