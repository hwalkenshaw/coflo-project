using CoFlo.Application.DTOs;
using CoFlo.Application.Interfaces;
using MediatR;

namespace CoFlo.Application.CQRS.People.Commands;

public class UpdatePersonCommandHandler : IRequestHandler<UpdatePersonCommand, PersonDto?>
{
    private readonly IPersonService _service;
    public UpdatePersonCommandHandler(IPersonService service) { _service = service; }

    public Task<PersonDto?> Handle(UpdatePersonCommand request, CancellationToken cancellationToken)
        => _service.UpdateAsync(request.Id, request.Dto);
}

