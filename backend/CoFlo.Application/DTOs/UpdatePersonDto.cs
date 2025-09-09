using System.ComponentModel.DataAnnotations;

namespace CoFlo.Application.DTOs;

public class UpdatePersonDto
{
    [Required, StringLength(50)]
    public string FirstName { get; set; } = string.Empty;
    [Required, StringLength(50)]
    public string LastName { get; set; } = string.Empty;
    [Required]
    public DateTime DateOfBirth { get; set; }
}

