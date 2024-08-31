import { extractContent } from "@/utils/utils";
import { Box, TextField } from "@mui/material";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onFileSelected: (acceptedFiles: File) => void;
  text: string;
}

const FileDropZone = ({ onFileSelected, text }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const onDrop = async (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    const content = await extractContent(acceptedFiles[0]);
    setFileContent(content);
    onFileSelected(acceptedFiles[0]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: {
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
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
            ? fileContent
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
