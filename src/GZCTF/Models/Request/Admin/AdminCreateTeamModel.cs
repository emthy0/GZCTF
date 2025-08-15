using System.ComponentModel.DataAnnotations;

namespace GZCTF.Models.Request.Admin;

/// <summary>
/// Team creation (Admin)
/// </summary>
public class AdminCreateTeamModel
{
    /// <summary>
    /// Team name
    /// </summary>
    [Required]
    [MaxLength(Limits.MaxTeamNameLength, ErrorMessageResourceName = nameof(Resources.Program.Model_TeamNameTooLong),
        ErrorMessageResourceType = typeof(Resources.Program))]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Team bio
    /// </summary>
    [MaxLength(Limits.MaxTeamBioLength, ErrorMessageResourceName = nameof(Resources.Program.Model_TeamBioTooLong),
        ErrorMessageResourceType = typeof(Resources.Program))]
    public string? Bio { get; set; }

    /// <summary>
    /// Team country
    /// </summary>
    [MaxLength(72)]
    public string? Country { get; set; }

    /// <summary>
    /// Captain user ID
    /// </summary>
    [Required]
    public Guid CaptainId { get; set; }
}