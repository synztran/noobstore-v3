import React from "react";
import { Container, Typography, Box } from "@mui/material";
import RaffleBlock from "@/components/RaffleBlock";

export default function RafflesPage() {
  return (
    <Container maxWidth="xl" className="py-8">
      <Box className="mb-8 text-center">
        <Typography variant="h3" className="font-bold mb-4">
          🎲 Active Raffles
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Enter exciting raffles and win amazing prizes!
        </Typography>
      </Box>

      <RaffleBlock />
    </Container>
  );
}
