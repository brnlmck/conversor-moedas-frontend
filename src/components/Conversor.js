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
  IconButton,
  CircularProgress,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
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

const Conversor = ({ onConversaoCompleta }) => {
  const [moedaOrigem, setMoedaOrigem] = useState([]);
  const [moedaDestino, setMoedaDestino] = useState([]);
  const [valor, setValor] = useState("");
  const [moedas, setMoedas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleClearAllDestino = () => {
    setMoedaDestino([]);
  };

  useEffect(() => {
    // /listar-moedas
    const buscarMoedas = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/listar-moedas");
        const data = response.data;
        setMoedas(data.moedas);
      } catch (e) {
        console.error("Erro ao buscar moedas:", e);
      } finally {
        setIsLoading(false);
      }
    };

    buscarMoedas();
  }, []);

  const converter = async () => {
    if (
      moedaOrigem.length === 0 ||
      moedaDestino.length === 0 ||
      !valor ||
      parseFloat(valor) < 0
    ) {
      if (onConversaoCompleta) {
        onConversaoCompleta({
          error: "Por favor, preencha todos os campos corretamente.",
        });
        console.log("Por favor, preencha todos os campos corretamente.");
        return;
      }
    }
    if (moedas.length === 0) {
      if (onConversaoCompleta) {
        onConversaoCompleta({ error: "Lista de moedas nao está disponível" });
      }
    }

    setIsLoading(true);
    try {
      const origemSelecionada = moedaOrigem
        .map((nomeOrigem) => moedas.find((x) => x.nome === nomeOrigem)?.cod)
        .filter((cod) => !!cod)
        .join(",");
      if (!origemSelecionada) {
        throw new Error(`Nenhuma moeda de origem foi selecionada`);
      }

      const destinoSelecionado = moedaDestino
        .map((nomeDestino) => moedas.find((x) => x.nome === nomeDestino)?.cod)
        .filter((cod) => !!cod)
        .join(",");
      if (!destinoSelecionado) {
        throw new Error(`Nenhuma moeda de destino foi selecionada`);
      }

      const params = {
        quantia_base: parseFloat(valor),
        moeda_base: origemSelecionada,
        moedas_destino: destinoSelecionado,
      };

      const response = await apiClient.get("/converter", { params });
      if (onConversaoCompleta) {
        onConversaoCompleta({
          data: response.data,
          codigoOrigem: origemSelecionada,
        });
      }
    } catch (err) {
      console.error("Erro na conversão", err);
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Ocorreu um erro na conversão";
      if (onConversaoCompleta) {
        onConversaoCompleta({ error: message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ xs: "stretch", sm: "flex-start" }}
      justifyContent="center"
      sx={{ padding: 2, width: "100%", flexWrap: "wrap" }}
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
          disabled={isLoading}
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
      </Stack>

      <TextField
        type="number"
        value={valor}
        label="Valor"
        onChange={(e) => setValor(e.target.value)}
        variant="outlined"
        size="small"
        disabled={isLoading}
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
          disabled={isLoading}
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
      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        {" "}
        <Button
          variant="contained"
          onClick={converter}
          disabled={
            isLoading ||
            moedaOrigem.length === 0 ||
            moedaDestino.length === 0 ||
            !valor ||
            parseFloat(valor) < 0 ||
            moedas.length === 0
          }
        >
          {isLoading ? "Carregando..." : "Converter"}
        </Button>
        {isLoading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    </Stack>
  );
};

export default Conversor;
