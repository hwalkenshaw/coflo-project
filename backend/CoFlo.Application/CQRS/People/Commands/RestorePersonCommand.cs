using CoFlo.Application.DTOs;
using MediatR;

namespace CoFlo.Application.CQRS.People.Commands;

public record RestorePersonCommand(Guid Id) : IRequest<PersonDto?>;

