using CoFlo.Application.DTOs;
using CoFlo.Application.Interfaces;
using MediatR;

namespace CoFlo.Application.CQRS.People.Commands;

public class CreatePersonCommandHandler : IRequestHandler<CreatePersonCommand, PersonDto>
{
    private readonly IPersonService _service;
    public CreatePersonCommandHandler(IPersonService service) { _service = service; }

    public Task<PersonDto> Handle(CreatePersonCommand request, CancellationToken cancellationToken)
        => _service.CreateAsync(request.Dto);
}

