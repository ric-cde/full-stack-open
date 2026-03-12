import {
  Patient,
  Diagnosis,
  Entry,
  EntryFormValues,
  HealthCheckRating,
} from "../../types";
import { useState, useEffect } from "react";
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";

import { useParams } from "react-router-dom";

import {
  Box,
  Typography,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Button,
} from "@mui/material";

import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import axios from "axios";
import AddEntryModal from "../AddEntryModal";

const PatientDetailsPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      try {
        const loadedPatient = await patientService.get(id);
        const loadedDiagnoses = await diagnosisService.getAll();
        setPatient(loadedPatient);
        setDiagnoses(loadedDiagnoses);
      } catch (error) {
        console.error("Failed to load patient information: ", error);
        setPatient(null);
      }
    };

    fetchPatient();
  }, [id]);

  const openModal = (): void => {
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  if (!id) return <p>Invalid ID</p>;
  if (!patient) return <p>No patient data</p>;

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const entry = await patientService.addEntry(id, values);
      setPatient({
        ...patient,
        entries: [...patient.entries, entry],
      });
      setModalOpen(false);
    } catch (e: unknown) {
      console.error(e);
      if (axios.isAxiosError(e)) {
        const data = e.response?.data;
        setError(data?.error || data || e.message || "unknown Axios error");
      } else {
        setError("Unknown error");
        console.error("Unknown error: ", e);
        setError("Unknown error");
      }
      throw e;
    }
  };

  return (
    <Box>
      <Typography align="center" variant="h6">
        Patient Information
      </Typography>
      <Stack spacing={4} sx={{ marginTop: 2 }}>
        <Typography variant="h4">
          {patient.name}{" "}
          {(() => {
            switch (patient.gender) {
              case "male":
                return <MaleIcon />;
              case "female":
                return <FemaleIcon />;
              case "other":
                return <TransgenderIcon />;
            }
          })()}
        </Typography>

        <Typography variant="body1">
          <strong>Gender: </strong>
          {patient.gender}
        </Typography>
        <Typography variant="body1">
          <strong>Occupation: </strong>
          {patient.occupation}
        </Typography>
        {patient.dateOfBirth && (
          <Typography variant="body1">
            <strong>Date of Birth: </strong>
            {patient.dateOfBirth}
          </Typography>
        )}
        {patient.ssn && (
          <Typography variant="body1">
            <strong>SSN: </strong>
            {patient.ssn}
          </Typography>
        )}
        <Divider />
        <Typography variant="h6">Entries</Typography>
        {patient.entries && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Specialist</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Diagnoses</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patient.entries.map((e) => {
                return (
                  <TableRow key={e.id}>
                    <TableCell>{e.date}</TableCell>
                    <TableCell>{e.specialist}</TableCell>
                    <TableCell>{e.type}</TableCell>
                    <TableCell>{e.description}</TableCell>
                    <TableCell>
                      <ul>
                        {e.diagnosisCodes?.map((code) => {
                          const name =
                            diagnoses.find((d) => d.code === code)?.name ||
                            "Diagnosis missing found for code";
                          return (
                            <li key={code}>
                              <strong>{code}:</strong> {name}
                              {}
                            </li>
                          );
                        })}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <EntryDetails entry={e} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Stack>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
        diagnoses={diagnoses}
      />
      <Button variant="contained" color="primary" onClick={() => openModal()}>
        ADD NEW ENTRY
      </Button>
    </Box>
  );
};

type EntryProps = { entry: Entry };

const EntryDetails = ({ entry }: EntryProps) => {
  switch (entry.type) {
    case "Hospital":
      return (
        entry.discharge && (
          <p>{entry.discharge.date + ": " + entry.discharge.criteria}</p>
        )
      );
    case "OccupationalHealthcare":
      return `${entry.employerName}${
        entry.sickLeave?.startDate
          ? ` sick leave: from ${entry.sickLeave.startDate} to ${entry.sickLeave.endDate}`
          : ""
      }`;
    case "HealthCheck":
      const rating = entry.healthCheckRating;
      return `HealthCheck rating: ${rating} (${HealthCheckRating[rating]})`;
    default:
      return ((_exhaustiveCheck: never): never => {
        throw new Error(
          `Unhandled entry type: ${JSON.stringify(_exhaustiveCheck)}`,
        );
      })(entry);
  }
};

export default PatientDetailsPage;
