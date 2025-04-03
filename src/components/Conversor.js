import React, { useState } from "react";
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

// --- Assuming flags are in public/flags/ directory ---
const options = [
  { value: "BRL", label: "Real", image: "/flags/br.svg" },
  { value: "USD", label: "Dólar Americano", image: "/flags/us.svg" },
  { value: "EUR", label: "EURO", image: "/flags/eu.svg" },
  // Add more currencies as needed
];

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

// --- Reusable component for rendering flag + label in MenuItems ---
const CurrencyOption = ({ imageSrc, label }) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <img
      loading="lazy"
      width="20"
      height="15"
      src={imageSrc}
      alt={`${label} flag`}
      style={{ objectFit: "contain" }}
    />
    <Typography variant="body2" component="span">
      {label}
    </Typography>
  </Stack>
);

const Conversor = () => {
  const [moedaOrigem, setMoedaOrigem] = useState([]);
  const [moedaDestino, setMoedaDestino] = useState([]);
  const [valor, setValor] = useState("");

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
            multiple
            value={moedaOrigem}
            onChange={handleMoedaOrigemChange}
            label="Converter De"
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => {
                  const option = options.find((opt) => opt.value === value);
                  if (!option) return null;
                  return (
                    <Chip
                      key={value}
                      icon={
                        <img
                          loading="lazy"
                          width="18"
                          height="13"
                          src={option.image}
                          alt={`${option.label} flag`}
                          style={{ objectFit: "contain", marginLeft: "5px" }}
                        />
                      }
                      label={option.label}
                      size="small"
                      onDelete={() => handleChipDeleteOrigem(value)}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  );
                })}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <CurrencyOption imageSrc={option.image} label={option.label} />
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
                  const option = options.find((opt) => opt.value === value);
                  if (!option) return null;
                  return (
                    <Chip
                      key={value}
                      icon={
                        <img
                          loading="lazy"
                          width="18"
                          height="13"
                          src={option.image}
                          alt={`${option.label} flag`}
                          style={{ objectFit: "contain", marginLeft: "5px" }}
                        />
                      }
                      label={option.label}
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
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <CurrencyOption imageSrc={option.image} label={option.label} />
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
