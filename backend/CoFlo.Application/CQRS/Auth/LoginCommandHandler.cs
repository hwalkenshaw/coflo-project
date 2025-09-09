using CoFlo.Application.DTOs;
using CoFlo.Application.Interfaces;
using MediatR;

namespace CoFlo.Application.CQRS.Auth;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto?>
{
    private readonly IAuthService _auth;
    public LoginCommandHandler(IAuthService auth) { _auth = auth; }

    public Task<AuthResponseDto?> Handle(LoginCommand request, CancellationToken cancellationToken)
        => _auth.LoginAsync(request.Login.Email, request.Login.Password);
}

