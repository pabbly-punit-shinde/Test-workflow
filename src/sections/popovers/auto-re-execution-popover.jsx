import { useTheme } from '@emotion/react';
import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import {
  Alert,
  Divider,
  Snackbar,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  DialogContent,
  FormControlLabel,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

export function AutoReExecutionSettingsPopover({
  title,
  content,
  action,
  open,
  onClose,
  ...other
}) {
  const theme = useTheme();
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'));
  const dialog = useBoolean();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [categorylist, setCategorytList] = useState('1 attempt(s)');
  const handleChangeCategoryList = useCallback((event) => {
    setCategorytList(event.target.value);
  }, []);

  const CATEGORYLISTS = [
    { value: '0 (disable auto re-execution)', label: '0 (disable auto re-execution)' },
    { value: '1 attempt(s)', label: '1 attempt(s)' },
    { value: '2 attempt(s)', label: '2 attempt(s)' },
    { value: '3 attempt(s)', label: '3 attempt(s)' },
    { value: '4 attempt(s)', label: '4 attempt(s)' },
    { value: '5 attempt(s)', label: '5 attempt(s)' },
  ];

  const handleAdd = () => {
    setSnackbarOpen(true);

    setTimeout(() => {
      onClose();
    }, 500);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        {...other}
        PaperProps={isWeb ? { style: { minWidth: '600px' } } : { style: { minWidth: '330px' } }}
      >
        <DialogTitle
          sx={{ fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}
          onClick={dialog.onFalse}
        >
          Auto Re-Execution Settings{' '}
          <Iconify
            onClick={onClose}
            icon="uil:times"
            style={{ width: 20, height: 20, cursor: 'pointer', color: '#637381' }}
          />
        </DialogTitle>
        <Divider sx={{ mb: '16px', borderStyle: 'dashed' }} />
        <DialogContent>
          <Typography fontSize={14} fontWeight={600} mb="8px" ml="13px">
            Select Auto Re-Execution Attempts
          </Typography>
          <FormControlLabel
            control={
              <TextField
                sx={{ width: '100%' }}
                id="select-currency-label-x"
                variant="outlined"
                select
                fullWidth
                value={categorylist}
                onChange={handleChangeCategoryList}
                helperText="Select how many times a task should retry automatically if it fails."
                InputLabelProps={{ htmlFor: `outlined-select-currency-label` }}
                inputProps={{ id: `outlined-select-currency-label` }}
              >
                {CATEGORYLISTS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            }
            sx={{ width: '100%', mr: 0, ml: 0 }}
          />
        </DialogContent>
        <DialogActions>
          {action}
          <Button onClick={onClose} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          boxShadow: '0px 8px 16px 0px rgba(145, 158, 171, 0.16)',
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            width: '100%',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          Contact List Added Successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
