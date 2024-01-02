import Decryption from "@/components/Decryption";
import Encryption from "@/components/Encryption";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box
      sx={{
        height: { xs: "fit-content", sm: "100vh" },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-around",
        p: 3,
      }}
    >
      <Encryption />
      <Decryption />
    </Box>
  );
}
