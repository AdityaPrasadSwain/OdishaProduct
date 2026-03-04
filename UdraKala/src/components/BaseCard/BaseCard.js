import React from "react";

import {
  Card,
  CardContent,
  Divider,
  Box,
  Typography,
  Chip,
} from "@mui/material";

const BaseCard = (props) => {
  return (
    <Card
      variant="elevation"
      sx={{
        p: 0,
        width: "100%",
      }}
    >
      <Box p={2.5} display="flex" alignItems="center" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Box>
          <Typography variant="h5" fontWeight='700' color="#F8FAFC">{props.title}</Typography>
        </Box>
        {props.chiptitle ? (
          <Chip
            label={props.chiptitle}
            size="small"
            sx={{
              ml: "auto",
              fontSize: "11px",
              fontWeight: "700",
              bgcolor: 'rgba(123, 97, 255, 0.15)',
              color: '#7B61FF',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          ></Chip>
        ) : (
          ""
        )}
      </Box>
      <Divider sx={{ opacity: 0.1, display: 'none' }} />
      <CardContent>{props.children}</CardContent>
    </Card>
  );
};

export default BaseCard;
