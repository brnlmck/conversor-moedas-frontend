import React, { useState } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import "./App.css";
import Conversor from "./components/Conversor";
import CurrencyCardGrid from "./components/Resultado";

function App() {
  const [conversionData, setConversionData] = useState([]);
  const [codigoOrigem, setCodigoOrigem] = useState("");
  const [apiError, setApiError] = useState(null);
  const [isResultLoading, setIsResultLoading] = useState(false);

  const handleConversaoComecou = () => {
    setIsResultLoading(true);
    setApiError(null); // Limpa erros anteriores
    setConversionData([]); // Limpa dados anteriores
    setCodigoOrigem(""); // Limpa código de origem anterior
  };

  const handleConversaoCompleta = (result) => {
    console.log("Recebido do conversor", result);
    if (result && result.error) {
      setApiError(result.error);
      setCodigoOrigem("");
      setConversionData([]);
    } else if (result && result.data && result.codigoOrigem) {
      setConversionData(result.data.data || []);
      setCodigoOrigem(result.codigoOrigem);
      setApiError(null);
    } else {
      setApiError("Ocorreu um erro na comunicação.");
      setConversionData([]);
      setCodigoOrigem("");
    }
    setIsResultLoading(false);
  };

  return (
    <Stack height="100vh" direction="column" backgroundColor="#E5E5E5">
      <Stack height="50%" justifyContent="center" alignItems="center">
        <Conversor
          onConversaoCompleta={handleConversaoCompleta}
          onConversaoComecou={handleConversaoComecou}
        />
      </Stack>
      <Stack
        component="section"
        flexGrow={1}
        justifyContent="center"
        alignItems="center"
        sx={{ pb: 4 }}
      >
        {isResultLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : apiError ? (
          <Typography
            color="error"
            textAlign="center"
            sx={{ mt: 2, maxWidth: "80%" }}
          >
            Erro: {apiError}
          </Typography>
        ) : (
          Array.isArray(conversionData) && (
            <CurrencyCardGrid
              results={conversionData}
              sourceCodigoMoeda={codigoOrigem}
            />
          )
        )}
      </Stack>
    </Stack>
  );
}

export default App;
