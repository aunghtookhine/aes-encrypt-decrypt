import { BITS, FORMAT, MODE } from "@/types/types";
import {
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CryptoJs from "crypto-js";
import { useState } from "react";

const Decryption = () => {
  const [mode, setMode] = useState<MODE>("ECB");
  const [inputFormat, setInputFormat] = useState<FORMAT>();
  const [bits, setBits] = useState<BITS>();
  const [cipherText, setCipherText] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [initializationVector, setInitializationVector] = useState<string>("");
  const hexRegex = /^[A-Fa-f0-9]+$/;

  const handleDecrypt = () => {
    const key = CryptoJs.enc.Utf8.parse(secretKey);
    const iv = CryptoJs.enc.Utf8.parse(initializationVector);
    var encryptedText = cipherText;

    if (inputFormat === "HEX") {
      encryptedText = CryptoJs.enc.Hex.parse(cipherText).toString(
        CryptoJs.enc.Base64
      );
    }

    const decryptedText = CryptoJs.AES.decrypt(encryptedText, key, {
      keySize: Number(bits) / 32,
      iv,
      mode: mode === "CBC" ? CryptoJs.mode.CBC : CryptoJs.mode.ECB,
    });
    setPlainText(decryptedText.toString(CryptoJs.enc.Utf8));
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
        AES Decryption
      </Typography>
      <TextField
        label="Cipher Text"
        fullWidth
        sx={{ mb: 2 }}
        value={cipherText}
        onChange={(evt) => {
          const isHex = hexRegex.test(evt.target.value);
          setInputFormat(isHex ? "HEX" : "Base64");
          setCipherText(evt.target.value);
        }}
      />

      <TextField
        label="Secret Key"
        fullWidth
        sx={{ mb: 2 }}
        value={secretKey}
        onChange={(evt) => {
          setSecretKey(evt.target.value);
          if (evt.target.value.length === 16) {
            setBits("128");
          } else if (evt.target.value.length === 24) {
            setBits("192");
          } else if (evt.target.value.length === 32) {
            setBits("256");
          }
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Initialization Vector (Optional)"
          fullWidth
          sx={{ mr: 1 }}
          value={initializationVector}
          onChange={(evt) => setInitializationVector(evt.target.value)}
          disabled={mode === "ECB"}
        />
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(evt, value) => {
            if (value !== null) {
              setMode(value);
              setInitializationVector("");
            }
          }}
        >
          <ToggleButton value="ECB">ECB</ToggleButton>
          <ToggleButton value="CBC">CBC</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <TextField
        label="Plain Text"
        sx={{ mb: 2 }}
        value={plainText}
        onChange={(evt) => setPlainText(evt.target.value)}
      />

      <Button
        variant="outlined"
        onClick={handleDecrypt}
        disabled={
          !cipherText || !secretKey || (mode === "CBC" && !initializationVector)
        }
      >
        Decrypt
      </Button>
    </Box>
  );
};

export default Decryption;
