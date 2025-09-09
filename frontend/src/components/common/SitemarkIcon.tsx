import * as React from 'react';
import { Box, Typography } from '@mui/material';
import logoImage from '../../../new_logo.png';

interface SitemarkIconProps {
  logoSize?: number;
  fontSize?: string;
  fontWeight?: number;
}

export function SitemarkIcon({ logoSize = 36, fontSize = '1.5rem', fontWeight = 700 }: SitemarkIconProps = {}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        component="img"
        src={logoImage}
        alt="We, the People logo"
        sx={{
          height: logoSize,
          width: logoSize,
          objectFit: 'contain',
          display: 'block',
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: fontWeight,
          fontSize: fontSize,
          color: '#4876ee',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        People+
      </Typography>
    </Box>
  );
}