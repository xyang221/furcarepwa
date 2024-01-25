import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Cancel, Check, Close, Event } from "@mui/icons-material";
// import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PetownerAppointmentModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    petowner,
    services,
    doctors,
    appointment,
    setAppointment,
    errors,
    isUpdate,
    selectedServices,
    setSelectedServices,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the appointment object and update the specified field
    const updatedAppointment = { ...appointment, [fieldName]: value };
    // Update the appointment object with the updated value
    setAppointment(updatedAppointment);
  };

  const isMobile = useMediaQuery("(max-width:600px)");

  const [withRemarks, setWithremarks] = useState(false);

  const handleRemarksChange = (event) => {
    setWithremarks(event.target.checked);
    if (!event.target.checked) {
      // Clear remarks if the checkbox is unchecked
      handleFieldChange("remarks", "");
    }
  };

  useEffect(() => {
    // Check if appointment remarks are empty and update withRemarks accordingly
    setWithremarks(!!appointment.remarks);
  }, [appointment.remarks]);

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {isUpdate ? "Update Appointment" : "Create Appointment"}
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
                {isUpdate && (
                  <TextField
                    variant="outlined"
                    id="Status"
                    label="Status"
                    value={appointment.status}
                    onChange={(ev) =>
                      handleFieldChange("status", ev.target.value)
                    }
                    InputProps={{
                      readOnly: true,
                      "aria-readonly": true,
                    }}
                  />
                )}

                <TextField
                  label="Date and Time"
                  variant="outlined"
                  id="Date"
                  type="datetime-local"
                  value={appointment.date || ""}
                  onChange={(ev) => handleFieldChange("date", ev.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min:
                      new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0] + "T00:00",
                  }}
                  required
                />

                <FormControl sx={{ m: 1, width: "100%" }}>
                  <InputLabel>Select Services</InputLabel>
                  <Select
                    fullWidth
                    required
                    multiple
                    value={selectedServices}
                    onChange={(e) => setSelectedServices(e.target.value)}
                    input={<OutlinedInput label="Multiple Select" />}
                    renderValue={(selected) => (
                      <Stack gap={1} direction="row" flexWrap="wrap">
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={
                              services.find((service) => service.id === value)
                                ?.service || ""
                            }
                            onDelete={() =>
                              setSelectedServices(
                                selectedServices.filter(
                                  (item) => item !== value
                                )
                              )
                            }
                            deleteIcon={
                              <Cancel
                                onMouseDown={(event) => event.stopPropagation()}
                              />
                            }
                          />
                        ))}
                      </Stack>
                    )}
                  >
                    {services.map((name, index) => [
                      (index === 0 ||
                        name.category.category !==
                          services[index - 1].category.category) && (
                        <ListSubheader
                          key={`subheader-${name.category.category}`}
                        >
                          {name.category.category}
                        </ListSubheader>
                      ),
                      <MenuItem
                        key={name.id}
                        value={name.id}
                        sx={{ ml: 5, justifyContent: "space-between" }}
                        disabled={name.isAvailable === 0}
                      >
                        {name.service}
                        {selectedServices.includes(name) ? (
                          <Check color="info" />
                        ) : null}
                      </MenuItem>,
                    ])}
                  </Select>
                </FormControl>

                <TextField
                  variant="outlined"
                  id="Purpose"
                  label="Purpose"
                  value={appointment.purpose || ""}
                  onChange={(ev) =>
                    handleFieldChange("purpose", ev.target.value)
                  }
                  required
                />

                <FormControl>
                  <InputLabel>Veterinarian</InputLabel>
                  <Select
                    label="Veterinarian"
                    value={appointment.vet_id || ""}
                    onChange={(ev) =>
                      handleFieldChange("vet_id", ev.target.value)
                    }
                    required
                  >
                    {doctors.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.fullname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={withRemarks}
                      onChange={handleRemarksChange}
                    />
                  }
                  label="Remarks"
                />

                {withRemarks && (
                  <TextField
                    variant="outlined"
                    id="Remarks"
                    label="Remarks"
                    multiline
                    rows={2}
                    value={appointment.remarks || ""}
                    onChange={(ev) =>
                      handleFieldChange("remarks", ev.target.value)
                    }
                  />
                )}

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
