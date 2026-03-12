import { useState } from "react";
import { Diagnosis, EntryFormValues } from "../../types";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";

type Props = {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
  diagnoses: Diagnosis[];
};

const initialFormValues: EntryFormValues = {
  type: "Hospital",
  date: "",
  specialist: "",
  description: "",
  // diagnosisCodes: [],
  // discharge: { date: "", criteria: "" },
};

const AddEntryForm = ({ onSubmit, onCancel, diagnoses }: Props) => {
  const [entryForm, setEntryForm] =
    useState<EntryFormValues>(initialFormValues);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string[]>,
  ) => {
    const { name, value } = e.target;
    console.log(e.target);

    setEntryForm((prev) => {
      if (name === "healthCheckRating") {
        return { ...prev, [name]: Number(value) };
      }
      if (name === "type") {
        return {
          ...initialFormValues,
          date: prev.date,
          specialist: prev.specialist,
          description: prev.description,
          diagnosisCodes: prev.diagnosisCodes,
          type: value as EntryFormValues["type"],
        } as EntryFormValues;
      }
      return { ...prev, [name]: value } as EntryFormValues;
    });
  };

  const handleDischargeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEntryForm((prev) => {
      if (prev.type === "Hospital") {
        return {
          ...prev,
          discharge: {
            date: "",
            criteria: "",
            ...prev.discharge,
            [name]: value,
          },
        };
      }
      return prev;
    });
  };

  const handleSickLeaveChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEntryForm((prev) => {
      if (prev.type !== "OccupationalHealthcare") return prev;
      return {
        ...prev,
        sickLeave: {
          startDate: "",
          endDate: "",
          ...prev.sickLeave,
          [name]: value,
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      let cleaned: EntryFormValues = { ...entryForm };

      if (
        "diagnosisCodes" in cleaned &&
        (!cleaned.diagnosisCodes || cleaned.diagnosisCodes.length === 0)
      ) {
        const { diagnosisCodes: _diagnosisCodes, ...rest } = cleaned;
        cleaned = { ...rest } as EntryFormValues;
      }

      if (cleaned.type === "Hospital") {
        if (!cleaned.discharge?.date && !cleaned.discharge?.criteria) {
          const { discharge: _discharge, ...rest } = cleaned;
          cleaned = { ...rest, type: "Hospital" };
        }
      }

      if (cleaned.type === "OccupationalHealthcare") {
        if (!cleaned.sickLeave?.startDate && !cleaned.sickLeave?.endDate) {
          const { sickLeave: _sickLeave, ...rest } = cleaned;
          cleaned = { ...rest, type: "OccupationalHealthcare" };
        }
      }

      await onSubmit(cleaned);
      setEntryForm(initialFormValues);
    } catch {
      // re-thrown by parent
      console.error("Entry submission failed", e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Stack spacing={1}>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <RadioGroup
              name="type"
              value={entryForm.type}
              onChange={handleChange}
              defaultValue="Hospital"
            >
              <FormControlLabel
                control={<Radio />}
                label="Hospital"
                value="Hospital"
              />
              <FormControlLabel
                control={<Radio />}
                label="Occupational Healthcare"
                value="OccupationalHealthcare"
              />
              <FormControlLabel
                control={<Radio />}
                label="HealthCheck"
                value="HealthCheck"
              />
            </RadioGroup>
          </FormControl>
          <TextField
            name="date"
            label="Date"
            type="date"
            fullWidth
            value={entryForm.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          ></TextField>
          <TextField
            name="specialist"
            label="Specialist"
            fullWidth
            value={entryForm.specialist}
            onChange={handleChange}
            required
          ></TextField>
          <TextField
            name="description"
            label="Description"
            fullWidth
            value={entryForm.description}
            onChange={handleChange}
            required
          ></TextField>
          <FormControl fullWidth>
            <FormLabel>Diagnosis Codes</FormLabel>
            <Select
              name="diagnosisCodes"
              multiple
              fullWidth
              value={entryForm.diagnosisCodes || []}
              onChange={handleChange}
            >
              {diagnoses.map((d) => {
                return (
                  <MenuItem
                    key={d.code}
                    value={d.code}
                  >{`${d.code}: ${d.name}`}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {entryForm.type === "Hospital" && (
            <>
              <TextField
                name="date"
                label="Discharge Date"
                type="date"
                //   fullWidth
                value={entryForm.discharge?.date || ""}
                onChange={handleDischargeChange}
                InputLabelProps={{ shrink: true }}
              ></TextField>
              <TextField
                name="criteria"
                label="Discharge Criteria"
                fullWidth
                value={entryForm.discharge?.criteria || ""}
                onChange={handleDischargeChange}
              ></TextField>
            </>
          )}

          {entryForm.type === "HealthCheck" && (
            <>
              <FormControl>
                <FormLabel>Health Check Rating</FormLabel>
                <RadioGroup
                  name="healthCheckRating"
                  value={entryForm.healthCheckRating || 0}
                  onChange={handleChange}
                  defaultValue={0}
                >
                  <FormControlLabel
                    control={<Radio />}
                    label="0 - Healthy"
                    value={0}
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label="1 - Low Risk"
                    value={1}
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label="2 - High Risk"
                    value={2}
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label="3 - Critical Risk"
                    value={3}
                  />
                </RadioGroup>
              </FormControl>
            </>
          )}

          {entryForm.type === "OccupationalHealthcare" && (
            <>
              <TextField
                name="employerName"
                label="Employer Name"
                fullWidth
                value={entryForm.employerName || ""}
                onChange={handleChange}
                required
              ></TextField>
              <TextField
                name="startDate"
                label="Sick Leave Start Date"
                type="date"
                //   fullWidth
                value={entryForm.sickLeave?.startDate || ""}
                onChange={handleSickLeaveChange}
                InputLabelProps={{ shrink: true }}
              ></TextField>
              <TextField
                name="endDate"
                label="Sick Leave End  Date"
                type="date"
                //   fullWidth
                value={entryForm.sickLeave?.endDate || ""}
                onChange={handleSickLeaveChange}
                InputLabelProps={{ shrink: true }}
              ></TextField>
            </>
          )}

          <Grid>
            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                style={{ float: "left" }}
                type="button"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                style={{
                  float: "right",
                }}
                type="submit"
                variant="contained"
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </form>
      {/* <div>
        <p>{JSON.stringify(entryForm)}</p>
      </div> */}
    </div>
  );
};

export default AddEntryForm;
