import { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Button from './Button.jsx';
import Input from './Input.jsx';
import { today } from '../../utils.js';

const blank = (category) => ({ date: today(), category, amount: '', note: '', liters: '', pricePerL: '', km: '' });

export default function EntryDialog({ open, onClose, onSave, type, categories, fixedCategory, initial }) {
  const [f, setF] = useState(blank(fixedCategory || categories[0]));
  useEffect(() => {
    if (open) setF(initial ? { ...blank(initial.category), ...initial } : blank(fixedCategory || categories[0]));
  }, [open, initial, fixedCategory, categories]);

  const set = (k) => (e) => {
    const v = e.target.value;
    setF((p) => {
      const n = { ...p, [k]: v };
      if ((k === 'liters' || k === 'pricePerL') && n.liters && n.pricePerL) n.amount = +(n.liters * n.pricePerL).toFixed(2);
      return n;
    });
  };
  const valid = f.date && Number(f.amount) > 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle fontWeight={800}>{initial ? 'Edit entry' : 'Add entry'}</DialogTitle>
      <DialogContent>
        <div className="space-y-4 pt-2">
          <Input label="Date" type="date" value={f.date} onChange={set('date')} />
          <Input label="Category" options={categories} value={f.category} onChange={set('category')} disabled={!!fixedCategory} />
          {f.category === 'Petrol' && (
            <div className="grid grid-cols-3 gap-2">
              <Input label="Litres" type="number" value={f.liters} onChange={set('liters')} />
              <Input label="₹ / litre" type="number" value={f.pricePerL} onChange={set('pricePerL')} />
              <Input label="Odometer km" type="number" value={f.km} onChange={set('km')} />
            </div>
          )}
          <Input label="Amount (₹)" type="number" value={f.amount} onChange={set('amount')} />
          <Input label="Note" multiline minRows={2} value={f.note} onChange={set('note')} />
        </div>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="text" color="inherit" onClick={onClose}>Cancel</Button>
        <Button disabled={!valid} onClick={() => { onSave({ ...f, type, amount: Number(f.amount) }); onClose(); }}>Save entry</Button>
      </DialogActions>
    </Dialog>
  );
}
