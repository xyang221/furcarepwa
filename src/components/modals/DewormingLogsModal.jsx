import React, { useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function DewormingLogsModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    pets,
    vets,
    pet,
    deworminglog,
    setDeworminglog,
    errors,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedLogs = { ...deworminglog, [fieldName]: value };
    setDeworminglog(updatedLogs);
  };

  const [date, setDate] = useState(new Date());

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {isUpdate ? "Update Deworming" : "Add Deworming"}
            <IconButton onClick={onClick} style={{ float: "right" }}>
              <Close color="primary"></Close>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {errors && (
              <Box>
                {Object.keys(errors).map((key) => (
                  <Alert severity="error" key={key}>
                    {errors[key][0]}
                  </Alert>
                ))}
              </Box>
            )}
            <form onSubmit={(e) => onSubmit(e)}>
              <Stack spacing={2} margin={2}>
              {!isUpdate && (
                    <TextField
                      label={`Deworming Price`}
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      value={deworminglog.unit_price || ""}
                      onChange={(ev) =>
                        handleFieldChange("unit_price", ev.target.value)
                      }
                      required
                    />
                  )}
                {isUpdate ? (
                  <TextField
                    variant="outlined"
                    id="Date"
                    label="Date"
                    value={deworminglog.date}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      readOnly: true,
                      "aria-readonly": true,
                    }}
                    required
                  />
                ) : (
                  <TextField
                    variant="outlined"
                    id="Date"
                    label="Date"
                    value={date.toLocaleDateString()}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      readOnly: true,
                      "aria-readonly": true,
                    }}
                    required
                  />
                )}

                {isUpdate ? (
                  <TextField
                    variant="outlined"
                    id="Pet"
                    label="Pet"
                    value={pet.name}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      readOnly: true,
                      "aria-readonly": true,
                    }}
                    required
                  />
                ) : (
                  <FormControl>
                    <InputLabel>Pet</InputLabel>
                    <Select
                      label="Pet"
                      value={deworminglog.pet_id || ""}
                      onChange={(ev) =>
                        handleFieldChange("pet_id", ev.target.value)
                      }
                      required
                    >
                      {pets.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <TextField
                  variant="outlined"
                  id="Weight"
                  label="Weight"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  value={deworminglog.weight || ""}
                  onChange={(ev) =>
                    handleFieldChange("weight", ev.target.value)
                  }
                  required
                />
                <TextField
                  variant="outlined"
                  id="Description"
                  label="Description"
                  value={deworminglog.description || ""}
                  onChange={(ev) =>
                    handleFieldChange("description", ev.target.value)
                  }
                />

                <FormControl>
                  <InputLabel>Veterinarian</InputLabel>
                  <Select
                    label="Veterinarian"
                    value={deworminglog.vet_id || ""}
                    onChange={(ev) =>
                      handleFieldChange("vet_id", ev.target.value)
                    }
                    required
                  >
                    {vets.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.fullname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Return"
                  variant="outlined"
                  id="Return"
                  type="date"
                  value={deworminglog.return || ``}
                  onChange={(ev) =>
                    handleFieldChange("return", ev.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                />

                <Button color="primary" variant="contained" type="submit">
                  Save
                </Button>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
