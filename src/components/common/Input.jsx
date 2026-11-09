import { MenuItem, TextField } from '@mui/material';

// Text, number, date, password and select (pass `options`) in one component.
export default function Input({ options, ...props }) {
  const shrink = ['date', 'month'].includes(props.type) ? { shrink: true } : undefined;
  return (
    <TextField fullWidth select={!!options} InputLabelProps={shrink} {...props}>
      {options?.map((o) => {
        const value = o.value ?? o;
        return <MenuItem key={value} value={value}>{o.label ?? o}</MenuItem>;
      })}
    </TextField>
  );
}
