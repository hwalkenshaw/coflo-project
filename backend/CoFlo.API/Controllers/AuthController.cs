using CoFlo.Application.DTOs;
using MediatR;
using CoFlo.Application.CQRS.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CoFlo.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[EnableRateLimiting("auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto login)
    {
        var result = await _mediator.Send(new LoginCommand(login));
        if (result is null)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }
        return Ok(result);
    }
}

