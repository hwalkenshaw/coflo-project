import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Stack,
  IconButton,
  useTheme,
  alpha,
  Chip,
  Avatar,
  Badge,
  Tooltip,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Cake as CakeIcon,
  CalendarMonth as CalendarIcon,
  Today as TodayIcon,
  Celebration as CelebrationIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { DateCalendar, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isSameDay, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';

interface Birthday {
  id: number;
  name: string;
  date: Date;
  avatar?: string;
  department?: string;
}

interface BirthdayCalendarWidgetProps {
  birthdays: Birthday[];
  variant?: 'mini' | 'full' | 'list' | 'hybrid';
}

// Custom day component for calendar
const BirthdayPickersDay = (props: PickersDayProps<Date> & { birthdays: Birthday[] }) => {
  const { birthdays, day, ...other } = props;
  const theme = useTheme();
  
  const dayBirthdays = birthdays.filter(b => 
    b.date.getDate() === day.getDate() && 
    b.date.getMonth() === day.getMonth()
  );
  
  const hasBirthday = dayBirthdays.length > 0;
  const isToday = isSameDay(day, new Date());

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={hasBirthday ? dayBirthdays.length : undefined}
      color="error"
    >
      <PickersDay
        {...other}
        day={day}
        sx={{
          ...(hasBirthday && {
            bgcolor: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
            fontWeight: 600,
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.2),
            },
          }),
          ...(isToday && {
            border: `2px solid ${theme.palette.primary.main}`,
          }),
        }}
      />
    </Badge>
  );
};

// Variant 1: Mini Calendar
export const BirthdayCalendarMini: React.FC<BirthdayCalendarWidgetProps> = ({
  birthdays
}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthBirthdays = birthdays.filter(b => 
    isSameMonth(b.date, currentMonth)
  );

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const firstDay = startOfMonth(currentMonth);
  const lastDay = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
  const startPadding = getDay(firstDay);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        title="Birthday Calendar"
        subheader={format(currentMonth, 'MMMM yyyy')}
        action={
          <Stack direction="row">
            <IconButton size="small" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton size="small" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRightIcon />
            </IconButton>
          </Stack>
        }
      />
      <CardContent>
        {/* Month summary */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip 
            icon={<CakeIcon />} 
            label={`${monthBirthdays.length} birthdays`} 
            size="small" 
            color="primary"
            variant="outlined"
          />
          {monthBirthdays.some(b => isSameDay(b.date, new Date())) && (
            <Chip 
              icon={<CelebrationIcon />} 
              label="Today!" 
              size="small" 
              color="error"
            />
          )}
        </Stack>

        {/* Mini calendar grid */}
        <Box>
          <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
            {days.map(day => (
              <Box 
                key={day} 
                sx={{ 
                  width: 32, 
                  textAlign: 'center',
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {day}
              </Box>
            ))}
          </Stack>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
            {Array.from({ length: startPadding }).map((_, i) => (
              <Box key={`pad-${i}`} sx={{ width: 32, height: 32 }} />
            ))}
            {daysInMonth.map(day => {
              const dayBirthdays = monthBirthdays.filter(b => 
                b.date.getDate() === day.getDate()
              );
              const hasBirthday = dayBirthdays.length > 0;
              const isToday = isSameDay(day, new Date());
              
              return (
                <Tooltip
                  key={day.toString()}
                  title={hasBirthday ? dayBirthdays.map(b => b.name).join(', ') : ''}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      cursor: hasBirthday ? 'pointer' : 'default',
                      bgcolor: hasBirthday 
                        ? alpha(theme.palette.error.main, 0.1)
                        : 'transparent',
                      color: hasBirthday 
                        ? theme.palette.error.main 
                        : 'text.primary',
                      border: isToday 
                        ? `2px solid ${theme.palette.primary.main}`
                        : 'none',
                      fontWeight: hasBirthday ? 600 : 400,
                      fontSize: '0.875rem',
                      position: 'relative',
                      '&:hover': hasBirthday ? {
                        bgcolor: alpha(theme.palette.error.main, 0.2),
                      } : {},
                    }}
                  >
                    {day.getDate()}
                    {hasBirthday && dayBirthdays.length > 1 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: theme.palette.error.main,
                          color: 'white',
                          fontSize: '0.625rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {dayBirthdays.length}
                      </Box>
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>

        {/* Upcoming birthdays list */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            This Month
          </Typography>
          <Stack spacing={0.5}>
            {monthBirthdays.slice(0, 3).map(birthday => (
              <Stack 
                key={birthday.id} 
                direction="row" 
                alignItems="center" 
                spacing={1}
                sx={{
                  p: 0.5,
                  borderRadius: 0.5,
                  bgcolor: alpha(theme.palette.grey[100], 0.5),
                  ...theme.applyStyles('dark', {
                    bgcolor: alpha(theme.palette.grey[900], 0.5)
                  })
                }}
              >
                <Avatar sx={{ width: 24, height: 24 }} src={birthday.avatar}>
                  {birthday.name.charAt(0)}
                </Avatar>
                <Typography variant="caption" sx={{ flex: 1 }}>
                  {birthday.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(birthday.date, 'MMM d')}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

// Variant 2: Full Calendar with MUI X
export const BirthdayCalendarFull: React.FC<BirthdayCalendarWidgetProps> = ({
  birthdays
}) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  const selectedBirthdays = selectedDate 
    ? birthdays.filter(b => 
        b.date.getDate() === selectedDate.getDate() && 
        b.date.getMonth() === selectedDate.getMonth()
      )
    : [];

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        avatar={
          <CalendarIcon color="primary" />
        }
        title="Birthday Calendar"
        subheader="Click on dates to see birthdays"
      />
      <CardContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateCalendar
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            slots={{
              day: BirthdayPickersDay as any,
            }}
            slotProps={{
              day: {
                birthdays,
              } as any,
            }}
          />
        </LocalizationProvider>

        {selectedBirthdays.length > 0 && (
          <Paper 
            variant="outlined" 
            sx={{ 
              mt: 2, 
              p: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.02)
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Birthdays on {selectedDate && format(selectedDate, 'MMMM d')}
            </Typography>
            <List dense>
              {selectedBirthdays.map(birthday => (
                <ListItem key={birthday.id}>
                  <ListItemAvatar>
                    <Avatar src={birthday.avatar}>
                      {birthday.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={birthday.name}
                    secondary={birthday.department}
                  />
                  <Button size="small" startIcon={<CakeIcon />}>
                    Send Wishes
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

// Variant 3: List View with Timeline
export const BirthdayCalendarList: React.FC<BirthdayCalendarWidgetProps> = ({
  birthdays
}) => {
  const theme = useTheme();
  const [viewMonth, setViewMonth] = useState(new Date());
  
  // Group birthdays by week
  const sortedBirthdays = [...birthdays]
    .filter(b => isSameMonth(b.date, viewMonth))
    .sort((a, b) => a.date.getDate() - b.date.getDate());

  const weeks: { weekLabel: string; birthdays: Birthday[] }[] = [];
  let currentWeek: Birthday[] = [];
  let currentWeekNum = 0;

  sortedBirthdays.forEach(birthday => {
    const weekNum = Math.floor((birthday.date.getDate() - 1) / 7);
    if (weekNum !== currentWeekNum && currentWeek.length > 0) {
      weeks.push({
        weekLabel: `Week ${currentWeekNum + 1}`,
        birthdays: currentWeek
      });
      currentWeek = [];
      currentWeekNum = weekNum;
    }
    currentWeek.push(birthday);
  });
  if (currentWeek.length > 0) {
    weeks.push({
      weekLabel: `Week ${currentWeekNum + 1}`,
      birthdays: currentWeek
    });
  }

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <EventIcon />
            <Typography variant="h6">Birthday Schedule</Typography>
          </Stack>
        }
        subheader={format(viewMonth, 'MMMM yyyy')}
        action={
          <Stack direction="row" spacing={1}>
            <Button 
              size="small" 
              onClick={() => setViewMonth(new Date())}
              startIcon={<TodayIcon />}
            >
              Today
            </Button>
            <IconButton size="small" onClick={() => setViewMonth(subMonths(viewMonth, 1))}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton size="small" onClick={() => setViewMonth(addMonths(viewMonth, 1))}>
              <ChevronRightIcon />
            </IconButton>
          </Stack>
        }
      />
      <CardContent>
        <Stack spacing={2}>
          {weeks.map((week, weekIndex) => (
            <Box key={weekIndex}>
              <Typography 
                variant="overline" 
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                {week.weekLabel}
              </Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {week.birthdays.map(birthday => {
                  const isToday = isSameDay(birthday.date, new Date());
                  return (
                    <Paper
                      key={birthday.id}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderLeft: `4px solid ${isToday ? theme.palette.error.main : theme.palette.primary.main}`,
                        bgcolor: isToday ? alpha(theme.palette.error.main, 0.05) : 'transparent'
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar src={birthday.avatar}>
                          {birthday.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {birthday.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(birthday.date, 'EEEE, MMMM d')}
                            {birthday.department && ` • ${birthday.department}`}
                          </Typography>
                        </Box>
                        {isToday && (
                          <Chip 
                            icon={<CelebrationIcon />} 
                            label="TODAY" 
                            color="error" 
                            size="small"
                          />
                        )}
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Stack>

        {sortedBirthdays.length === 0 && (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 4,
              color: 'text.secondary'
            }}
          >
            <CakeIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
            <Typography variant="body2">
              No birthdays this month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Variant 4: Hybrid View
export const BirthdayCalendarHybrid: React.FC<BirthdayCalendarWidgetProps> = ({
  birthdays
}) => {
  const theme = useTheme();
  const today = new Date();
  const thisWeekBirthdays = birthdays.filter(b => {
    const dayDiff = Math.abs(b.date.getDate() - today.getDate());
    return b.date.getMonth() === today.getMonth() && dayDiff <= 7;
  });

  const thisMonthCount = birthdays.filter(b => 
    b.date.getMonth() === today.getMonth()
  ).length;

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          {/* Header Stats */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: 'white'
                }}
              >
                <CakeIcon />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Birthday Tracker
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(today, 'MMMM yyyy')}
                </Typography>
              </Box>
            </Stack>
            <Stack textAlign="right">
              <Typography variant="h4" color="primary">
                {thisMonthCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This month
              </Typography>
            </Stack>
          </Stack>

          {/* Quick Calendar View */}
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              This Week
            </Typography>
            <Stack direction="row" spacing={1}>
              {Array.from({ length: 7 }).map((_, index) => {
                const date = new Date(today);
                date.setDate(today.getDate() + index - 3);
                const dayBirthdays = birthdays.filter(b => 
                  b.date.getDate() === date.getDate() && 
                  b.date.getMonth() === date.getMonth()
                );
                const isToday = index === 3;

                return (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      textAlign: 'center',
                      p: 1,
                      borderRadius: 1,
                      border: isToday ? `2px solid ${theme.palette.primary.main}` : 'none',
                      bgcolor: dayBirthdays.length > 0 
                        ? alpha(theme.palette.error.main, 0.1)
                        : alpha(theme.palette.grey[100], 0.5),
                      ...theme.applyStyles('dark', {
                        bgcolor: dayBirthdays.length > 0 
                          ? alpha(theme.palette.error.main, 0.1)
                          : alpha(theme.palette.grey[900], 0.5)
                      })
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontWeight: isToday ? 600 : 400 }}
                    >
                      {format(date, 'EEE')}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: dayBirthdays.length > 0 ? 600 : 400,
                        color: dayBirthdays.length > 0 ? theme.palette.error.main : 'text.primary'
                      }}
                    >
                      {date.getDate()}
                    </Typography>
                    {dayBirthdays.length > 0 && (
                      <Chip 
                        label={dayBirthdays.length} 
                        size="small" 
                        color="error"
                        sx={{ height: 18, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Paper>

          {/* Upcoming List */}
          {thisWeekBirthdays.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Coming Up
              </Typography>
              <Stack spacing={1}>
                {thisWeekBirthdays.slice(0, 3).map(birthday => {
                  const isToday = isSameDay(birthday.date, new Date());
                  return (
                    <Stack 
                      key={birthday.id}
                      direction="row" 
                      alignItems="center" 
                      spacing={2}
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: isToday 
                          ? alpha(theme.palette.error.main, 0.05)
                          : alpha(theme.palette.grey[100], 0.5),
                        ...theme.applyStyles('dark', {
                          bgcolor: isToday 
                            ? alpha(theme.palette.error.main, 0.05)
                            : alpha(theme.palette.grey[900], 0.5)
                        })
                      }}
                    >
                      <Avatar src={birthday.avatar} sx={{ width: 32, height: 32 }}>
                        {birthday.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2">
                          {birthday.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(birthday.date, 'EEEE, MMM d')}
                        </Typography>
                      </Box>
                      {isToday && (
                        <CelebrationIcon color="error" fontSize="small" />
                      )}
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

// Export all variants
export default {
  Mini: BirthdayCalendarMini,
  Full: BirthdayCalendarFull,
  List: BirthdayCalendarList,
  Hybrid: BirthdayCalendarHybrid
};