using CoFlo.Application.Interfaces;
using CoFlo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CoFlo.Infrastructure.Persistence.Repositories;

public class PersonRepository : IPersonRepository
{
    private readonly AppDbContext _db;
    public PersonRepository(AppDbContext db) { _db = db; }

    public async Task<Person> CreateAsync(Person person)
    {
        _db.People.Add(person);
        await _db.SaveChangesAsync();
        return person;
    }

    public async Task<List<Person>> GetAllAsync(string? search = null, string? sortBy = null, bool desc = false, int page = 1, int pageSize = 20)
    {
        IQueryable<Person> query = _db.People.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(p => p.FirstName.Contains(search) || p.LastName.Contains(search));
        }

        query = sortBy?.ToLower() switch
        {
            "firstname" => desc ? query.OrderByDescending(p => p.FirstName) : query.OrderBy(p => p.FirstName),
            "lastname" => desc ? query.OrderByDescending(p => p.LastName) : query.OrderBy(p => p.LastName),
            "age" => desc ? query.OrderByDescending(p => p.DateOfBirth) : query.OrderBy(p => p.DateOfBirth),
            _ => query.OrderBy(p => p.CreatedAt)
        };

        return await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
    }

    public Task<Person?> GetByIdAsync(Guid id) => _db.People.FirstOrDefaultAsync(p => p.Id == id);

    public async Task<Person?> UpdateAsync(Guid id, Person update)
    {
        var existing = await _db.People.FirstOrDefaultAsync(p => p.Id == id);
        if (existing is null) return null;
        existing.FirstName = update.FirstName;
        existing.LastName = update.LastName;
        existing.DateOfBirth = update.DateOfBirth;
        existing.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> SoftDeleteAsync(Guid id)
    {
        var existing = await _db.People.FirstOrDefaultAsync(p => p.Id == id);
        if (existing is null) return false;
        existing.IsDeleted = true;
        existing.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RestoreAsync(Guid id)
    {
        var existing = await _db.People.IgnoreQueryFilters().FirstOrDefaultAsync(p => p.Id == id);
        if (existing is null) return false;
        existing.IsDeleted = false;
        existing.DeletedAt = null;
        await _db.SaveChangesAsync();
        return true;
    }
}

