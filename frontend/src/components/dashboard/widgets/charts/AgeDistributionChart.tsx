import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Stack,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
  Chip,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';

interface AgeGroup {
  range: string;
  count: number;
  percentage: number;
  color?: string;
}

interface AgeDistributionChartProps {
  data: AgeGroup[];
  variant?: 'bar' | 'pie' | 'stacked' | 'interactive';
}

// Variant 1: Classic Bar Chart
export const AgeDistributionBar: React.FC<AgeDistributionChartProps> = ({
  data
}) => {
  const theme = useTheme();
  const totalPeople = data.reduce((sum, group) => sum + group.count, 0);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        title="Age Distribution"
        subheader={`Total: ${totalPeople} people`}
        action={
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Box sx={{ height: 300 }}>
          <BarChart
            series={[{
              data: data.map(g => g.count),
              label: 'People Count',
              color: theme.palette.primary.main,
            }]}
            xAxis={[{
              data: data.map(g => g.range),
              scaleType: 'band',
              tickLabelStyle: {
                angle: 0,
                textAnchor: 'middle',
              },
            }]}
            yAxis={[{
              label: 'Number of People',
            }]}
            height={300}
            margin={{ top: 20, bottom: 40, left: 60, right: 20 }}
            slotProps={{
              bar: {
                clipPath: 'inset(0px round 4px 4px 0px 0px)',
              },
            }}
          />
        </Box>
        
        {/* Statistics Summary */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Largest Group
            </Typography>
            <Typography variant="subtitle2" fontWeight={600}>
              {data.reduce((max, g) => g.count > max.count ? g : max).range}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Average Distribution
            </Typography>
            <Typography variant="subtitle2" fontWeight={600}>
              {(totalPeople / data.length).toFixed(0)} per group
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Variant 2: Pie/Donut Chart
export const AgeDistributionPie: React.FC<AgeDistributionChartProps> = ({
  data
}) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState<'pie' | 'donut'>('donut');
  
  const pieData = data.map((group, index) => ({
    id: index,
    value: group.count,
    label: group.range,
    color: group.color || theme.palette.primary[index % 2 === 0 ? 'main' : 'light']
  }));

  const totalPeople = data.reduce((sum, group) => sum + group.count, 0);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Age Demographics"
        action={
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(_, value) => value && setChartType(value)}
            size="small"
          >
            <ToggleButton value="pie">
              <PieChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="donut">
              <PieChartIcon fontSize="small" sx={{ '& circle': { fill: 'none' } }} />
            </ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent>
        <Box sx={{ height: 320, position: 'relative' }}>
          <PieChart
            series={[{
              data: pieData,
              innerRadius: chartType === 'donut' ? 60 : 0,
              outerRadius: 120,
              paddingAngle: 2,
              cornerRadius: 4,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            }]}
            height={320}
            slotProps={{
              legend: {
                direction: 'column',
                position: { vertical: 'middle', horizontal: 'right' },
                padding: 0,
                itemMarkWidth: 12,
                itemMarkHeight: 12,
                markgap: 5,
                itemgap: 8,
              },
            }}
          />
          {chartType === 'donut' && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '35%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}
            >
              <Typography variant="h4" fontWeight={600}>
                {totalPeople}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total People
              </Typography>
            </Box>
          )}
        </Box>

        {/* Percentage breakdown */}
        <Stack spacing={1} sx={{ mt: 2 }}>
          {data.map((group, index) => (
            <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: pieData[index].color
                  }}
                />
                <Typography variant="body2">{group.range}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" fontWeight={500}>
                  {group.count}
                </Typography>
                <Chip 
                  label={`${group.percentage}%`} 
                  size="small" 
                  variant="outlined"
                />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

// Variant 3: Stacked/Grouped Bar with Gender Split
export const AgeDistributionStacked: React.FC<AgeDistributionChartProps> = ({
  data
}) => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<'stacked' | 'grouped'>('stacked');
  
  // Simulated gender split data
  const maleData = data.map(g => Math.floor(g.count * 0.55));
  const femaleData = data.map(g => Math.floor(g.count * 0.45));

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <GroupsIcon color="primary" />
        }
        title="Age & Gender Distribution"
        action={
          <Stack direction="row" spacing={1}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, value) => value && setViewMode(value)}
              size="small"
            >
              <ToggleButton value="stacked">Stacked</ToggleButton>
              <ToggleButton value="grouped">Grouped</ToggleButton>
            </ToggleButtonGroup>
            <IconButton size="small">
              <DownloadIcon />
            </IconButton>
          </Stack>
        }
      />
      <CardContent>
        <Box sx={{ height: 280 }}>
          <BarChart
            series={[
              {
                data: maleData,
                label: 'Male',
                color: theme.palette.info.main,
                stack: viewMode === 'stacked' ? 'total' : undefined,
              },
              {
                data: femaleData,
                label: 'Female',
                color: theme.palette.secondary.main,
                stack: viewMode === 'stacked' ? 'total' : undefined,
              }
            ]}
            xAxis={[{
              data: data.map(g => g.range),
              scaleType: 'band',
            }]}
            height={280}
            margin={{ top: 20, bottom: 40, left: 50, right: 20 }}
          />
        </Box>

        {/* Gender summary */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Box 
            sx={{ 
              flex: 1, 
              p: 1.5, 
              borderRadius: 1,
              bgcolor: alpha(theme.palette.info.main, 0.1),
              borderLeft: `3px solid ${theme.palette.info.main}`
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Male</Typography>
              <Typography variant="body2" fontWeight={600}>55%</Typography>
            </Stack>
          </Box>
          <Box 
            sx={{ 
              flex: 1, 
              p: 1.5, 
              borderRadius: 1,
              bgcolor: alpha(theme.palette.secondary.main, 0.1),
              borderLeft: `3px solid ${theme.palette.secondary.main}`
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Female</Typography>
              <Typography variant="body2" fontWeight={600}>45%</Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Variant 4: Interactive with filters
export const AgeDistributionInteractive: React.FC<AgeDistributionChartProps> = ({
  data
}) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  const [department, setDepartment] = useState<string>('all');
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <PieChart
            series={[{
              data: data.map((g, i) => ({
                id: i,
                value: g.count,
                label: g.range,
              })),
              innerRadius: 40,
              outerRadius: 100,
            }]}
            height={250}
            slotProps={{
              legend: { hidden: true },
            }}
          />
        );
      case 'line':
        return (
          <LineChart
            series={[{
              data: data.map(g => g.count),
              label: 'Age Distribution',
              color: theme.palette.primary.main,
              curve: 'catmullRom',
              area: true,
            }]}
            xAxis={[{
              data: data.map(g => g.range),
              scaleType: 'point',
            }]}
            height={250}
            margin={{ top: 20, bottom: 40, left: 50, right: 20 }}
          />
        );
      default:
        return (
          <BarChart
            series={[{
              data: data.map(g => g.count),
              color: theme.palette.primary.main,
            }]}
            xAxis={[{
              data: data.map(g => g.range),
              scaleType: 'band',
            }]}
            height={250}
            margin={{ top: 20, bottom: 40, left: 50, right: 20 }}
            onItemClick={(event, d) => {
              if (d && 'dataIndex' in d) {
                setSelectedRange(data[d.dataIndex].range);
              }
            }}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader
        title="Interactive Age Analysis"
        subheader={selectedRange ? `Selected: ${selectedRange}` : 'Click on a bar for details'}
        action={
          <IconButton size="small">
            <FullscreenIcon />
          </IconButton>
        }
      />
      <CardContent>
        {/* Controls */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={department}
              label="Department"
              onChange={(e) => setDepartment(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="engineering">Engineering</MenuItem>
              <MenuItem value="sales">Sales</MenuItem>
              <MenuItem value="hr">HR</MenuItem>
            </Select>
          </FormControl>
          
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(_, value) => value && setChartType(value)}
            size="small"
          >
            <ToggleButton value="bar">
              <BarChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="pie">
              <PieChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="line">
              <ShowChartIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {/* Chart */}
        <Box sx={{ height: 250 }}>
          {renderChart()}
        </Box>

        {/* Selected Range Details */}
        {selectedRange && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {selectedRange} Age Group Details
            </Typography>
            <Stack direction="row" spacing={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Count
                </Typography>
                <Typography variant="h6">
                  {data.find(g => g.range === selectedRange)?.count}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Percentage
                </Typography>
                <Typography variant="h6">
                  {data.find(g => g.range === selectedRange)?.percentage}%
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Department Split
                </Typography>
                <Typography variant="h6">
                  View Details →
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {/* Quick Stats */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {data.slice(0, 3).map((group, index) => (
            <Chip
              key={index}
              label={`${group.range}: ${group.percentage}%`}
              size="small"
              variant="outlined"
              onClick={() => setSelectedRange(group.range)}
              color={selectedRange === group.range ? 'primary' : 'default'}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

// Export all variants
export default {
  Bar: AgeDistributionBar,
  Pie: AgeDistributionPie,
  Stacked: AgeDistributionStacked,
  Interactive: AgeDistributionInteractive
};