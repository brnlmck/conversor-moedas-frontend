import React, { useState, useEffect } from "react";
import { Stack } from "@mui/material";
import "./App.css";
import Conversor from "./components/Conversor";
import CurrencyCardGrid from "./components/Resultado";

function App() {
  const [conversionData, setConversionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sourceCurrency = "BRL"; // Example source currency

  useEffect(() => {
    setIsLoading(true);
    // Replace with your actual data fetching/calculation logic
    setTimeout(() => {
      const fetchedData = [
        {
          id: "usd",
          codigoMoeda: "USD",
          moedaPara: "Dólar Americano",
          valorConvertido: 95.85,
          taxaCambio: 5.21,
        },
        {
          id: "eur",
          codigoMoeda: "EUR",
          moedaPara: "Euro",
          valorConvertido: 88.12,
          taxaCambio: 5.67,
        },
        {
          id: "gbp",
          codigoMoeda: "GBP",
          moedaPara: "Libra Esterlina",
          valorConvertido: 75.5,
          taxaCambio: 6.62,
        },
        {
          id: "jpy",
          codigoMoeda: "JPY",
          moedaPara: "Iene Japonês",
          valorConvertido: 14320.75,
          taxaCambio: 0.035,
        },
      ];
      setConversionData(fetchedData);
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <Stack height="100vh" direction="column">
      <Stack height="50%" justifyContent="center" alignItems="center">
        <Conversor />
      </Stack>
      <Stack height="50%">
        <CurrencyCardGrid
          results={conversionData}
          sourcecodigoMoeda={sourceCurrency}
        ></CurrencyCardGrid>
      </Stack>
    </Stack>
  );
}

export default App;
