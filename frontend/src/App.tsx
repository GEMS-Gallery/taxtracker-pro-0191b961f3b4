import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box, CircularProgress } from '@mui/material';
import DataTable from 'react-data-table-component';
import { backend } from 'declarations/backend';

type TaxPayer = {
  tid: bigint;
  firstName: string;
  lastName: string;
  address: string;
};

const App: React.FC = () => {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  const fetchTaxPayers = async () => {
    setLoading(true);
    try {
      const result = await backend.getAllTaxPayers();
      setTaxPayers(result);
    } catch (error) {
      console.error('Error fetching tax payers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const result = await backend.addTaxPayer(data.firstName, data.lastName, data.address);
      if ('ok' in result) {
        console.log('New TaxPayer added with TID:', result.ok);
        reset();
        fetchTaxPayers();
      } else {
        console.error('Error adding TaxPayer:', result.err);
      }
    } catch (error) {
      console.error('Error adding TaxPayer:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: 'TID',
      selector: (row: TaxPayer) => Number(row.tid),
      sortable: true,
    },
    {
      name: 'First Name',
      selector: (row: TaxPayer) => row.firstName,
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: (row: TaxPayer) => row.lastName,
      sortable: true,
    },
    {
      name: 'Address',
      selector: (row: TaxPayer) => row.address,
      sortable: true,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          TaxPayer Management System
        </Typography>
        <Box sx={{ mb: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{ required: 'First name is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={{ required: 'Last name is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: 'Address is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Add TaxPayer'}
            </Button>
          </form>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            TaxPayer Records
          </Typography>
          <DataTable
            columns={columns}
            data={taxPayers}
            pagination
            progressPending={loading}
            progressComponent={<CircularProgress />}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default App;
