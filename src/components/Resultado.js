import React from "react";
import PropTypes from "prop-types";
import { Grid, Card, CardContent, Typography, Stack, Box } from "@mui/material";

const formatCurrency = (value, codigoMoeda, locale = "pt-BR") => {
  if (typeof value !== "number" || !codigoMoeda) {
    return "N/A";
  }
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: codigoMoeda,
    }).format(value);
  } catch (error) {
    console.error(`Error formatting currency ${codigoMoeda}:`, error);
    return `${codigoMoeda} ${value.toFixed(2)}`;
  }
};

const formatRate = (value, digits = 4) => {
  if (typeof value !== "number") {
    return "N/A";
  }
  return Number(value).toFixed(digits);
};

const CurrencyCardGrid = ({ results = [], sourcecodigoMoeda = "BRL" }) => {
  if (!results || results.length === 0) {
    return (
      <Typography variant="subtitle1" textAlign="center" sx={{ mt: 3 }}>
        Nenhum resultado de conversão para exibir.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3} sx={{ padding: 2 }} justifyContent="center">
      {results.map((item) => (
        <Grid
          item
          key={item.id || item.codigoMoeda}
          xs={12}
          sm={6}
          md={4}
          lg={3}
          display="flex"
          justifyContent="center"
        >
          <Card
            sx={{
              width: 220,
              height: 220,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              boxShadow: 3,
              "&:hover": {
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Stack spacing={1} alignItems="center">
                <Box
                  component="img"
                  sx={{
                    height: 40,
                    width: "auto",
                    maxHeight: 40,
                    objectFit: "contain",
                    mb: 1,
                  }}
                  alt={`${item.moedaPara}`}
                  src={`/flags/${item.codigoMoeda?.toLowerCase()}.svg`}
                  onError={(e) => {
                    e.target.style.display =
                      "none"; /* Caso não tenha imagem o ícone fica escondido */
                  }}
                />

                <Typography
                  variant="h6"
                  component="div"
                  noWrap
                  title={item.moedaPara}
                >
                  {item.moedaPara || "Moeda Desconhecida"}
                </Typography>

                <Typography
                  variant="subtitle1"
                  color="text.primary"
                  sx={{ fontWeight: "bold" }}
                >
                  {formatCurrency(item.valorConvertido, item.codigoMoeda)}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Taxa {sourcecodigoMoeda}/{item.codigoMoeda}:{" "}
                  {formatRate(item.taxaCambio)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// --- Prop Type Validation ---

CurrencyCardGrid.propTypes = {
  /** Array of conversion result objects */
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Unique ID for key
      codigoMoeda: PropTypes.string.isRequired, // e.g., 'USD'
      moedaPara: PropTypes.string.isRequired, // e.g., 'Dólar Americano'
      // flagUrl: PropTypes.string.isRequired, // Using codigoMoeda to derive path now
      valorConvertido: PropTypes.number.isRequired, // The final converted amount
      taxaCambio: PropTypes.number.isRequired, // The rate used
    })
  ).isRequired,
  /** The currency code of the original amount (e.g., 'BRL') */
  sourcecodigoMoeda: PropTypes.string,
};

export default CurrencyCardGrid;
