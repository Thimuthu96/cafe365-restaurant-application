import React from 'react'
import {
    Grid,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
} from "@mui/material";

const Filter = ({ filters, values, onChange, onSearch }) => {
    return (
        <Grid container spacing={2}>
            <Grid
                item xs={12}
                sx={{
                    backgroundColor: '#0E9E52',
                    borderRadius: '5px 5px 0 0',
                    textAlign: 'center',
                    color: '#fff',
                    pb: 1.5
                }}
            >
                <Typography variant="subtitle1">Filter Options</Typography>
            </Grid>
            {filters.map(({ key, label, options, type, name }) => {
                if (type === "date") {
                    return (
                        <Grid key={key} item md={12} xs={6} mt={2}>
                            <TextField
                                type={type}
                                variant="standard"
                                //value={values[name]}
                                name={name}
                                label={label}
                                //onChange={onChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    );
                }

                if (type === "select") {
                    return (
                        <Grid key={key} item md={12} xs={6} mt={2}>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel>{label}</InputLabel>
                                <Select
                                    name={name}
                                    label={label}
                                //value={values[name]}
                                //onChange={onChange}
                                >
                                    {options.map((item) => (
                                        <MenuItem value={item.value}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    );
                }
                else {
                    return (
                        <Grid key={key} item md={12} xs={6}>
                            <TextField
                                type={type}
                                //value={values[name]}
                                variant="standard"
                                name={name}
                                label={label}
                                color='success'
                                //onChange={onChange}
                                fullWidth
                            />
                        </Grid>
                    );
                }
            })}
            <Grid item md={12} xs={6}>
                <div>
                    <Button variant="text" fullWidth color='success'>Search</Button>
                </div>
            </Grid>
        </Grid>
    )
}

export default Filter