using CoFlo.Application.DTOs;
using MediatR;

namespace CoFlo.Application.CQRS.Auth;

public record LoginCommand(LoginDto Login) : IRequest<AuthResponseDto?>;

