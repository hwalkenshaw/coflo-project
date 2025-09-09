using MediatR;

namespace CoFlo.Application.CQRS.People.Commands;

public record SoftDeletePersonCommand(Guid Id) : IRequest<bool>;

