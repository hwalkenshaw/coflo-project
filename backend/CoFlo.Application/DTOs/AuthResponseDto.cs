namespace CoFlo.Application.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
    public object User { get; set; } = new { };
}

