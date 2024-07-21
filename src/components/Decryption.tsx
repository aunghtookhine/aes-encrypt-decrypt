import { Record } from "@/types/types";
import { Box, Button, TextField } from "@mui/material";
import CryptoJs from "crypto-js";
import { useState } from "react";

import fileDownload from "js-file-download";
import FileDropZone from "./FileDropZone";

interface Props {
  records: Record[];
  setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
}

const Decryption = ({ records, setRecords }: Props) => {
  const [cipherText, setCipherText] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [fileData, setFileData] = useState<string>("");

  const handleDecrypt = () => {
    try {
      const start = performance.now();
      const iv = CryptoJs.enc.Utf8.parse("Lets check quick");
      const secret = CryptoJs.enc.Utf8.parse(secretKey);
      const encryptedText = CryptoJs.enc.Hex.parse(cipherText).toString(
        CryptoJs.enc.Base64
      );
      const decryptedText = CryptoJs.AES.decrypt(encryptedText, secret, {
        iv,
        mode: CryptoJs.mode.CBC,
      });
      setPlainText(decryptedText.toString(CryptoJs.enc.Utf8));
      const end = performance.now();
      const duration = (end - start) / 1000;
      const newRecord: Record = {
        fileData: fileData,
        cryptography: "Decrypt",
        keyLength: String(secretKey.split("").length * 8),
        durationsInSec: duration,
      };
      setRecords([...records, newRecord]);
      const fileId = fileData.split(" ")[0].split(".")[0].split("-")[1];
      fileDownload(
        decryptedText.toString(CryptoJs.enc.Utf8),
        `plaintext-${fileId}.txt`
      );
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const onCiphertextFileSelected = async (file: File) => {
    const fileContent = await file.text();
    setFileData(`${file.name} (${file.size} bytes)`);
    setCipherText(fileContent);
  };

  const onPlaintextFileSelected = async (file: File) => {
    const fileContent = await file.text();
    setSecretKey(fileContent);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", mb: 2 }}>
        <FileDropZone
          onFileSelected={onCiphertextFileSelected}
          text="ciphertext"
        />
      </Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <FileDropZone
          onFileSelected={onPlaintextFileSelected}
          text="secret key"
        />
      </Box>
      <TextField label="Plaintext" sx={{ mb: 2 }} value={plainText} />
      <Button
        variant="outlined"
        onClick={handleDecrypt}
        disabled={!cipherText || !secretKey}
      >
        Decrypt
      </Button>
    </Box>
  );
};

export default Decryption;
