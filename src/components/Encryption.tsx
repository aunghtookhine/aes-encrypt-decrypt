import { BITS, Record } from "@/types/types";
import { downloadDocx, extractContent } from "@/utils/utils";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CryptoJs from "crypto-js";
import cryptoRandomString from "crypto-random-string";
import fileDownload from "js-file-download";
import { useState } from "react";
import FileDropZone from "./FileDropZone";

interface Props {
  records: Record[];
  setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
}

const Encryption = ({ records, setRecords }: Props) => {
  const [bits, setBits] = useState<BITS>("128");
  const [plainText, setPlainText] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [cipherText, setCipherText] = useState<string>("");
  const [fileData, setFileData] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");

  const onFileSelected = async (file: File) => {
    const fileContent = await extractContent(file);
    setFileData(`${file.name} (${file.size} bytes)`);
    setPlainText(fileContent);
    setFileType(file.type);
  };

  const handleEncrypt = async () => {
    try {
      const start = performance.now();
      const key = CryptoJs.enc.Utf8.parse(secretKey);
      const iv = CryptoJs.enc.Utf8.parse("Lets check quick");
      const encryptedText = CryptoJs.AES.encrypt(plainText, key, {
        keySize: bits,
        iv,
        mode: CryptoJs.mode.CBC,
      });
      setCipherText(encryptedText.toString(CryptoJs.format.Hex));
      const end = performance.now();
      const duration = (end - start) / 1000;
      const newRecord: Record = {
        fileData: fileData,
        cryptography: "Encrypt",
        keyLength: bits,
        durationsInSec: duration,
      };
      setRecords([...records, newRecord]);
      const uniqueId = cryptoRandomString({ length: 10, type: "numeric" });

      if (fileType === "text/plain") {
        fileDownload(
          encryptedText.toString(CryptoJs.format.Hex),
          `ciphertext-${uniqueId}.txt`
        );
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        downloadDocx(
          encryptedText.toString(CryptoJs.format.Hex),
          `ciphertext-${uniqueId}.docx`
        );
      }
      fileDownload(secretKey, `secret-${uniqueId}.txt`);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        mb: { xs: 3, sm: 0 },
      }}
    >
      <Box sx={{ display: "flex", mb: 2 }}>
        <FileDropZone onFileSelected={onFileSelected} text="plaintext" />
      </Box>
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
                      setSecretKey(cryptoRandomString({ length: 16 }));
                    } else if (bits === "192") {
                      setSecretKey(cryptoRandomString({ length: 24 }));
                    } else {
                      setSecretKey(cryptoRandomString({ length: 32 }));
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
            setCipherText("");
          }}
        >
          <MenuItem value={"128"}>128 Bits</MenuItem>
          <MenuItem value={"192"}>192 Bits</MenuItem>
          <MenuItem value={"256"}>256 Bits</MenuItem>
        </Select>
      </Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField label="Ciphertext" value={cipherText} fullWidth />
      </Box>
      <Button
        variant="outlined"
        onClick={handleEncrypt}
        disabled={!plainText || !secretKey}
      >
        Encrypt
      </Button>
    </Box>
  );
};

export default Encryption;
