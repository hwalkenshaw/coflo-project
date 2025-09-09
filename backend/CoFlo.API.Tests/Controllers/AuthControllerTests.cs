using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace CoFlo.API.Tests.Controllers;

public class AuthControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public AuthControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Login_ReturnsToken_ForValidCredentials()
    {
        var response = await _client.PostAsJsonAsync("/api/v1/auth/login", new { email = "test@example.com", password = "Password123!" });
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("token");
    }

    [Fact]
    public async Task Login_Unauthorized_ForInvalidCredentials()
    {
        var response = await _client.PostAsJsonAsync("/api/v1/auth/login", new { email = "nope@example.com", password = "Password123!" });
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
