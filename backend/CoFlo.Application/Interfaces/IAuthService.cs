using CoFlo.Application.DTOs;

namespace CoFlo.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(string email, string password);
}

