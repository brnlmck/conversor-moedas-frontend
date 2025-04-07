import React, { useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Button,
  Stack,
  Typography,
  IconButton, // Import IconButton
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear"; // Import Clear Icon
import apiClient from "../services/api";
import CurrencyFlag from "react-currency-flags";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CurrencyOption = ({ cod, label }) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <CurrencyFlag currency={cod} size="sm"></CurrencyFlag>
    <Typography variant="body2" component="span">
      {label}
    </Typography>
  </Stack>
);

const Conversor = () => {
  const [moedaOrigem, setMoedaOrigem] = useState([]);
  const [moedaDestino, setMoedaDestino] = useState([]);
  const [valor, setValor] = useState("");
  const [moedas, setMoedas] = useState([]);

  const handleMoedaOrigemChange = (event) => {
    const {
      target: { value },
    } = event;
    setMoedaOrigem(typeof value === "string" ? value.split(",") : value);
  };

  const handleMoedaDestinoChange = (event) => {
    const {
      target: { value },
    } = event;
    setMoedaDestino(typeof value === "string" ? value.split(",") : value);
  };

  const handleChipDeleteOrigem = (valueToDelete) => {
    setMoedaOrigem((prev) => prev.filter((value) => value !== valueToDelete));
  };

  const handleChipDeleteDestino = (valueToDelete) => {
    setMoedaDestino((prev) => prev.filter((value) => value !== valueToDelete));
  };

  const handleClearAllOrigem = () => {
    setMoedaOrigem([]);
  };

  const handleClearAllDestino = () => {
    setMoedaDestino([]);
  };

  useEffect(() => {
    // /listar-moedas
    const buscarMoedas = async () => {
      try {
        const response = await apiClient.get("/listar-moedas");
        const data = response.data;
        setMoedas(data.moedas);
      } catch (e) {
        console.error("Erro ao buscar moedas:", e);
      }
    };

    buscarMoedas();
  }, []);

  const converter = () => {
    console.log("Converter de:", moedaOrigem);
    console.log("Converter para:", moedaDestino);
    console.log("Valor:", valor);
    alert(
      `Simulando conversão:\nDe: ${moedaOrigem.join(
        ", "
      )}\nPara: ${moedaDestino.join(", ")}\nValor: ${valor}`
    );
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ xs: "stretch", sm: "flex-start" }}
      justifyContent="center"
      sx={{ padding: 2, width: "100%" }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={0.5}
        sx={{ m: 1 }}
      >
        <FormControl
          sx={{ minWidth: 200, maxWidth: 300, flexGrow: 1 }}
          size="small"
        >
          {" "}
          <InputLabel id="moeda-origem-label">Converter De</InputLabel>
          <Select
            labelId="moeda-origem-label"
            id="moeda-origem-select"
            value={moedaOrigem}
            onChange={handleMoedaOrigemChange}
            label="Converter De"
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((nome) => {
                  const option = moedas.find((opt) => opt.nome === nome);
                  if (!option) return null;
                  return (
                    <Chip
                      key={nome}
                      icon={
                        <CurrencyFlag
                          currency={option.cod}
                          size="sm"
                        ></CurrencyFlag>
                      }
                      label={option.nome}
                      size="small"
                      onDelete={() => handleChipDeleteOrigem(nome)}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  );
                })}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {moedas.map((option) => (
              <MenuItem key={option.cod} value={option.nome}>
                <CurrencyOption cod={option.cod} label={option.nome} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {moedaOrigem.length > 0 && (
          <IconButton
            onClick={handleClearAllOrigem}
            size="small"
            aria-label="Limpar seleção de origem"
            title="Limpar todas as moedas de origem"
            sx={{ mt: 1 }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>

      <TextField
        type="number"
        value={valor}
        label="Valor"
        onChange={(e) => setValor(e.target.value)}
        variant="outlined"
        size="small"
        sx={{
          m: 1,
          mt: { sm: 2 },
          width: { xs: "calc(100% - 16px)", sm: 150 },
        }}
        InputProps={{ inputProps: { min: 0 } }}
      />

      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={0.5}
        sx={{ m: 1 }}
      >
        <FormControl
          sx={{ minWidth: 200, maxWidth: 300, flexGrow: 1 }}
          size="small"
        >
          <InputLabel id="moeda-destino-label">Converter Para</InputLabel>
          <Select
            labelId="moeda-destino-label"
            id="moeda-destino-select"
            multiple
            value={moedaDestino}
            onChange={handleMoedaDestinoChange}
            label="Converter Para"
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => {
                  const option = moedas.find((opt) => opt.nome === value);
                  if (!option) return null;
                  return (
                    <Chip
                      key={value}
                      icon={
                        <CurrencyFlag
                          currency={option.cod}
                          size="sm"
                        ></CurrencyFlag>
                      }
                      label={option.nome}
                      size="small"
                      onDelete={() => handleChipDeleteDestino(value)} // Call specific delete handler
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  );
                })}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {moedas.map((option) => (
              <MenuItem key={option.cod} value={option.nome}>
                <CurrencyOption cod={option.cod} label={option.nome} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {moedaDestino.length > 0 && (
          <IconButton
            onClick={handleClearAllDestino}
            size="small"
            aria-label="Limpar seleção de destino"
            title="Limpar todas as moedas de destino"
            sx={{ mt: 1 }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>

      <Button
        variant="contained"
        onClick={converter}
        sx={{
          m: 1,
          mt: { sm: 2 },
          alignSelf: { xs: "center", sm: "flex-start" },
        }}
      >
        Converter
      </Button>
    </Stack>
  );
};

export default Conversor;
