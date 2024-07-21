import { Box, TextField } from "@mui/material";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onFileSelected: (acceptedFiles: File) => void;
  text: string;
}

const FileDropZone = ({ onFileSelected, text }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    onFileSelected(acceptedFiles[0]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: {
      "text/plain": [".txt"],
    },
  });
  return (
    <Box {...getRootProps()} sx={{ width: "100%", cursor: "pointer" }}>
      <input {...getInputProps()} />
      <TextField
        label={text.charAt(0).toUpperCase() + text.slice(1)}
        sx={{
          "& .MuiInputBase-input": {
            cursor: "pointer",
          },
        }}
        value={
          file
            ? file.name
            : isDragActive
            ? "Drop the file here."
            : `Drag drop your ${text} here, or click to select files.`
        }
        fullWidth
      />
    </Box>
  );
};

export default FileDropZone;
