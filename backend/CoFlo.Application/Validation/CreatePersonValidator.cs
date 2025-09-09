using CoFlo.Application.DTOs;
using FluentValidation;

namespace CoFlo.Application.Validation;

public class CreatePersonValidator : AbstractValidator<CreatePersonDto>
{
    public CreatePersonValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .Length(1, 50).WithMessage("First name must be between 1 and 50 characters")
            .Matches(@"^[A-Za-z' -]+$").WithMessage("First name can only contain letters, spaces, hyphens and apostrophes");
        
        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .Length(1, 50).WithMessage("Last name must be between 1 and 50 characters")
            .Matches(@"^[A-Za-z' -]+$").WithMessage("Last name can only contain letters, spaces, hyphens and apostrophes");
        
        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Date of birth is required")
            .Must(BeAValidDate).WithMessage("Please enter a valid date")
            .Must(BeInThePast).WithMessage("Date of birth must be in the past")
            .Must(BeReasonableAge).WithMessage("Age must be between 0 and 150 years");
    }

    private static bool BeAValidDate(DateTime dateOfBirth)
    {
        return dateOfBirth != default(DateTime) && dateOfBirth > DateTime.MinValue && dateOfBirth < DateTime.MaxValue;
    }

    private static bool BeInThePast(DateTime dateOfBirth)
    {
        return dateOfBirth < DateTime.Today;
    }

    private static bool BeReasonableAge(DateTime dateOfBirth)
    {
        var age = PersonAge(dateOfBirth);
        return age >= 0 && age <= 150;
    }

    private static int PersonAge(DateTime dob)
    {
        var today = DateTime.Today;
        var age = today.Year - dob.Year;
        if (dob.Date > today.AddYears(-age)) age--;
        return age;
    }
}

