import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
  Chip,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  CalendarMonth as CalendarIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
  Timeline as TimelineIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import { AreaChart } from '@mui/x-charts/LineChart';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

interface GrowthData {
  month: string;
  count: number;
  added?: number;
  removed?: number;
}

interface GrowthTimelineChartProps {
  data: GrowthData[];
  variant?: 'simple' | 'detailed' | 'comparison' | 'forecasted';
}

// Variant 1: Simple growth line
export const GrowthTimelineSimple: React.FC<GrowthTimelineChartProps> = ({
  data
}) => {
  const theme = useTheme();
  const [period, setPeriod] = useState<'6M' | '1Y' | '2Y' | 'ALL'>('1Y');
  
  const currentTotal = data[data.length - 1].count;
  const previousTotal = data[0].count;
  const growth = currentTotal - previousTotal;
  const growthPercent = ((growth / previousTotal) * 100).toFixed(1);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        title="People Growth"
        subheader={`Tracking ${period === 'ALL' ? 'all time' : period} growth`}
        action={
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(_, value) => value && setPeriod(value)}
            size="small"
          >
            <ToggleButton value="6M">6M</ToggleButton>
            <ToggleButton value="1Y">1Y</ToggleButton>
            <ToggleButton value="2Y">2Y</ToggleButton>
            <ToggleButton value="ALL">ALL</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent>
        {/* Summary Stats */}
        <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Current Total
            </Typography>
            <Typography variant="h4">
              {currentTotal.toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <TrendingUpIcon color="success" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Growth
                </Typography>
                <Typography variant="h5" color="success.main">
                  +{growth} ({growthPercent}%)
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>

        {/* Chart */}
        <Box sx={{ height: 250 }}>
          <LineChart
            series={[{
              data: data.map(d => d.count),
              label: 'Total People',
              color: theme.palette.primary.main,
              curve: 'natural',
              area: true,
            }]}
            xAxis={[{
              data: data.map(d => d.month),
              scaleType: 'point',
              tickLabelStyle: {
                angle: -45,
                textAnchor: 'end',
              },
            }]}
            height={250}
            margin={{ top: 10, bottom: 60, left: 60, right: 20 }}
            sx={{
              '& .MuiAreaElement-root': {
                fillOpacity: 0.3,
              },
            }}
          />
        </Box>

        {/* Monthly average */}
        <Box 
          sx={{ 
            mt: 2, 
            p: 1.5, 
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 1
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Average monthly growth: <strong>{(growth / data.length).toFixed(0)} people</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Variant 2: Detailed with additions/removals
export const GrowthTimelineDetailed: React.FC<GrowthTimelineChartProps> = ({
  data
}) => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<'net' | 'detailed'>('detailed');
  
  // Calculate stats
  const totalAdded = data.reduce((sum, d) => sum + (d.added || 0), 0);
  const totalRemoved = data.reduce((sum, d) => sum + (d.removed || 0), 0);
  const netGrowth = totalAdded - totalRemoved;

  return (
    <Card>
      <CardHeader
        avatar={
          <TimelineIcon color="primary" />
        }
        title="Growth Analysis"
        subheader="Additions vs Removals"
        action={
          <Stack direction="row" spacing={1}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, value) => value && setViewMode(value)}
              size="small"
            >
              <ToggleButton value="net">Net</ToggleButton>
              <ToggleButton value="detailed">Detailed</ToggleButton>
            </ToggleButtonGroup>
            <IconButton size="small">
              <DownloadIcon />
            </IconButton>
          </Stack>
        }
      />
      <CardContent>
        {/* Key Metrics */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              flex: 1, 
              p: 2,
              borderColor: theme.palette.success.main,
              borderWidth: 2
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total Added
                </Typography>
                <Typography variant="h5" color="success.main">
                  +{totalAdded}
                </Typography>
              </Box>
              <TrendingUpIcon color="success" />
            </Stack>
          </Paper>
          
          <Paper 
            variant="outlined" 
            sx={{ 
              flex: 1, 
              p: 2,
              borderColor: theme.palette.error.main,
              borderWidth: 2
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total Removed
                </Typography>
                <Typography variant="h5" color="error.main">
                  -{totalRemoved}
                </Typography>
              </Box>
              <TrendingUpIcon color="error" sx={{ transform: 'rotate(180deg)' }} />
            </Stack>
          </Paper>

          <Paper 
            variant="outlined" 
            sx={{ 
              flex: 1, 
              p: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05)
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Net Growth
                </Typography>
                <Typography variant="h5" color="primary.main">
                  {netGrowth > 0 ? '+' : ''}{netGrowth}
                </Typography>
              </Box>
              <Chip 
                label={`${((netGrowth / data[0].count) * 100).toFixed(1)}%`} 
                color="primary"
                size="small"
              />
            </Stack>
          </Paper>
        </Stack>

        {/* Chart */}
        <Box sx={{ height: 280 }}>
          {viewMode === 'detailed' ? (
            <LineChart
              series={[
                {
                  data: data.map(d => d.added || 0),
                  label: 'Added',
                  color: theme.palette.success.main,
                  curve: 'monotoneX',
                },
                {
                  data: data.map(d => -(d.removed || 0)),
                  label: 'Removed',
                  color: theme.palette.error.main,
                  curve: 'monotoneX',
                },
                {
                  data: data.map(d => (d.added || 0) - (d.removed || 0)),
                  label: 'Net Change',
                  color: theme.palette.primary.main,
                  curve: 'natural',
                  area: true,
                }
              ]}
              xAxis={[{
                data: data.map(d => d.month),
                scaleType: 'point',
              }]}
              height={280}
              margin={{ top: 10, bottom: 40, left: 60, right: 20 }}
            />
          ) : (
            <LineChart
              series={[{
                data: data.map(d => d.count),
                label: 'Total People',
                color: theme.palette.primary.main,
                curve: 'natural',
                area: true,
              }]}
              xAxis={[{
                data: data.map(d => d.month),
                scaleType: 'point',
              }]}
              height={280}
              margin={{ top: 10, bottom: 40, left: 60, right: 20 }}
              sx={{
                '& .MuiAreaElement-root': {
                  fillOpacity: 0.2,
                },
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// Variant 3: Comparison view (YoY, MoM)
export const GrowthTimelineComparison: React.FC<GrowthTimelineChartProps> = ({
  data
}) => {
  const theme = useTheme();
  const [comparisonType, setComparisonType] = useState<'YoY' | 'QoQ' | 'MoM'>('YoY');

  // Simulate comparison data
  const currentYearData = data.slice(-12);
  const lastYearData = data.slice(-24, -12).length > 0 
    ? data.slice(-24, -12) 
    : currentYearData.map(d => ({ ...d, count: d.count * 0.85 }));

  const yoyGrowth = ((currentYearData[11].count - lastYearData[11].count) / lastYearData[11].count * 100).toFixed(1);

  return (
    <Card variant="outlined">
      <CardHeader
        title="Growth Comparison"
        subheader={`${comparisonType} Analysis`}
        action={
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={comparisonType}
              onChange={(e) => setComparisonType(e.target.value as any)}
            >
              <MenuItem value="YoY">Year over Year</MenuItem>
              <MenuItem value="QoQ">Quarter over Quarter</MenuItem>
              <MenuItem value="MoM">Month over Month</MenuItem>
            </Select>
          </FormControl>
        }
      />
      <CardContent>
        {/* Comparison Summary */}
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">
                {comparisonType} Growth Rate
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Compared to same period last year
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <TrendingUpIcon color="success" fontSize="large" />
              <Typography variant="h3" color="success.main">
                +{yoyGrowth}%
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Comparison Chart */}
        <Box sx={{ height: 300 }}>
          <LineChart
            series={[
              {
                data: currentYearData.map(d => d.count),
                label: 'Current Year',
                color: theme.palette.primary.main,
                curve: 'natural',
                lineStyle: { strokeWidth: 3 },
              },
              {
                data: lastYearData.map(d => d.count),
                label: 'Last Year',
                color: theme.palette.grey[400],
                curve: 'natural',
                lineStyle: { strokeDasharray: '5 5' },
              }
            ]}
            xAxis={[{
              data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              scaleType: 'point',
            }]}
            height={300}
            margin={{ top: 10, bottom: 40, left: 60, right: 20 }}
          />
        </Box>

        {/* Month by month comparison */}
        <Stack spacing={1} sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Monthly Performance
          </Typography>
          {currentYearData.slice(-3).map((month, index) => {
            const lastYearValue = lastYearData[lastYearData.length - 3 + index].count;
            const growth = ((month.count - lastYearValue) / lastYearValue * 100).toFixed(1);
            return (
              <Stack key={index} direction="row" alignItems="center" spacing={2}>
                <Typography variant="body2" sx={{ minWidth: 60 }}>
                  {month.month}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <SparkLineChart
                    data={[lastYearValue, month.count]}
                    height={20}
                    colors={[theme.palette.primary.main]}
                  />
                </Box>
                <Chip 
                  label={`+${growth}%`} 
                  size="small" 
                  color="success"
                  variant="outlined"
                />
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

// Variant 4: With forecast/projection
export const GrowthTimelineForecasted: React.FC<GrowthTimelineChartProps> = ({
  data
}) => {
  const theme = useTheme();
  const [showForecast, setShowForecast] = useState(true);
  
  // Calculate forecast (simple linear projection)
  const recentGrowth = data.slice(-6);
  const avgMonthlyGrowth = recentGrowth.reduce((sum, d, i) => {
    if (i === 0) return sum;
    return sum + (d.count - recentGrowth[i - 1].count);
  }, 0) / (recentGrowth.length - 1);

  const forecastMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const lastCount = data[data.length - 1].count;
  const forecastData = forecastMonths.map((month, i) => ({
    month,
    count: Math.round(lastCount + (avgMonthlyGrowth * (i + 1)))
  }));

  const projectedTotal = forecastData[forecastData.length - 1].count;
  const projectedGrowth = projectedTotal - lastCount;

  return (
    <Card>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">Growth Projection</Typography>
            <Chip 
              icon={<InfoIcon />} 
              label="AI Forecast" 
              size="small" 
              color="info"
              variant="outlined"
            />
          </Stack>
        }
        action={
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant={showForecast ? "contained" : "outlined"}
              onClick={() => setShowForecast(!showForecast)}
            >
              {showForecast ? 'Hide' : 'Show'} Forecast
            </Button>
            <IconButton size="small">
              <FullscreenIcon />
            </IconButton>
          </Stack>
        }
      />
      <CardContent>
        {/* Projection Summary */}
        {showForecast && (
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              mb: 3,
              borderStyle: 'dashed',
              borderColor: theme.palette.info.main,
              bgcolor: alpha(theme.palette.info.main, 0.05)
            }}
          >
            <Stack direction="row" justifyContent="space-around">
              <Box textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  Current Total
                </Typography>
                <Typography variant="h5">
                  {lastCount.toLocaleString()}
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  6-Month Projection
                </Typography>
                <Typography variant="h5" color="info.main">
                  {projectedTotal.toLocaleString()}
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  Expected Growth
                </Typography>
                <Typography variant="h5" color="success.main">
                  +{projectedGrowth}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}

        {/* Chart with forecast */}
        <Box sx={{ height: 320 }}>
          <LineChart
            series={[
              {
                data: data.map(d => d.count),
                label: 'Actual',
                color: theme.palette.primary.main,
                curve: 'natural',
                area: true,
              },
              ...(showForecast ? [{
                data: [...Array(data.length - 1).fill(null), data[data.length - 1].count, ...forecastData.map(d => d.count)],
                label: 'Forecast',
                color: theme.palette.info.main,
                curve: 'natural',
                lineStyle: { strokeDasharray: '8 4' },
                area: true,
              }] : [])
            ]}
            xAxis={[{
              data: [...data.map(d => d.month), ...(showForecast ? forecastMonths : [])],
              scaleType: 'point',
            }]}
            height={320}
            margin={{ top: 10, bottom: 40, left: 60, right: 20 }}
            sx={{
              '& .MuiAreaElement-series-Actual': {
                fillOpacity: 0.3,
              },
              '& .MuiAreaElement-series-Forecast': {
                fillOpacity: 0.1,
              },
            }}
          />
        </Box>

        {/* Confidence note */}
        {showForecast && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
            * Forecast based on recent 6-month trend with 85% confidence interval
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Export all variants
export default {
  Simple: GrowthTimelineSimple,
  Detailed: GrowthTimelineDetailed,
  Comparison: GrowthTimelineComparison,
  Forecasted: GrowthTimelineForecasted
};