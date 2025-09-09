using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace CoFlo.API.Tests.Controllers;

public class PeopleControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public PeopleControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Get_Returns200()
    {
        var response = await _client.GetAsync("/api/v1/people?page=1&pageSize=5");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
