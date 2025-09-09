using AutoMapper;
using AutoMapper.QueryableExtensions;
using CoFlo.Application.DTOs;
using CoFlo.Application.Interfaces;
using CoFlo.Application.Responses;
using CoFlo.Domain.Entities;
using CoFlo.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CoFlo.Infrastructure.Services;

public class PersonService : IPersonService
{
    private readonly IPersonRepository _repo;
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    public PersonService(IPersonRepository repo, IMapper mapper, AppDbContext db)
    {
        _repo = repo; _mapper = mapper; _db = db;
    }

    public async Task<PagedResult<PersonDto>> GetPeopleAsync(int page = 1, int pageSize = 10, string? search = null, string? sortBy = null, string sortOrder = "asc", int? minAge = null, int? maxAge = null)
    {
        var desc = string.Equals(sortOrder, "desc", StringComparison.OrdinalIgnoreCase);
        var people = await _repo.GetAllAsync(search, sortBy, desc, page, pageSize);

        if (minAge.HasValue || maxAge.HasValue)
        {
            people = people.Where(p => (!minAge.HasValue || p.Age >= minAge) && (!maxAge.HasValue || p.Age <= maxAge)).ToList();
        }

        var result = new PagedResult<PersonDto>
        {
            Items = people.AsQueryable().ProjectTo<PersonDto>(_mapper.ConfigurationProvider).ToList(),
            TotalCount = people.Count,
            Page = page,
            PageSize = pageSize
        };
        return result;
    }

    public async Task<PersonDto> CreateAsync(CreatePersonDto dto)
    {
        var entity = _mapper.Map<Person>(dto);
        entity.CreatedBy = "Test User"; // In production, get from current user context
        entity.CreatedAt = DateTime.UtcNow;
        var created = await _repo.CreateAsync(entity);
        return _mapper.Map<PersonDto>(created);
    }

    public async Task<PersonDto?> UpdateAsync(Guid id, UpdatePersonDto dto)
    {
        var existing = await _db.People.FirstOrDefaultAsync(p => p.Id == id);
        if (existing == null) return null;
        
        existing.FirstName = dto.FirstName;
        existing.LastName = dto.LastName;
        existing.DateOfBirth = dto.DateOfBirth;
        existing.UpdatedAt = DateTime.UtcNow;
        existing.UpdatedBy = "Test User"; // In production, get from current user context
        
        await _db.SaveChangesAsync();
        return _mapper.Map<PersonDto>(existing);
    }

    public async Task<bool> SoftDeleteAsync(Guid id)
    {
        var person = await _db.People.FirstOrDefaultAsync(p => p.Id == id);
        if (person == null) return false;
        
        person.IsDeleted = true;
        person.DeletedAt = DateTime.UtcNow;
        person.DeletedBy = "Test User"; // In production, get from current user context
        
        await _db.SaveChangesAsync();
        return true;
    }

    public Task<PeopleStatsDto> GetStatsAsync()
    {
        var people = _db.People.Where(p => !p.IsDeleted).ToList();
        var ages = people.Select(p => Person.CalculateAge(p.DateOfBirth)).ToList();
        
        // Calculate median age
        double medianAge = 0;
        if (ages.Count > 0)
        {
            var sortedAges = ages.OrderBy(a => a).ToList();
            if (sortedAges.Count % 2 == 0)
                medianAge = (sortedAges[sortedAges.Count / 2 - 1] + sortedAges[sortedAges.Count / 2]) / 2.0;
            else
                medianAge = sortedAges[sortedAges.Count / 2];
        }

        // Calculate percentage change (simulated as 12.5% for now)
        var percentageChange = 12.5;

        // Get upcoming birthdays (next 30 days)
        var today = DateTime.Today;
        var upcomingBirthdays = people
            .Select(p => new
            {
                Person = p,
                NextBirthday = GetNextBirthday(p.DateOfBirth),
                Age = Person.CalculateAge(p.DateOfBirth),
                NextAge = GetNextAge(p.DateOfBirth)
            })
            .Where(x => (x.NextBirthday - today).Days >= 0 && (x.NextBirthday - today).Days <= 30)
            .OrderBy(x => x.NextBirthday)
            .Take(10)
            .Select(x => new BirthdayDto
            {
                Id = x.Person.Id,
                Name = $"{x.Person.FirstName} {x.Person.LastName}",
                DateOfBirth = x.Person.DateOfBirth,
                Age = x.NextAge,
                DaysUntilBirthday = (x.NextBirthday - today).Days
            })
            .ToList();

        // Calculate age groups
        var ageGroups = new List<AgeGroupDto>();
        if (ages.Count > 0)
        {
            var groups = new[] 
            { 
                new { Range = "18-25", Min = 18, Max = 25 },
                new { Range = "26-35", Min = 26, Max = 35 },
                new { Range = "36-45", Min = 36, Max = 45 },
                new { Range = "46-55", Min = 46, Max = 55 },
                new { Range = "56+", Min = 56, Max = int.MaxValue }
            };

            foreach (var group in groups)
            {
                var count = ages.Count(a => a >= group.Min && a <= group.Max);
                ageGroups.Add(new AgeGroupDto
                {
                    Range = group.Range,
                    Count = count,
                    Percentage = Math.Round((double)count / ages.Count * 100, 1)
                });
            }
        }

        // Get recent activities (simulated for now)
        var recentActivities = GetRecentActivities();

        var stats = new PeopleStatsDto
        {
            TotalCount = ages.Count,
            PercentageChange = percentageChange,
            AverageAge = ages.Count == 0 ? 0 : Math.Round(ages.Average(), 1),
            MedianAge = Math.Round(medianAge, 1),
            Youngest = ages.Count == 0 ? 0 : ages.Min(),
            Oldest = ages.Count == 0 ? 0 : ages.Max(),
            UpcomingBirthdays = upcomingBirthdays,
            AgeGroups = ageGroups,
            RecentActivities = recentActivities
        };
        return Task.FromResult(stats);
    }

    private DateTime GetNextBirthday(DateTime dateOfBirth)
    {
        var today = DateTime.Today;
        var birthday = new DateTime(today.Year, dateOfBirth.Month, dateOfBirth.Day);
        if (birthday < today)
            birthday = birthday.AddYears(1);
        return birthday;
    }

    private int GetNextAge(DateTime dateOfBirth)
    {
        var today = DateTime.Today;
        var nextBirthday = GetNextBirthday(dateOfBirth);
        var age = nextBirthday.Year - dateOfBirth.Year;
        return age;
    }

    private List<ActivityDto> GetRecentActivities()
    {
        // Get recent people with activity
        var recentPeople = _db.People
            .OrderByDescending(p => p.UpdatedAt ?? p.CreatedAt)
            .Take(5)
            .ToList();

        var activities = new List<ActivityDto>();
        
        foreach (var person in recentPeople)
        {
            if (person.IsDeleted && person.DeletedAt.HasValue)
            {
                activities.Add(new ActivityDto
                {
                    Id = Guid.NewGuid(),
                    Type = "delete",
                    PersonName = $"{person.FirstName} {person.LastName}",
                    PersonAvatar = "",
                    PerformedBy = person.DeletedBy ?? "System",
                    PerformedByAvatar = "",
                    Timestamp = person.DeletedAt.Value,
                    Details = "Removed from system",
                    Department = null
                });
            }
            else if (person.UpdatedAt.HasValue && person.UpdatedBy != null)
            {
                activities.Add(new ActivityDto
                {
                    Id = Guid.NewGuid(),
                    Type = "edit",
                    PersonName = $"{person.FirstName} {person.LastName}",
                    PersonAvatar = "",
                    PerformedBy = person.UpdatedBy,
                    PerformedByAvatar = "",
                    Timestamp = person.UpdatedAt.Value,
                    Details = "Profile updated",
                    Department = null
                });
            }
            else
            {
                activities.Add(new ActivityDto
                {
                    Id = Guid.NewGuid(),
                    Type = "add",
                    PersonName = $"{person.FirstName} {person.LastName}",
                    PersonAvatar = "",
                    PerformedBy = person.CreatedBy ?? "System",
                    PerformedByAvatar = "",
                    Timestamp = person.CreatedAt,
                    Details = "Added to system",
                    Department = null
                });
            }
        }

        return activities.OrderByDescending(a => a.Timestamp).Take(5).ToList();
    }

    public async Task<PersonDto?> RestoreAsync(Guid id)
    {
        var ok = await _repo.RestoreAsync(id);
        if (!ok) return null;
        var entity = await _db.People.FirstOrDefaultAsync(p => p.Id == id);
        return entity is null ? null : _mapper.Map<PersonDto>(entity);
    }
}

