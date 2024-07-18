using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RavisController : ControllerBase
{
    private readonly AppDbContext _context;

    public RavisController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetRavis([FromQuery] int page = 1, [FromQuery] string search = "")
    {
        int perPage = 10;
        var query = _context.Ravis.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(r =>
                EF.Functions.ILike(r.narrator_name, $"%{search}%") ||
                EF.Functions.ILike(r.tribe, $"%{search}%") ||
                EF.Functions.ILike(r.nisbe, $"%{search}%") ||
                EF.Functions.ILike(r.degree, $"%{search}%") ||
                EF.Functions.ILike(r.reliability, $"%{search}%")
            );
        }

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / perPage);

        var ravis = await query
            .OrderBy(r => r.ravi_id)
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync();

        Response.Headers.Add("X-Total-Pages", totalPages.ToString());

        return Ok(ravis);
    }

    [HttpGet("hadith-by-tribe")]
    public async Task<IActionResult> GetHadithByTribe()
    {
        // Fetch hadiths with non-empty chains
        var hadiths = await _context.Hadiths
            .Where(h => !string.IsNullOrEmpty(h.chain))
            .Select(h => new { h.id, h.chain })
            .ToListAsync();

        // Fetch all ravis with non-null tribe and convert to dictionary
        var ravis = await _context.Ravis
            .Where(r => r.tribe != null)
            .ToDictionaryAsync(r => r.ravi_id, r => r.tribe);

        // Process the hadiths in-memory
        var result = hadiths
            .Select(h => new
            {
                h.id,
                FirstRaviId = int.Parse(h.chain.Split(';')[0])
            })
            .Where(h => ravis.ContainsKey(h.FirstRaviId))
            .GroupBy(h => ravis[h.FirstRaviId])
            .Select(g => new { Tribe = g.Key!, HadithCount = g.Count() })
            .OrderByDescending(x => x.HadithCount)
            .ToList();

        return Ok(result);
    }

    [HttpGet("hadith-by-ravi-reliability")]
    public async Task<IActionResult> GetHadithByRaviReliability()
    {
        // Fetch hadiths with non-empty chains
        var hadiths = await _context.Hadiths
            .Where(h => !string.IsNullOrEmpty(h.chain))
            .Select(h => new { h.id, h.chain })
            .ToListAsync();

        // Fetch all ravis
        var ravis = await _context.Ravis
            .Where(r => r.reliability != "-1")
            .ToDictionaryAsync(r => r.ravi_id, r => r.reliability);

        // Process the hadiths in-memory
        var result = hadiths
            .Select(h => new
            {
                h.id,
                FirstRaviId = int.Parse(h.chain.Split(';')[0])
            })
            .Where(h => ravis.ContainsKey(h.FirstRaviId))
            .GroupBy(h => ravis[h.FirstRaviId])
            .Select(g => new { Reliability = g.Key!, HadithCount = g.Count() })
            .OrderByDescending(x => x.HadithCount)
            .ToList();

        return Ok(result);
    }


    [HttpGet("hadith-by-ravi-nisbesi")]
    public async Task<IActionResult> GetHadithByRaviNisbesi()
    {
        var result = await _context.Hadiths
            .Where(h => !string.IsNullOrEmpty(h.chain))
            .Join(
                _context.Ravis,
                h => h.chain.Substring(0, h.chain.IndexOf(';')),
                r => r.ravi_id.ToString(),
                (h, r) => new { h.id, r.nisbe }
            )
            .Where(x => x.nisbe != null && x.nisbe != "-1")
            .GroupBy(x => x.nisbe)
            .Select(g => new
            {
                Nisbe = g.Key!,
                HadithCount = g.Count()
            })
            .OrderByDescending(x => x.HadithCount)
            .ThenBy(x => x.Nisbe)
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRavi(int id)
    {
        var ravi = await _context.Ravis
            .Where(r => r.ravi_id == id)
            .Select(r => new
            {
                r.ravi_id,
                r.narrator_name,
                r.birth_year_h,
                r.birth_year_m,
                r.death_year_h,
                r.death_year_m,
                r.placed_lived,
                r.tribe,
                r.nisbe,
                r.job,
                r.degree,
                r.reliability,
                r.biography,

            })
            .FirstOrDefaultAsync();

        if (ravi == null)
        {
            return NotFound();
        }

        return Ok(ravi);
    }

    [HttpGet("bulk")]
    public async Task<IActionResult> GetRavisBulk([FromQuery] string ids)
    {
        if (string.IsNullOrEmpty(ids))
        {
            return BadRequest("IDs are required");
        }

        var raviIds = ids.Split(',').Select(int.Parse).ToList();

        var ravisQuery = _context.Ravis
            .Where(r => raviIds.Contains(r.ravi_id))
            .Select(r => new
            {
                r.ravi_id,
                r.narrator_name,
                r.birth_year_h,
                r.birth_year_m,
                r.death_year_h,
                r.death_year_m,
                r.placed_lived,
                r.tribe,
                r.nisbe,
                r.job,
                r.degree,
                r.reliability,
                r.biography,

            });

        var ravis = await ravisQuery.ToListAsync();

        var orderedRavis = raviIds
            .Select(id => ravis.FirstOrDefault(r => r.ravi_id == id))
            .Where(r => r != null)
            .ToList();

        return Ok(orderedRavis);
    }
    [HttpGet("hadith-by-places")]
    public async Task<IActionResult> GetHadithByPlaces()
    {
        var query = from h in _context.Hadiths
                    where !string.IsNullOrEmpty(h.chain)
                    join r in _context.Ravis on h.chain.Substring(0, h.chain.IndexOf(';')) equals r.ravi_id.ToString()
                    where !string.IsNullOrEmpty(r.placed_lived) && r.placed_lived != "-1"
                    select r.placed_lived;

        var placesData = await query.ToListAsync();

        var result = placesData
            .SelectMany(places => places.Split(','))
            .Select(place => place.Trim())
            .GroupBy(place => place)
            .Select(g => new { Place = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToList();

        return Ok(result);
    }
    [HttpGet("hadiths-timeline")]
    public async Task<IActionResult> GetHadithsTimeline()
    {
        var result = await _context.Hadiths
            .Where(h => !string.IsNullOrEmpty(h.chain))
            .Join(
                _context.Ravis.Where(r => r.death_year_m != 0 && r.death_year_m != -1),
                h => h.chain.Substring(0, h.chain.IndexOf(';')),
                r => r.ravi_id.ToString(),
                (h, r) => r.death_year_m
            )
            .GroupBy(year => year)
            .Select(g => new
            {
                Year = g.Key,
                HadithCount = g.Count()
            })
            .OrderBy(x => x.Year)
            .ToListAsync();

        return Ok(result);
    }

}
