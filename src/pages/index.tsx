import Decryption from "@/components/Decryption";
import Encryption from "@/components/Encryption";
import { Record } from "@/types/types";
import {
  AppBar,
  BottomNavigation,
  Box,
  Link,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default function Home() {
  const [tab, setTab] = useState<number>(0);
  const [records, setRecords] = useState<Record[]>([]);
  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#2D2D2D" }}>
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Text Encryption and Decryption using AES with CBC Mode
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={(e, value) => setTab(value)}>
            <Tab label="Encryption" />
            <Tab label="Decryption" />
          </Tabs>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "35%" }}>
            <TabPanel value={tab} index={0}>
              <Encryption records={records} setRecords={setRecords} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <Decryption records={records} setRecords={setRecords} />
            </TabPanel>
          </Box>
          <Box sx={{ width: "65%", p: "24px" }}>
            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>File</TableCell>
                    <TableCell>Encrypt/Decrypt</TableCell>
                    <TableCell>Key Length</TableCell>
                    <TableCell>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records && records.length > 0 ? (
                    records.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.fileData}</TableCell>
                        <TableCell>{record.cryptography}</TableCell>
                        <TableCell>{record.keyLength}</TableCell>
                        <TableCell>{record.durationsInSec}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                        There is No Data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
      <Box
        component="footer"
        sx={{
          bgcolor: "background.paper",
          width: "100%",
          position: "fixed",
          bottom: 0,
        }}
      >
        <BottomNavigation
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography>
            © 2024{" "}
            <Link
              href="https://github.com/aunghtookhine"
              sx={{
                color: "#206A5D",
                backgroundColor: "transparent",
                textDecoration: "none",
              }}
            >
              Aung Htoo Khine
            </Link>
          </Typography>
          <Typography>Academic Year: 2023-2024</Typography>
        </BottomNavigation>
      </Box>
    </Box>
  );
}
