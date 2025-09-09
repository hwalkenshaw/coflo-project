using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CoFlo.Application.DTOs;
using CoFlo.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CoFlo.Infrastructure.Auth;

public class AuthService : IAuthService
{
    private readonly IConfiguration _config;

    private static readonly (string Email, string Password, string First, string Last, string Id) DemoUser =
        ("test@example.com", "Password123!", "Test", "User", Guid.NewGuid().ToString());

    public AuthService(IConfiguration config)
    {
        _config = config;
    }

    public Task<AuthResponseDto?> LoginAsync(string email, string password)
    {
        if (!string.Equals(email, DemoUser.Email, StringComparison.OrdinalIgnoreCase) || password != DemoUser.Password)
        {
            return Task.FromResult<AuthResponseDto?>(null);
        }

        var jwtSection = _config.GetSection("Jwt");
        var key = jwtSection.GetValue<string>("Key") ?? "dev-secret-change-me";
        var issuer = jwtSection.GetValue<string>("Issuer") ?? "CoFlo";
        var audience = jwtSection.GetValue<string>("Audience") ?? "CoFloUsers";

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var expires = DateTime.UtcNow.AddHours(24);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, DemoUser.Id),
            new(JwtRegisteredClaimNames.Email, DemoUser.Email),
            new(ClaimTypes.Name, $"{DemoUser.First} {DemoUser.Last}")
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expires,
            signingCredentials: credentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        var response = new AuthResponseDto
        {
            Token = tokenString,
            ExpiresIn = (int)TimeSpan.FromHours(24).TotalSeconds,
            User = new { id = DemoUser.Id, email = DemoUser.Email, firstName = DemoUser.First, lastName = DemoUser.Last }
        };

        return Task.FromResult<AuthResponseDto?>(response);
    }
}

