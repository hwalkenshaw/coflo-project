import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Stack, 
  Chip,
  Avatar,
  useTheme,
  alpha,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';

interface TotalPeopleCardProps {
  total: number;
  percentageChange: number;
  data?: number[];
  period?: string;
  variant?: 'default' | 'gradient' | 'minimal' | 'detailed';
}

// Variant 1: Default with sparkline (inspired by MUI Dashboard template)
export const TotalPeopleCardDefault: React.FC<TotalPeopleCardProps> = ({
  total,
  percentageChange,
  data = [120, 135, 125, 145, 160, 175, 165, 180, 195, 210, 225, 247],
  period = 'Last 30 days'
}) => {
  const theme = useTheme();
  const isPositive = percentageChange >= 0;
  
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom color="text.secondary">
          Total People
        </Typography>
        <Stack direction="column" spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4" component="p">
              {total.toLocaleString()}
            </Typography>
            <Chip
              size="small"
              icon={isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${isPositive ? '+' : ''}${percentageChange}%`}
              color={isPositive ? 'success' : 'error'}
              sx={{ fontWeight: 600 }}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {period}
          </Typography>
          <Box sx={{ width: '100%', height: 60, mt: 1 }}>
            <SparkLineChart
              data={data}
              height={60}
              area
              showHighlight
              showTooltip
              colors={[isPositive ? theme.palette.success.main : theme.palette.error.main]}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fillOpacity: 0.3,
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Variant 2: Gradient style (inspired by Berry template)
export const TotalPeopleCardGradient: React.FC<TotalPeopleCardProps> = ({
  total,
  percentageChange,
  period = 'vs last month'
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isPositive = percentageChange >= 0;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: alpha(theme.palette.common.white, 0.1),
          borderRadius: '50%',
          top: -85,
          right: -95
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: alpha(theme.palette.common.white, 0.05),
          borderRadius: '50%',
          top: -125,
          right: -15
        }
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.common.white, 0.2),
              color: 'white',
              width: 44,
              height: 44
            }}
          >
            <PeopleIcon />
          </Avatar>
          <IconButton
            size="small"
            sx={{ color: 'white' }}
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
            <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
            <MenuItem onClick={handleMenuClose}>Share</MenuItem>
          </Menu>
        </Stack>
        
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography variant="h3" sx={{ fontWeight: 500, color: 'white' }}>
              {total.toLocaleString()}
            </Typography>
            <Chip
              size="small"
              icon={isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${isPositive ? '+' : ''}${percentageChange}%`}
              sx={{
                bgcolor: alpha(theme.palette.common.white, 0.2),
                color: 'white',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Stack>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            Total People
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {period}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Variant 3: Minimal style (inspired by Mantis template)
export const TotalPeopleCardMinimal: React.FC<TotalPeopleCardProps> = ({
  total,
  percentageChange,
  period = 'You added 35 people this month'
}) => {
  const isPositive = percentageChange >= 0;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="h6" color="text.secondary">
            Total People
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h4">
              {total.toLocaleString()}
            </Typography>
            <Chip
              variant="filled"
              size="small"
              icon={isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${percentageChange}%`}
              color={isPositive ? 'success' : 'error'}
              sx={{ 
                height: 24,
                '& .MuiChip-icon': { fontSize: 16 }
              }}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
            {period}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Variant 4: Detailed with breakdown
export const TotalPeopleCardDetailed: React.FC<TotalPeopleCardProps> = ({
  total,
  percentageChange,
  data = [120, 135, 125, 145, 160, 175, 165, 180, 195, 210, 225, 247],
  period = 'Last 12 months'
}) => {
  const theme = useTheme();
  const isPositive = percentageChange >= 0;
  const newThisMonth = Math.floor(total * 0.073); // Example calculation
  const activePercent = 87; // Example active percentage

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="text.secondary">
                Total People
              </Typography>
              <Avatar sx={{ bgcolor: theme.palette.primary.lighter, color: theme.palette.primary.main }}>
                <PeopleIcon />
              </Avatar>
            </Stack>
          </Box>

          <Box>
            <Stack direction="row" alignItems="baseline" spacing={2}>
              <Typography variant="h3" component="p">
                {total.toLocaleString()}
              </Typography>
              <Chip
                size="small"
                icon={isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
                label={`${isPositive ? '+' : ''}${percentageChange}%`}
                color={isPositive ? 'success' : 'error'}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {period}
            </Typography>
          </Box>

          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                New this month
              </Typography>
              <Typography variant="h6">
                +{newThisMonth}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Active
              </Typography>
              <Typography variant="h6">
                {activePercent}%
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ width: '100%', height: 80 }}>
            <SparkLineChart
              data={data}
              height={80}
              area
              curve="natural"
              colors={[theme.palette.primary.main]}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#gradient-${total})`,
                  fillOpacity: 1,
                },
              }}
            >
              <defs>
                <linearGradient id={`gradient-${total}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                </linearGradient>
              </defs>
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Export all variants
export default {
  Default: TotalPeopleCardDefault,
  Gradient: TotalPeopleCardGradient,
  Minimal: TotalPeopleCardMinimal,
  Detailed: TotalPeopleCardDetailed
};