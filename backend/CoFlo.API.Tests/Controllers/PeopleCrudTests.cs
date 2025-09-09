using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace CoFlo.API.Tests.Controllers;

public class PeopleCrudTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public PeopleCrudTests(WebApplicationFactory<Program> factory)
    { _client = factory.CreateClient(); }

    [Fact]
    public async Task Create_Update_Delete_Flow_Works()
    {
        // Create
        var createRes = await _client.PostAsJsonAsync("/api/v1/people", new { firstName = "Unit", lastName = "Test", dateOfBirth = new DateTime(1995,1,1) });
        createRes.StatusCode.Should().Be(HttpStatusCode.Created);
        var created = await createRes.Content.ReadFromJsonAsync<PersonCreatedResponse>();
        string id = created!.Id.ToString();

        // Update
        var updateRes = await _client.PutAsJsonAsync($"/api/v1/people/{id}", new { firstName = "Unit", lastName = "Tester", dateOfBirth = new DateTime(1995,1,1) });
        updateRes.StatusCode.Should().Be(HttpStatusCode.OK);

        // Delete
        var deleteRes = await _client.DeleteAsync($"/api/v1/people/{id}");
        deleteRes.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}

file sealed class PersonCreatedResponse
{
    public Guid Id { get; set; }
}
