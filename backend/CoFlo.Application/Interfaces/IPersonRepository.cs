using CoFlo.Domain.Entities;

namespace CoFlo.Application.Interfaces;

public interface IPersonRepository
{
    Task<List<Person>> GetAllAsync(string? search = null, string? sortBy = null, bool desc = false, int page = 1, int pageSize = 20);
    Task<Person?> GetByIdAsync(Guid id);
    Task<Person> CreateAsync(Person person);
    Task<Person?> UpdateAsync(Guid id, Person update);
    Task<bool> SoftDeleteAsync(Guid id);
    Task<bool> RestoreAsync(Guid id);
}

