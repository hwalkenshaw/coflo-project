using CoFlo.Domain.Entities;

namespace CoFlo.Infrastructure.Persistence.Seeding;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (!db.People.Any())
        {
            var people = new List<Person>
            {
                new() { FirstName = "John", LastName = "Doe", DateOfBirth = new DateTime(1985, 9, 15), CreatedAt = DateTime.UtcNow.AddDays(-7), CreatedBy = "Admin" },
                new() { FirstName = "Jane", LastName = "Smith", DateOfBirth = new DateTime(1990, 9, 20), CreatedAt = DateTime.UtcNow.AddDays(-5), CreatedBy = "Admin" },
                new() { FirstName = "Alice", LastName = "Brown", DateOfBirth = new DateTime(2000, 9, 25), CreatedAt = DateTime.UtcNow.AddDays(-3), CreatedBy = "Test User" },
                new() { FirstName = "Bob", LastName = "Johnson", DateOfBirth = new DateTime(1995, 9, 10), CreatedAt = DateTime.UtcNow.AddDays(-2), CreatedBy = "Test User", UpdatedAt = DateTime.UtcNow.AddDays(-1), UpdatedBy = "Admin" },
                new() { FirstName = "Carol", LastName = "Williams", DateOfBirth = new DateTime(1988, 9, 12), CreatedAt = DateTime.UtcNow.AddHours(-12), CreatedBy = "System" },
                new() { FirstName = "David", LastName = "Miller", DateOfBirth = new DateTime(1992, 10, 5), CreatedAt = DateTime.UtcNow.AddHours(-6), CreatedBy = "Test User" },
                new() { FirstName = "Emma", LastName = "Davis", DateOfBirth = new DateTime(1998, 11, 30), CreatedAt = DateTime.UtcNow.AddHours(-2), CreatedBy = "Admin" }
            };
            db.People.AddRange(people);
            await db.SaveChangesAsync();
        }
    }
}

