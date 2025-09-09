import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Paper,
  Tabs,
  Tab,
  Divider,
  useTheme,
  alpha,
  Button,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ViewModule as ViewModuleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Import all widget variations
import TotalPeopleCard from '../components/dashboard/widgets/kpi-cards/TotalPeopleCard';
import AverageAgeCard from '../components/dashboard/widgets/kpi-cards/AverageAgeCard';
import UpcomingBirthdaysWidget from '../components/dashboard/widgets/list-widgets/UpcomingBirthdaysWidget';
import RecentActivityWidget from '../components/dashboard/widgets/list-widgets/RecentActivityWidget';
import AgeDistributionChart from '../components/dashboard/widgets/charts/AgeDistributionChart';
import GrowthTimelineChart from '../components/dashboard/widgets/charts/GrowthTimelineChart';
import BirthdayCalendarWidget from '../components/dashboard/widgets/charts/BirthdayCalendarWidget';

// Sample data
const sampleData = {
  totalPeople: 247,
  percentageChange: 12.5,
  sparklineData: [120, 135, 125, 145, 160, 175, 165, 180, 195, 210, 225, 247],
  averageAge: 34.5,
  medianAge: 32,
  ageChange: 0.5,
  ageGroups: [
    { range: '18-25', count: 45, percentage: 18 },
    { range: '26-35', count: 98, percentage: 40 },
    { range: '36-45', count: 67, percentage: 27 },
    { range: '46-55', count: 28, percentage: 11 },
    { range: '56+', count: 9, percentage: 4 }
  ],
  birthdays: [
    { id: 1, name: 'John Doe', date: new Date(), age: 30, department: 'Engineering' },
    { id: 2, name: 'Jane Smith', date: new Date(Date.now() + 86400000), age: 28, department: 'Marketing' },
    { id: 3, name: 'Bob Johnson', date: new Date(Date.now() + 172800000), age: 35, department: 'Sales' },
    { id: 4, name: 'Alice Brown', date: new Date(Date.now() + 259200000), age: 32, department: 'HR' },
    { id: 5, name: 'Charlie Wilson', date: new Date(Date.now() + 345600000), age: 29, department: 'Engineering' },
    { id: 6, name: 'Diana Martinez', date: new Date(Date.now() + 432000000), age: 31, department: 'Finance' },
    { id: 7, name: 'Eva Davis', date: new Date(Date.now() + 518400000), age: 27, department: 'Marketing' }
  ],
  activities: [
    { id: 1, type: 'add' as const, personName: 'Sarah Johnson', performedBy: 'Admin', timestamp: new Date(Date.now() - 300000), details: 'Added to Engineering team' },
    { id: 2, type: 'edit' as const, personName: 'Mike Chen', performedBy: 'HR Manager', timestamp: new Date(Date.now() - 3600000), details: 'Updated contact information' },
    { id: 3, type: 'add' as const, personName: 'Lisa Anderson', performedBy: 'Admin', timestamp: new Date(Date.now() - 7200000), details: 'Added to Sales team' },
    { id: 4, type: 'update' as const, personName: 'Tom Williams', performedBy: 'Manager', timestamp: new Date(Date.now() - 10800000), details: 'Role changed to Senior Developer' },
    { id: 5, type: 'delete' as const, personName: 'Robert Taylor', performedBy: 'Admin', timestamp: new Date(Date.now() - 86400000), details: 'Account deactivated' },
    { id: 6, type: 'add' as const, personName: 'Emma Wilson', performedBy: 'HR Manager', timestamp: new Date(Date.now() - 172800000), details: 'Added to Marketing team' }
  ],
  growthData: [
    { month: 'Jan', count: 180, added: 15, removed: 3 },
    { month: 'Feb', count: 185, added: 10, removed: 5 },
    { month: 'Mar', count: 195, added: 15, removed: 5 },
    { month: 'Apr', count: 200, added: 8, removed: 3 },
    { month: 'May', count: 210, added: 15, removed: 5 },
    { month: 'Jun', count: 215, added: 10, removed: 5 },
    { month: 'Jul', count: 225, added: 15, removed: 5 },
    { month: 'Aug', count: 230, added: 10, removed: 5 },
    { month: 'Sep', count: 235, added: 12, removed: 7 },
    { month: 'Oct', count: 240, added: 10, removed: 5 },
    { month: 'Nov', count: 245, added: 8, removed: 3 },
    { month: 'Dec', count: 247, added: 5, removed: 3 }
  ]
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`widget-tabpanel-${index}`}
      aria-labelledby={`widget-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function WidgetShowcase() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <DashboardIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="h4" fontWeight={600}>
                Dashboard Widget Showcase
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose from multiple variations for each widget type
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button startIcon={<RefreshIcon />} variant="outlined">
              Refresh Data
            </Button>
            <Button startIcon={<ViewModuleIcon />} variant="contained">
              Configure Dashboard
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="widget categories">
          <Tab label="KPI Cards" />
          <Tab label="List Widgets" />
          <Tab label="Charts" />
          <Tab label="Calendars" />
          <Tab label="Combined View" />
        </Tabs>
      </Box>

      {/* KPI Cards Tab */}
      <TabPanel value={activeTab} index={0}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h5" gutterBottom fontWeight={500}>
              Total People KPI Card Variations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Different styles for displaying total people count with trends
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <TotalPeopleCard.Default 
                  total={sampleData.totalPeople}
                  percentageChange={sampleData.percentageChange}
                  data={sampleData.sparklineData}
                />
                <Chip label="Default" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <TotalPeopleCard.Gradient
                  total={sampleData.totalPeople}
                  percentageChange={sampleData.percentageChange}
                />
                <Chip label="Gradient" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <TotalPeopleCard.Minimal
                  total={sampleData.totalPeople}
                  percentageChange={sampleData.percentageChange}
                />
                <Chip label="Minimal" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <TotalPeopleCard.Detailed
                  total={sampleData.totalPeople}
                  percentageChange={sampleData.percentageChange}
                  data={sampleData.sparklineData}
                />
                <Chip label="Detailed" size="small" sx={{ mt: 1 }} />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h5" gutterBottom fontWeight={500}>
              Average Age KPI Card Variations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Display average age with distribution and trends
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <AverageAgeCard.Default
                  averageAge={sampleData.averageAge}
                  medianAge={sampleData.medianAge}
                  change={sampleData.ageChange}
                  ageGroups={sampleData.ageGroups}
                />
                <Chip label="Default" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <AverageAgeCard.Circular
                  averageAge={sampleData.averageAge}
                  medianAge={sampleData.medianAge}
                  change={sampleData.ageChange}
                  ageGroups={sampleData.ageGroups}
                />
                <Chip label="Circular" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <AverageAgeCard.Distribution
                  averageAge={sampleData.averageAge}
                  medianAge={sampleData.medianAge}
                  change={sampleData.ageChange}
                  ageGroups={sampleData.ageGroups}
                />
                <Chip label="Distribution" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <AverageAgeCard.Timeline
                  averageAge={sampleData.averageAge}
                  medianAge={sampleData.medianAge}
                  change={sampleData.ageChange}
                />
                <Chip label="Timeline" size="small" sx={{ mt: 1 }} />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </TabPanel>

      {/* List Widgets Tab */}
      <TabPanel value={activeTab} index={1}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h5" gutterBottom fontWeight={500}>
              Upcoming Birthdays Widget Variations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Different ways to display upcoming birthdays
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <UpcomingBirthdaysWidget.Default birthdays={sampleData.birthdays} />
                <Chip label="Default List" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <UpcomingBirthdaysWidget.Compact birthdays={sampleData.birthdays} />
                <Chip label="Compact" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <UpcomingBirthdaysWidget.Detailed birthdays={sampleData.birthdays} />
                <Chip label="Detailed with Actions" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <UpcomingBirthdaysWidget.Celebratory birthdays={sampleData.birthdays} />
                <Chip label="Celebratory" size="small" sx={{ mt: 1 }} />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h5" gutterBottom fontWeight={500}>
              Recent Activity Widget Variations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Track recent changes and activities
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <RecentActivityWidget.Default activities={sampleData.activities} />
                <Chip label="Default" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <RecentActivityWidget.Timeline activities={sampleData.activities} />
                <Chip label="Timeline" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <RecentActivityWidget.Compact activities={sampleData.activities} />
                <Chip label="Compact" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <RecentActivityWidget.Detailed activities={sampleData.activities} />
                <Chip label="Detailed" size="small" sx={{ mt: 1 }} />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </TabPanel>

      {/* Charts Tab */}
      <TabPanel value={activeTab} index={2}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h5" gutterBottom fontWeight={500}>
              Age Distribution Chart Variations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Visualize age demographics in different ways
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <AgeDistributionChart.Bar data={sampleData.ageGroups} />
                <Chip label="Bar Chart" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <AgeDistributionChart.Pie data={sampleData.ageGroups} />
                <Chip label="Pie/Donut" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <AgeDistributionChart.Stacked data={sampleData.ageGroups} />
                <Chip label="Stacked/Grouped" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <AgeDistributionChart.Interactive data={sampleData.ageGroups} />
                <Chip label="Interactive" size="small" sx={{ mt: 1 }} />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h5" gutterBottom fontWeight={500}>
              Growth Timeline Chart Variations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Track growth and changes over time
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <GrowthTimelineChart.Simple data={sampleData.growthData} />
                <Chip label="Simple" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <GrowthTimelineChart.Detailed data={sampleData.growthData} />
                <Chip label="Detailed" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <GrowthTimelineChart.Comparison data={sampleData.growthData} />
                <Chip label="Comparison" size="small" sx={{ mt: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <GrowthTimelineChart.Forecasted data={sampleData.growthData} />
                <Chip label="With Forecast" size="small" sx={{ mt: 1 }} />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </TabPanel>

      {/* Calendars Tab */}
      <TabPanel value={activeTab} index={3}>
        <Box>
          <Typography variant="h5" gutterBottom fontWeight={500}>
            Birthday Calendar Widget Variations
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Calendar views for birthday tracking
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <BirthdayCalendarWidget.Mini birthdays={sampleData.birthdays} />
              <Chip label="Mini Calendar" size="small" sx={{ mt: 1 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <BirthdayCalendarWidget.Full birthdays={sampleData.birthdays} />
              <Chip label="Full Calendar" size="small" sx={{ mt: 1 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <BirthdayCalendarWidget.List birthdays={sampleData.birthdays} />
              <Chip label="List View" size="small" sx={{ mt: 1 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <BirthdayCalendarWidget.Hybrid birthdays={sampleData.birthdays} />
              <Chip label="Hybrid View" size="small" sx={{ mt: 1 }} />
            </Grid>
          </Grid>
        </Box>
      </TabPanel>

      {/* Combined View Tab */}
      <TabPanel value={activeTab} index={4}>
        <Box>
          <Typography variant="h5" gutterBottom fontWeight={500}>
            Sample Dashboard Layout
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Example of how widgets can be combined in a dashboard
          </Typography>
          
          <Grid container spacing={3}>
            {/* Top Row - KPI Cards */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TotalPeopleCard.Default 
                total={sampleData.totalPeople}
                percentageChange={sampleData.percentageChange}
                data={sampleData.sparklineData}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <AverageAgeCard.Default
                averageAge={sampleData.averageAge}
                medianAge={sampleData.medianAge}
                change={sampleData.ageChange}
                ageGroups={sampleData.ageGroups}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TotalPeopleCard.Gradient
                total={18}
                percentageChange={200}
                period="New this month"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <UpcomingBirthdaysWidget.Compact birthdays={sampleData.birthdays.slice(0, 3)} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <GrowthTimelineChart.Detailed data={sampleData.growthData} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <AgeDistributionChart.Pie data={sampleData.ageGroups} />
            </Grid>

            {/* Bottom Row - Lists and Calendar */}
            <Grid size={{ xs: 12, md: 4 }}>
              <RecentActivityWidget.Timeline activities={sampleData.activities} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <UpcomingBirthdaysWidget.Default birthdays={sampleData.birthdays} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <BirthdayCalendarWidget.Mini birthdays={sampleData.birthdays} />
            </Grid>
          </Grid>
        </Box>
      </TabPanel>
    </Container>
  );
}