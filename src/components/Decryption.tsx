import { Record } from "@/types/types";
import { Box, Button, TextField } from "@mui/material";
import CryptoJs from "crypto-js";
import { useState } from "react";

import { downloadDocx, extractContent } from "@/utils/utils";
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
  const [fileType, setFileType] = useState<string>("");

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

      if (fileType === "text/plain") {
        fileDownload(
          decryptedText.toString(CryptoJs.enc.Utf8),
          `plaintext-${fileId}.txt`
        );
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        downloadDocx(
          decryptedText.toString(CryptoJs.enc.Utf8),
          `plaintext-${fileId}.docx`
        );
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const onCiphertextFileSelected = async (file: File) => {
    const fileContent = await extractContent(file);
    setFileData(`${file.name} (${file.size} bytes)`);
    setCipherText(fileContent);
    setFileType(file.type);
  };

  const onSecretKeyFileSelected = async (file: File) => {
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
          onFileSelected={onSecretKeyFileSelected}
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
