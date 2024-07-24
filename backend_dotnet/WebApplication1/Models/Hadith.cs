using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Hadith
{
    [Key]
    [Column("id")]
    public Guid id { get; set; }
    public string arabic { get; set; } = string.Empty;
    public string? turkish { get; set; } = string.Empty;
    public string? musannif { get; set; } = string.Empty;
    public string? book { get; set; } = string.Empty;
    public string? topic { get; set; } = string.Empty;
    public string? chain { get; set; } = string.Empty;
    public string page_index { get; set; } = string.Empty;
    public int? chain_length { get; set; } 
}