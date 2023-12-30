import { BITS, MODE, OUTPUTFORMAT } from "@/types/types";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { randomBytes } from "crypto";
import CryptoJs from "crypto-js";
import { useState } from "react";

const Encryption = () => {
  const [mode, setMode] = useState<MODE>("ECB");
  const [outputFormat, setOutputFormat] = useState<OUTPUTFORMAT>("Base64");
  const [bits, setBits] = useState<BITS>("128");
  const [initializationVector, setInitializationVector] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [cipherText, setCipherText] = useState<string>("");

  const handleEncrypt = () => {
    if (plainText && secretKey) {
      const key = CryptoJs.enc.Utf8.parse(secretKey);
      const iv = CryptoJs.enc.Utf8.parse(initializationVector);
      const cipherText = CryptoJs.AES.encrypt(plainText, key, {
        keySize: bits,
        iv,
        mode: mode === "ECB" ? CryptoJs.mode.ECB : CryptoJs.mode.CBC,
      });

      setCipherText(
        cipherText.toString(
          outputFormat === "HEX" ? CryptoJs.format.Hex : CryptoJs.format.OpenSSL
        )
      );
    }
  };
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
        AES Encryption
      </Typography>
      <TextField
        label="Plain Text"
        sx={{ mb: 2 }}
        onChange={(evt) => setPlainText(evt.target.value)}
      />
      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField
          label="Secret Key"
          value={secretKey}
          fullWidth
          sx={{ mr: 1 }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{ mr: 1 }}
                  onClick={() => {
                    if (bits === "128") {
                      setSecretKey(randomBytes(8).toString("hex"));
                    } else if (bits === "192") {
                      setSecretKey(randomBytes(12).toString("hex"));
                    } else {
                      setSecretKey(randomBytes(16).toString("hex"));
                    }
                  }}
                >
                  <AutoFixHighIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Select
          value={bits}
          onChange={(evt) => {
            setBits(evt.target.value as BITS);
            setSecretKey("");
          }}
        >
          <MenuItem value={"128"}>128 Bits</MenuItem>
          <MenuItem value={"192"}>192 Bits</MenuItem>
          <MenuItem value={"256"}>256 Bits</MenuItem>
        </Select>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          disabled={mode === "ECB" ? true : false}
          label="Initialization Vector (Optional)"
          value={initializationVector}
          fullWidth
          sx={{ mr: 1 }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  disabled={mode === "ECB" ? true : false}
                  sx={{ mr: 1 }}
                  onClick={() =>
                    setInitializationVector(randomBytes(8).toString("hex"))
                  }
                >
                  <AutoFixHighIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <ToggleButtonGroup
          color="primary"
          value={mode}
          exclusive
          onChange={(evt, value) => {
            if (value !== null) {
              setInitializationVector("");
              setMode(value);
            }
          }}
        >
          <ToggleButton value="ECB">ECB</ToggleButton>
          <ToggleButton value="CBC">CBC</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField
          label="Cipher Text"
          value={cipherText}
          fullWidth
          sx={{ mr: 1 }}
        />
        <ToggleButtonGroup
          value={outputFormat}
          color="primary"
          exclusive
          onChange={(evt, value) => {
            value !== null && setOutputFormat(value);
          }}
        >
          <ToggleButton value="Base64">Base64</ToggleButton>
          <ToggleButton value="HEX">HEX</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Button
        variant="outlined"
        onClick={handleEncrypt}
        disabled={
          !plainText || !secretKey || (mode === "CBC" && !initializationVector)
        }
      >
        Encrypt
      </Button>
    </Box>
  );
};

export default Encryption;
