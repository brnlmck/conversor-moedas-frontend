import React, { useState } from "react";
import { Stack, Typography } from "@mui/material";
import "./App.css";
import Conversor from "./components/Conversor";
import CurrencyCardGrid from "./components/Resultado";

function App() {
  const [conversionData, setConversionData] = useState([]);
  const [codigoOrigem, setCodigoOrigem] = useState("");
  const [apiError, setApiError] = useState(null);

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
  };

  return (
    <Stack height="100vh" direction="column">
      <Stack height="50%" justifyContent="center" alignItems="center">
        <Conversor onConversaoCompleta={handleConversaoCompleta} />
      </Stack>
      <Stack height="50%">
        {apiError && (
          <Typography color="error" textAlign="center" sx={{ mt: 2 }}>
            Erro: {apiError}
          </Typography>
        )}
        {!apiError && (
          <CurrencyCardGrid
            results={conversionData}
            sourceCodigoMoeda={codigoOrigem}
          ></CurrencyCardGrid>
        )}
      </Stack>
    </Stack>
  );
}

export default App;
