using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace CoFlo.API.Tests.Controllers;

public class PeopleStatsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public PeopleStatsTests(WebApplicationFactory<Program> factory) { _client = factory.CreateClient(); }

    [Fact]
    public async Task Stats_Returns200()
    {
        var res = await _client.GetAsync("/api/v1/people/stats");
        res.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
