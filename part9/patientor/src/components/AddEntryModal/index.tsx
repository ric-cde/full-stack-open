import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";

import AddEntryForm from "./AddEntryForm";
import { Diagnosis, EntryFormValues } from "../../types";

interface Props {
  modalOpen: boolean;
  onSubmit: (values: EntryFormValues) => Promise<void>;
  error?: string;
  onClose: () => void;
  diagnoses: Diagnosis[];
}

const AddEntryModal = ({
  modalOpen,
  onSubmit,
  error,
  onClose,
  diagnoses,
}: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={onClose}>
    <DialogTitle>Add a new entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddEntryForm
        onSubmit={onSubmit}
        onCancel={onClose}
        diagnoses={diagnoses}
      />
    </DialogContent>
  </Dialog>
);

export default AddEntryModal;
