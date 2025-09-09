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
  Paper
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Update as UpdateIcon,
  History as HistoryIcon,
  ArrowForward as ArrowForwardIcon,
  MoreVert as MoreVertIcon,
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon
} from '@mui/icons-material';

type ActivityType = 'add' | 'edit' | 'delete' | 'update';

interface Activity {
  id: number;
  type: ActivityType;
  personName: string;
  personAvatar?: string;
  performedBy: string;
  performedByAvatar?: string;
  timestamp: Date;
  details?: string;
  department?: string;
}

interface RecentActivityWidgetProps {
  activities: Activity[];
  variant?: 'default' | 'timeline' | 'compact' | 'detailed';
}

// Helper function to format time
const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

// Get activity icon and color
const getActivityDetails = (type: ActivityType, theme: any) => {
  switch (type) {
    case 'add':
      return { 
        icon: <PersonAddIcon fontSize="small" />, 
        color: theme.palette.success.main,
        action: 'added',
        bgColor: alpha(theme.palette.success.main, 0.1)
      };
    case 'edit':
      return { 
        icon: <EditIcon fontSize="small" />, 
        color: theme.palette.info.main,
        action: 'updated',
        bgColor: alpha(theme.palette.info.main, 0.1)
      };
    case 'delete':
      return { 
        icon: <DeleteIcon fontSize="small" />, 
        color: theme.palette.error.main,
        action: 'removed',
        bgColor: alpha(theme.palette.error.main, 0.1)
      };
    case 'update':
      return { 
        icon: <UpdateIcon fontSize="small" />, 
        color: theme.palette.warning.main,
        action: 'modified',
        bgColor: alpha(theme.palette.warning.main, 0.1)
      };
    default:
      return { 
        icon: <HistoryIcon fontSize="small" />, 
        color: theme.palette.grey[500],
        action: 'changed',
        bgColor: alpha(theme.palette.grey[500], 0.1)
      };
  }
};

// Variant 1: Default list style
export const RecentActivityDefault: React.FC<RecentActivityWidgetProps> = ({
  activities
}) => {
  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
            <HistoryIcon fontSize="small" />
          </Avatar>
        }
        title="Recent Activity"
        subheader={`${activities.length} actions today`}
        action={
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        <List sx={{ p: 0 }}>
          {activities.slice(0, 5).map((activity, index) => {
            const { icon, color, action } = getActivityDetails(activity.type, theme);
            return (
              <React.Fragment key={activity.id}>
                <ListItem
                  sx={{
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: alpha(color, 0.1), color }}>
                      {icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        <strong>{activity.performedBy}</strong> {action}{' '}
                        <strong>{activity.personName}</strong>
                        {activity.department && ` to ${activity.department}`}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(activity.timestamp)}
                        </Typography>
                        {activity.details && (
                          <>
                            <CircleIcon sx={{ fontSize: 4 }} />
                            <Typography variant="caption" color="text.secondary">
                              {activity.details}
                            </Typography>
                          </>
                        )}
                      </Stack>
                    }
                  />
                </ListItem>
                {index < activities.slice(0, 5).length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            );
          })}
        </List>
        {activities.length > 5 && (
          <Box sx={{ p: 2, pt: 1 }}>
            <Button 
              fullWidth 
              variant="text" 
              endIcon={<ArrowForwardIcon />}
            >
              View all activity
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Variant 2: Timeline style (temporarily disabled due to MUI compatibility)
export const RecentActivityTimeline: React.FC<RecentActivityWidgetProps> = ({
  activities
}) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Activity Timeline"
        subheader={`${activities.length} events`}
      />
      <CardContent>
        <Timeline position="alternate">
          {activities.slice(0, 7).map((activity, idx) => {
            const { icon, color, action } = getActivityDetails(activity.type, theme);
            return (
              <TimelineItem key={activity.id}>
                <TimelineOppositeContent color="text.secondary" sx={{ typography: 'caption' }}>
                  {formatTime(activity.timestamp)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  {idx !== 0 && <TimelineConnector />}
                  <TimelineDot sx={{ bgcolor: alpha(color, 0.15), color }}>
                    {icon}
                  </TimelineDot>
                  {idx !== activities.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      <strong>{activity.performedBy}</strong> {action} <strong>{activity.personName}</strong>
                      {activity.department && ` · ${activity.department}`}
                    </Typography>
                    {activity.details && (
                      <Typography variant="caption" color="text.secondary">
                        {activity.details}
                      </Typography>
                    )}
                  </Stack>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </CardContent>
    </Card>
  );
};

// Variant 3: Compact style
export const RecentActivityCompact: React.FC<RecentActivityWidgetProps> = ({
  activities
}) => {
  const theme = useTheme();
  
  // Group activities by type
  const addCount = activities.filter(a => a.type === 'add').length;
  const editCount = activities.filter(a => a.type === 'edit').length;
  const deleteCount = activities.filter(a => a.type === 'delete').length;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <HistoryIcon color="action" />
              <Typography variant="h6">Activity</Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Last 24 hours
            </Typography>
          </Stack>

          {/* Activity summary */}
          <Stack direction="row" spacing={1}>
            <Chip 
              label={`${addCount} added`} 
              size="small" 
              color="success"
              variant="outlined"
            />
            <Chip 
              label={`${editCount} edited`} 
              size="small" 
              color="info"
              variant="outlined"
            />
            {deleteCount > 0 && (
              <Chip 
                label={`${deleteCount} removed`} 
                size="small" 
                color="error"
                variant="outlined"
              />
            )}
          </Stack>

          {/* Recent items */}
          <Stack spacing={1}>
            {activities.slice(0, 4).map((activity) => {
              const { icon, color, action } = getActivityDetails(activity.type, theme);
              return (
                <Stack 
                  key={activity.id}
                  direction="row" 
                  alignItems="center" 
                  spacing={1.5}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.grey[100], 0.5),
                    ...theme.applyStyles('dark', {
                      bgcolor: alpha(theme.palette.grey[900], 0.5)
                    })
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: color
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap>
                      {activity.performedBy} {action} {activity.personName}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                    {formatTime(activity.timestamp)}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>

          <Button 
            size="small" 
            fullWidth 
            variant="outlined"
            startIcon={<HistoryIcon />}
          >
            Full History
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Variant 4: Detailed with avatars and actions
export const RecentActivityDetailed: React.FC<RecentActivityWidgetProps> = ({
  activities
}) => {
  const theme = useTheme();

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">Recent Activity</Typography>
            <Badge color="error" variant="dot">
              <CheckCircleIcon color="success" fontSize="small" />
            </Badge>
          </Stack>
        }
        subheader="Real-time updates"
        action={
          <Button 
            size="small" 
            variant="outlined"
            startIcon={<GroupIcon />}
          >
            Filter
          </Button>
        }
      />
      <CardContent sx={{ p: 0 }}>
        <List>
          {activities.slice(0, 5).map((activity, index) => {
            const { icon, color, action, bgColor } = getActivityDetails(activity.type, theme);
            
            return (
              <React.Fragment key={activity.id}>
                <ListItem
                  sx={{
                    py: 2,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.02)
                    }
                  }}
                >
                  <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                    {/* Activity icon */}
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: bgColor,
                        color,
                        flexShrink: 0
                      }}
                    >
                      {icon}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1 }}>
                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar 
                            src={activity.performedByAvatar}
                            sx={{ width: 20, height: 20 }}
                          >
                            {activity.performedBy.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">
                            <strong>{activity.performedBy}</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {action}
                          </Typography>
                          <Avatar 
                            src={activity.personAvatar}
                            sx={{ width: 20, height: 20 }}
                          >
                            {activity.personName.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">
                            <strong>{activity.personName}</strong>
                          </Typography>
                        </Stack>
                        
                        {activity.details && (
                          <Typography variant="caption" color="text.secondary">
                            {activity.details}
                          </Typography>
                        )}
                        
                        <Stack direction="row" spacing={2}>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(activity.timestamp)}
                          </Typography>
                          {activity.department && (
                            <Chip 
                              label={activity.department} 
                              size="small" 
                              variant="outlined"
                              sx={{ height: 20 }}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Actions */}
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <IconButton size="small">
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </ListItem>
                {index < activities.slice(0, 5).length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

// Export all variants
export default {
  Default: RecentActivityDefault,
  Timeline: RecentActivityTimeline,
  Compact: RecentActivityCompact,
  Detailed: RecentActivityDetailed
};
