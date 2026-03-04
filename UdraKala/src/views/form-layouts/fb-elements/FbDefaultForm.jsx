import React from "react";

import {

  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  RadioGroup,
  Radio,
  FormControl,
  MenuItem,
} from "@mui/material";
import BaseCard from "../../../components/BaseCard/BaseCard";

const numbers = [
  {
    value: "one",
    label: "One",
  },
  {
    value: "two",
    label: "Two",
  },
  {
    value: "three",
    label: "Three",
  },
  {
    value: "four",
    label: "Four",
  },
];

const FbDefaultForm = () => {
  const [state, setState] = React.useState({
    checkedA: false,
    checkedB: false,
    checkedC: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [value, setValue] = React.useState("");

  const handleChange2 = (event) => {
    setValue(event.target.value);
  };

  const [number, setNumber] = React.useState("");

  const handleChange3 = (event) => {
    setNumber(event.target.value);
  };

  return (
    <div>
      {/* ------------------------------------------------------------------------------------------------ */}
      {/* Basic Checkbox */}
      {/* ------------------------------------------------------------------------------------------------ */}
      <BaseCard title="Edit Seller Profile">
        <form>
          <TextField
            id="default-value"
            label="Full Name"
            variant="outlined"
            defaultValue="Aditya Prasad Swain"
            fullWidth
            sx={{
              mb: 3,
            }}
          />
          <TextField
            id="email-text"
            label="Business Email"
            type="email"
            variant="outlined"
            fullWidth
            sx={{
              mb: 3,
            }}
          />
          <TextField
            id="outlined-password-input"
            label="Current Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            fullWidth
            sx={{
              mb: 3,
            }}
          />
          <TextField
            id="outlined-multiline-static"
            label="Business Description"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            sx={{
              mb: 3,
            }}
          />
          <TextField
            id="readonly-text"
            label="Seller ID (Read Only)"
            defaultValue="UK-SELLER-2026-X89"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            fullWidth
            sx={{
              mb: 3,
            }}
          />
          <Grid
            container
            spacing={0}
            sx={{
              mb: 3,
            }}
          >
            <Grid item xs={12} lg={4} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.checkedA}
                    onChange={handleChange}
                    name="checkedA"
                    color="primary"
                  />
                }
                label="Enable Notifications"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.checkedB}
                    onChange={handleChange}
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Show in Discovery"
              />
            </Grid>
            <Grid item xs={12} lg={4} md={6}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="visibility"
                  name="visibility"
                  value={value}
                  onChange={handleChange2}
                >
                  <FormControlLabel
                    value="public"
                    control={<Radio />}
                    label="Public Profile"
                  />
                  <FormControlLabel
                    value="private"
                    control={<Radio />}
                    label="Private Profile"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <TextField
            fullWidth
            id="standard-select-number"
            variant="outlined"
            select
            label="Experience Level"
            value={number}
            onChange={handleChange3}
            sx={{
              mb: 4,
            }}
          >
            {numbers.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="primary" variant="contained" size="large" sx={{ px: 4 }}>
              Save Changes
            </Button>
            <Button color="inherit" variant="outlined" size="large" sx={{ px: 4 }}>
              Cancel
            </Button>
          </Box>
        </form>
      </BaseCard>
    </div>
  );
};

export default FbDefaultForm;
