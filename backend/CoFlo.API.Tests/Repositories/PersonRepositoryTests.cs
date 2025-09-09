using System;
using System.Threading.Tasks;
using CoFlo.Infrastructure.Persistence;
using CoFlo.Infrastructure.Persistence.Repositories;
using CoFlo.Domain.Entities;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CoFlo.API.Tests.Repositories;

public class PersonRepositoryTests
{
    private static AppDbContext NewDb()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(opts);
    }

    [Fact]
    public async Task Create_And_Get_Works()
    {
        await using var db = NewDb();
        var repo = new PersonRepository(db);
        var p = await repo.CreateAsync(new Person { FirstName = "Jane", LastName = "Doe", DateOfBirth = new DateTime(1990,1,1) });
        var fetched = await repo.GetByIdAsync(p.Id);
        fetched.Should().NotBeNull();
        fetched!.FirstName.Should().Be("Jane");
    }
}
