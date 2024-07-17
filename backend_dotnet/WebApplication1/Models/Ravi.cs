using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models;

public class Ravi
{
    [Key]
    [Column("ravi_id")]
    public int ravi_id { get; set; }

    [Column("narrator_name")]
    public string? narrator_name { get; set; }

    [Column("birth_year_h")]
    public int? birth_year_h { get; set; }

    [Column("birth_year_m")]
    public int? birth_year_m { get; set; }

    [Column("death_year_h")]
    public int? death_year_h { get; set; }

    [Column("death_year_m")]
    public int? death_year_m { get; set; }

    [Column("placed_lived")]
    public string? placed_lived { get; set; }

    [Column("tribe")]
    public string? tribe { get; set; }

    [Column("nisbe")]
    public string? nisbe { get; set; }

    [Column("job")]
    public string? job { get; set; }

    [Column("degree")]
    public string? degree { get; set; }

    [Column("reliability")]
    public string? reliability { get; set; }

    [Column("biography")]
    public string? biography { get; set; }

}