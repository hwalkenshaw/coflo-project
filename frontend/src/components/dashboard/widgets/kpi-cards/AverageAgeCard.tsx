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
  LinearProgress,
  Grid
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon,
  CalendarToday as CalendarIcon,
  Cake as CakeIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

interface AverageAgeCardProps {
  averageAge: number;
  medianAge?: number;
  change?: number;
  ageGroups?: { range: string; count: number; percentage: number }[];
  trend?: number[];
  variant?: 'default' | 'circular' | 'distribution' | 'timeline';
}

// Variant 1: Default with median comparison
export const AverageAgeCardDefault: React.FC<AverageAgeCardProps> = ({
  averageAge,
  medianAge = 32,
  change = 0.5,
  ageGroups = [
    { range: '18-25', count: 45, percentage: 18 },
    { range: '26-35', count: 98, percentage: 40 },
    { range: '36-45', count: 67, percentage: 27 },
    { range: '46+', count: 37, percentage: 15 }
  ]
}) => {
  const theme = useTheme();
  const isIncreasing = change > 0;

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography component="h2" variant="subtitle2" gutterBottom color="text.secondary">
              Average Age
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={2}>
              <Typography variant="h4" component="p">
                {averageAge.toFixed(1)} years
              </Typography>
              <Chip
                size="small"
                icon={isIncreasing ? <TrendingUpIcon /> : <TrendingDownIcon />}
                label={`${isIncreasing ? '+' : ''}${change} yrs`}
                variant="outlined"
                color={isIncreasing ? 'warning' : 'info'}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Median: {medianAge} years
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Age Distribution
            </Typography>
            <Stack spacing={1}>
              {ageGroups.map((group) => (
                <Box key={group.range}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="caption">{group.range}</Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {group.count} ({group.percentage}%)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={group.percentage}
                    sx={{
                      height: 6,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 1,
                        bgcolor: theme.palette.primary.main
                      }
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Variant 2: Circular visualization (donut chart focus)
export const AverageAgeCardCircular: React.FC<AverageAgeCardProps> = ({
  averageAge,
  medianAge = 32,
  change = 0.5,
  ageGroups = [
    { range: '18-25', count: 45, percentage: 18 },
    { range: '26-35', count: 98, percentage: 40 },
    { range: '36-45', count: 67, percentage: 27 },
    { range: '46+', count: 37, percentage: 15 }
  ]
}) => {
  const theme = useTheme();
  
  const pieData = ageGroups.map((group, index) => ({
    id: index,
    value: group.count,
    label: group.range
  }));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" color="text.secondary">
                Average Age
              </Typography>
              <Typography variant="h3">
                {averageAge.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                years old
              </Typography>
            </Box>
            <Avatar 
              sx={{ 
                bgcolor: alpha(theme.palette.warning.main, 0.1), 
                color: theme.palette.warning.main 
              }}
            >
              <CakeIcon />
            </Avatar>
          </Stack>

          <Box sx={{ height: 200, position: 'relative' }}>
            <PieChart
              series={[{
                data: pieData,
                innerRadius: 40,
                outerRadius: 80,
                paddingAngle: 2,
                cornerRadius: 4,
              }]}
              height={200}
              slotProps={{
                legend: {
                  direction: 'horizontal',
                  position: { vertical: 'bottom', horizontal: 'middle' },
                  padding: 0,
                  itemMarkWidth: 12,
                  itemMarkHeight: 12,
                  markGap: 5,
                  itemGap: 10,
                  sx: {
                    fontSize: 11,
                  },
                },
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {averageAge.toFixed(0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                avg
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" justifyContent="space-around">
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Median
              </Typography>
              <Typography variant="h6">
                {medianAge}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Change
              </Typography>
              <Typography variant="h6" color={change > 0 ? 'warning.main' : 'info.main'}>
                {change > 0 ? '+' : ''}{change}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Variant 3: Distribution focused with bar chart
export const AverageAgeCardDistribution: React.FC<AverageAgeCardProps> = ({
  averageAge,
  medianAge = 32,
  change = 0.5,
  ageGroups = [
    { range: '18-25', count: 45, percentage: 18 },
    { range: '26-35', count: 98, percentage: 40 },
    { range: '36-45', count: 67, percentage: 27 },
    { range: '46-55', count: 28, percentage: 11 },
    { range: '56+', count: 9, percentage: 4 }
  ]
}) => {
  const theme = useTheme();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="text.secondary">
              Age Analytics
            </Typography>
            <CalendarIcon color="action" />
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Average
                </Typography>
                <Typography variant="h4" color="primary">
                  {averageAge.toFixed(1)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Median
                </Typography>
                <Typography variant="h4">
                  {medianAge}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ height: 180 }}>
            <BarChart
              series={[{
                data: ageGroups.map(g => g.count),
                color: theme.palette.primary.main,
              }]}
              xAxis={[{
                data: ageGroups.map(g => g.range),
                scaleType: 'band',
              }]}
              height={180}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
          </Box>

          <Box sx={{ 
            p: 1.5, 
            bgcolor: alpha(theme.palette.info.main, 0.05),
            borderRadius: 1
          }}>
            <Typography variant="caption" color="text.secondary">
              Workforce is {change > 0 ? 'aging' : 'getting younger'} by {Math.abs(change)} years on average
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Variant 4: Timeline trend focused
export const AverageAgeCardTimeline: React.FC<AverageAgeCardProps> = ({
  averageAge,
  medianAge = 32,
  change = 0.5,
  trend = [33.2, 33.5, 33.4, 33.8, 34.0, 34.2, 34.1, 34.3, 34.5, 34.4, 34.6, 34.5]
}) => {
  const theme = useTheme();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TimelineIcon color="action" fontSize="small" />
                <Typography variant="h6" color="text.secondary">
                  Average Age Trend
                </Typography>
              </Stack>
            </Box>
            <Chip
              size="small"
              label={`${change > 0 ? '+' : ''}${change} yrs YoY`}
              color={change > 0 ? 'warning' : 'info'}
              variant="outlined"
            />
          </Stack>

          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="h3" color="primary">
                {averageAge.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Average
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3">
                {medianAge}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Median
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ height: 200 }}>
            <LineChart
              series={[{
                data: trend,
                label: 'Average Age',
                color: theme.palette.primary.main,
                curve: 'natural',
                area: true,
              }]}
              xAxis={[{
                data: months,
                scaleType: 'point',
              }]}
              height={200}
              margin={{ top: 10, bottom: 30, left: 50, right: 20 }}
              sx={{
                '& .MuiAreaElement-root': {
                  fillOpacity: 0.2,
                },
              }}
            />
          </Box>

          <Stack direction="row" spacing={2}>
            <Box sx={{ 
              flex: 1,
              p: 1,
              bgcolor: alpha(theme.palette.success.main, 0.05),
              borderRadius: 1,
              borderLeft: `3px solid ${theme.palette.success.main}`
            }}>
              <Typography variant="caption" color="text.secondary">
                Youngest: 18 years
              </Typography>
            </Box>
            <Box sx={{ 
              flex: 1,
              p: 1,
              bgcolor: alpha(theme.palette.error.main, 0.05),
              borderRadius: 1,
              borderLeft: `3px solid ${theme.palette.error.main}`
            }}>
              <Typography variant="caption" color="text.secondary">
                Oldest: 67 years
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Export all variants
export default {
  Default: AverageAgeCardDefault,
  Circular: AverageAgeCardCircular,
  Distribution: AverageAgeCardDistribution,
  Timeline: AverageAgeCardTimeline
};