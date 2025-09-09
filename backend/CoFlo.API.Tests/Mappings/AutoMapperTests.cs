using System;
using AutoMapper;
using CoFlo.Application.Mapping;
using CoFlo.Application.DTOs;
using CoFlo.Domain.Entities;
using FluentAssertions;
using Xunit;

namespace CoFlo.API.Tests.Mappings;

public class AutoMapperTests
{
    private readonly IMapper _mapper = new MapperConfiguration(cfg => cfg.AddProfile<AutoMapperProfile>()).CreateMapper();

    [Fact]
    public void Maps_Person_To_PersonDto()
    {
        var person = new Person { FirstName = "A", LastName = "B", DateOfBirth = new DateTime(2000,1,1) };
        var dto = _mapper.Map<PersonDto>(person);
        dto.FirstName.Should().Be("A");
        dto.Age.Should().BeGreaterOrEqualTo(0);
    }
}
