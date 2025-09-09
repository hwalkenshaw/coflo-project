using CoFlo.Application.DTOs;
using CoFlo.Application.Responses;

namespace CoFlo.Application.Interfaces;

public interface IPersonService
{
    Task<PagedResult<PersonDto>> GetPeopleAsync(int page = 1, int pageSize = 10, string? search = null, string? sortBy = null, string sortOrder = "asc", int? minAge = null, int? maxAge = null);
    Task<PersonDto> CreateAsync(CreatePersonDto dto);
    Task<PersonDto?> UpdateAsync(Guid id, UpdatePersonDto dto);
    Task<bool> SoftDeleteAsync(Guid id);
    Task<PeopleStatsDto> GetStatsAsync();
    Task<PersonDto?> RestoreAsync(Guid id);
}

