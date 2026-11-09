import { Typography } from '@mui/material';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';

export default function EmptyState({ title = 'Nothing here yet', text = 'Add your first entry to get started.' }) {
  return (
    <div className="py-14 flex flex-col items-center justify-center text-center">
      <div className="w-14 h-14 mb-3 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        <ReceiptLongRoundedIcon sx={{ fontSize: 30 }} />
      </div>
      <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1E293B', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" variant="body2" sx={{ maxWidth: 360 }}>
        {text}
      </Typography>
    </div>
  );
}
