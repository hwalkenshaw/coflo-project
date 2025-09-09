using CoFlo.Application.DTOs;
using MediatR;

namespace CoFlo.Application.CQRS.People.Commands;

public record UpdatePersonCommand(Guid Id, UpdatePersonDto Dto) : IRequest<PersonDto?>;

