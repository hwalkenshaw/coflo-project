import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Stack,
  Chip,
  IconButton,
  Button,
  useTheme,
  alpha,
  Divider,
  Badge,
  ListItemButton
} from '@mui/material';
import {
  Cake as CakeIcon,
  CardGiftcard as GiftIcon,
  CalendarMonth as CalendarIcon,
  ChevronRight as ChevronRightIcon,
  Celebration as CelebrationIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

interface Birthday {
  id: number;
  name: string;
  date: Date;
  age?: number;
  avatar?: string;
  department?: string;
}

interface UpcomingBirthdaysWidgetProps {
  birthdays: Birthday[];
  variant?: 'default' | 'compact' | 'detailed' | 'celebratory';
}

// Helper function to format birthday dates
const formatBirthdayDate = (date: Date): { display: string; daysLeft: number; isToday: boolean } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birthdayDate = new Date(date);
  birthdayDate.setHours(0, 0, 0, 0);
  
  const diffTime = birthdayDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let display = '';
  if (daysLeft === 0) {
    display = 'Today!';
  } else if (daysLeft === 1) {
    display = 'Tomorrow';
  } else if (daysLeft <= 7) {
    display = `In ${daysLeft} days`;
  } else {
    display = birthdayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  return { display, daysLeft, isToday: daysLeft === 0 };
};

// Variant 1: Default list style
export const UpcomingBirthdaysDefault: React.FC<UpcomingBirthdaysWidgetProps> = ({
  birthdays
}) => {
  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
            <CakeIcon fontSize="small" />
          </Avatar>
        }
        title="Upcoming Birthdays"
        subheader={`${birthdays.length} birthdays in the next 30 days`}
        action={
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        <List sx={{ p: 0 }}>
          {birthdays.slice(0, 5).map((birthday, index) => {
            const { display, daysLeft, isToday } = formatBirthdayDate(birthday.date);
            return (
              <React.Fragment key={birthday.id}>
                <ListItem
                  secondaryAction={
                    <Chip
                      label={display}
                      size="small"
                      color={isToday ? 'error' : daysLeft <= 3 ? 'warning' : 'default'}
                      variant={isToday ? 'filled' : 'outlined'}
                    />
                  }
                  sx={{
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        isToday ? (
                          <CelebrationIcon 
                            sx={{ 
                              fontSize: 16, 
                              color: theme.palette.error.main 
                            }} 
                          />
                        ) : null
                      }
                    >
                      <Avatar src={birthday.avatar}>
                        {birthday.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={birthday.name}
                    secondary={birthday.age ? `Turning ${birthday.age}` : birthday.department}
                  />
                </ListItem>
                {index < birthdays.slice(0, 5).length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            );
          })}
        </List>
        {birthdays.length > 5 && (
          <Box sx={{ p: 2, pt: 1 }}>
            <Button 
              fullWidth 
              variant="text" 
              endIcon={<ChevronRightIcon />}
              sx={{ justifyContent: 'space-between' }}
            >
              View all {birthdays.length} birthdays
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Variant 2: Compact style
export const UpcomingBirthdaysCompact: React.FC<UpcomingBirthdaysWidgetProps> = ({
  birthdays
}) => {
  const theme = useTheme();
  const todayBirthdays = birthdays.filter(b => {
    const { isToday } = formatBirthdayDate(b.date);
    return isToday;
  });

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <CakeIcon color="primary" />
              <Typography variant="h6">Birthdays</Typography>
            </Stack>
            <Chip 
              label={`${birthdays.length} upcoming`} 
              size="small" 
              variant="outlined"
            />
          </Stack>

          {todayBirthdays.length > 0 && (
            <Box 
              sx={{ 
                p: 1.5, 
                bgcolor: alpha(theme.palette.error.main, 0.1),
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <CelebrationIcon sx={{ color: theme.palette.error.main }} />
                <Typography variant="subtitle2" color="error">
                  {todayBirthdays.length} birthday{todayBirthdays.length > 1 ? 's' : ''} today!
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {todayBirthdays.map(b => b.name).join(', ')}
              </Typography>
            </Box>
          )}

          <Stack spacing={1}>
            {birthdays.slice(0, 4).map((birthday) => {
              const { display, isToday } = formatBirthdayDate(birthday.date);
              return (
                <Stack 
                  key={birthday.id}
                  direction="row" 
                  alignItems="center" 
                  spacing={2}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: isToday ? alpha(theme.palette.error.main, 0.05) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32 }} src={birthday.avatar}>
                    {birthday.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {birthday.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {display}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <GiftIcon fontSize="small" />
                  </IconButton>
                </Stack>
              );
            })}
          </Stack>

          {birthdays.length > 4 && (
            <Typography 
              variant="caption" 
              color="primary" 
              sx={{ cursor: 'pointer', textAlign: 'center' }}
            >
              +{birthdays.length - 4} more birthdays
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

// Variant 3: Detailed with actions
export const UpcomingBirthdaysDetailed: React.FC<UpcomingBirthdaysWidgetProps> = ({
  birthdays
}) => {
  const theme = useTheme();

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">Birthday Calendar</Typography>
            <Chip 
              icon={<CakeIcon />} 
              label={birthdays.length} 
              size="small" 
              color="primary"
            />
          </Stack>
        }
        action={
          <Button 
            startIcon={<CalendarIcon />} 
            size="small"
            variant="outlined"
          >
            View Calendar
          </Button>
        }
      />
      <CardContent sx={{ p: 0 }}>
        <List>
          {birthdays.slice(0, 4).map((birthday) => {
            const { display, daysLeft, isToday } = formatBirthdayDate(birthday.date);
            const birthdayMonth = birthday.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
            
            return (
              <ListItemButton
                key={birthday.id}
                sx={{
                  py: 2,
                  borderLeft: isToday ? `4px solid ${theme.palette.error.main}` : 'none',
                  bgcolor: isToday ? alpha(theme.palette.error.main, 0.02) : 'transparent'
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={birthday.avatar}
                    sx={{ 
                      width: 48, 
                      height: 48,
                      border: isToday ? `2px solid ${theme.palette.error.main}` : 'none'
                    }}
                  >
                    {birthday.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {birthday.name}
                      </Typography>
                      {isToday && (
                        <Chip 
                          label="TODAY!" 
                          size="small" 
                          color="error"
                          sx={{ height: 20 }}
                        />
                      )}
                    </Stack>
                  }
                  secondary={
                    <Stack spacing={0.5} mt={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        {birthdayMonth} • {birthday.age ? `Turning ${birthday.age}` : ''} • {birthday.department}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button 
                          size="small" 
                          variant={isToday ? "contained" : "outlined"}
                          startIcon={<SendIcon />}
                          sx={{ textTransform: 'none' }}
                        >
                          Send Wishes
                        </Button>
                        <Button 
                          size="small" 
                          variant="text"
                          startIcon={<GiftIcon />}
                          sx={{ textTransform: 'none' }}
                        >
                          Gift Ideas
                        </Button>
                      </Stack>
                    </Stack>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

// Variant 4: Celebratory/Fun style
export const UpcomingBirthdaysCelebratory: React.FC<UpcomingBirthdaysWidgetProps> = ({
  birthdays
}) => {
  const theme = useTheme();
  const nextBirthday = birthdays[0];
  const { display, isToday } = formatBirthdayDate(nextBirthday?.date || new Date());

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
      }}
    >
      <CardContent>
        <Stack spacing={3}>
          {/* Header with celebration theme */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }}
              >
                <CelebrationIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                Birthday Celebrations
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              This month
            </Typography>
          </Stack>

          {/* Next birthday highlight */}
          {nextBirthday && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: theme.shadows[1],
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: isToday 
                    ? theme.palette.error.main 
                    : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar 
                  src={nextBirthday.avatar}
                  sx={{ 
                    width: 56, 
                    height: 56,
                    border: `3px solid ${isToday ? theme.palette.error.main : theme.palette.primary.main}`
                  }}
                >
                  {nextBirthday.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {nextBirthday.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isToday ? '🎉 Celebrating today!' : `🎂 ${display}`}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={isToday ? <CelebrationIcon /> : <SendIcon />}
                  sx={{
                    background: isToday 
                      ? theme.palette.error.main 
                      : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                >
                  {isToday ? 'Celebrate!' : 'Remind Me'}
                </Button>
              </Stack>
            </Box>
          )}

          {/* Birthday count badges */}
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight={600}>
                {birthdays.filter(b => formatBirthdayDate(b.date).daysLeft <= 7).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This Week
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" fontWeight={600}>
                {birthdays.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This Month
              </Typography>
            </Box>
          </Stack>

          {/* Mini birthday list */}
          <Stack spacing={1}>
            {birthdays.slice(1, 4).map((birthday) => {
              const { display } = formatBirthdayDate(birthday.date);
              return (
                <Stack 
                  key={birthday.id}
                  direction="row" 
                  alignItems="center" 
                  spacing={1.5}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  <Avatar sx={{ width: 28, height: 28 }} src={birthday.avatar}>
                    {birthday.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {birthday.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {display}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Export all variants
export default {
  Default: UpcomingBirthdaysDefault,
  Compact: UpcomingBirthdaysCompact,
  Detailed: UpcomingBirthdaysDetailed,
  Celebratory: UpcomingBirthdaysCelebratory
};