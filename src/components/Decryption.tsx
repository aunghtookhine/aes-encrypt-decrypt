import { BITS, MODE, OUTPUTFORMAT } from "@/types/types";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";

const Decryption = () => {
  const [mode, setMode] = useState<MODE>("ECB");
  const [outputFormat, setOutputFormat] = useState<OUTPUTFORMAT>("Base64");
  const [bits, setBits] = useState<BITS>("128");
  return (
    <Box
      sx={{
        width: "40%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h3" sx={{ textAlign: "center", mb: 2 }}>
        AES Decryption
      </Typography>
      <TextField label="Plain Text" sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField label="Secret Key" fullWidth sx={{ mr: 1 }} />
        <Select
          value={bits}
          onChange={(evt) => setBits(evt.target.value as BITS)}
        >
          <MenuItem value={"128"}>128 Bits</MenuItem>
          <MenuItem value={"192"}>192 Bits</MenuItem>
          <MenuItem value={"256"}>256 Bits</MenuItem>
        </Select>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Initialization Vector (Optional)"
          fullWidth
          sx={{ mr: 1 }}
        />
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(evt, value) => {
            value !== null && setMode(value);
          }}
        >
          <ToggleButton value="ECB">ECB</ToggleButton>
          <ToggleButton value="CBC">CBC</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField label="Cipher Text" fullWidth sx={{ mr: 1 }} />
        <ToggleButtonGroup
          value={outputFormat}
          exclusive
          onChange={(evt, value) => {
            value !== null && setOutputFormat(value);
          }}
        >
          <ToggleButton value="Base64">Base64</ToggleButton>
          <ToggleButton value="HEX">HEX</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Button variant="outlined">Decrypt</Button>
    </Box>
  );
};

export default Decryption;
