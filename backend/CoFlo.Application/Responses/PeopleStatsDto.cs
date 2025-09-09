namespace CoFlo.Application.Responses;

public class PeopleStatsDto
{
    public int TotalCount { get; set; }
    public double PercentageChange { get; set; }
    public double AverageAge { get; set; }
    public double MedianAge { get; set; }
    public int Youngest { get; set; }
    public int Oldest { get; set; }
    public List<BirthdayDto> UpcomingBirthdays { get; set; } = new();
    public List<AgeGroupDto> AgeGroups { get; set; } = new();
    public List<ActivityDto> RecentActivities { get; set; } = new();
}

public class BirthdayDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public int Age { get; set; }
    public int DaysUntilBirthday { get; set; }
}

public class AgeGroupDto
{
    public string Range { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Percentage { get; set; }
}

public class ActivityDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty; // add, edit, delete
    public string PersonName { get; set; } = string.Empty;
    public string PersonAvatar { get; set; } = string.Empty;
    public string PerformedBy { get; set; } = string.Empty;
    public string PerformedByAvatar { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string? Details { get; set; }
    public string? Department { get; set; }
}

