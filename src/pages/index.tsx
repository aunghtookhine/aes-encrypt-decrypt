import Decryption from "@/components/Decryption";
import Encryption from "@/components/Encryption";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "space-around",
        // alignItems: "center",
        p: 3,
      }}
    >
      <Encryption />
      <Decryption />
    </Box>
  );
}
