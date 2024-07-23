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
                (r.tribe != null && r.tribe != "-1" && r.tribe != "0" && EF.Functions.ILike(r.tribe, $"%{search}%")) ||
                (r.nisbe != null && r.nisbe != "-1" && r.nisbe != "0" && EF.Functions.ILike(r.nisbe, $"%{search}%")) ||
                (r.degree != null && r.degree != "-1" && r.degree != "0" && EF.Functions.ILike(r.degree, $"%{search}%")) ||
                (r.reliability != null && r.reliability != "-1" && r.reliability != "0" && EF.Functions.ILike(r.reliability, $"%{search}%"))
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
        var hadiths = await _context.Hadiths
            .Where(h => !string.IsNullOrEmpty(h.chain))
            .Select(h => new { h.id, h.chain })
            .ToListAsync();

        var ravis = await _context.Ravis
            .Where(r => r.tribe != null && r.tribe != "-1" && r.tribe != "0")
            .ToDictionaryAsync(r => r.ravi_id, r => r.tribe);

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

    [HttpGet("tribes")]
    public async Task<IActionResult> GetTribes()
    {
        var tribes = await _context.Ravis
            .Where(r => !string.IsNullOrEmpty(r.tribe) && r.tribe != "-1" && r.tribe != "0")
            .Select(r => r.tribe)
            .Distinct()
            .OrderBy(t => t)
            .ToListAsync();

        return Ok(tribes);
    }

    [HttpGet("by-tribe")]
    public async Task<IActionResult> GetRavisByTribe([FromQuery] string tribe)
    {
        var ravis = await _context.Ravis
            .Where(r => r.tribe == tribe && r.tribe != "-1" && r.tribe != "0")
            .Select(r => new { r.ravi_id, r.narrator_name, r.tribe })
            .ToListAsync();

        return Ok(ravis);
    }

    [HttpGet("hadith-by-ravi-reliability")]
    public async Task<IActionResult> GetHadithByRaviReliability()
    {
        var hadiths = await _context.Hadiths
            .Where(h => !string.IsNullOrEmpty(h.chain))
            .Select(h => new { h.id, h.chain })
            .ToListAsync();

        var ravis = await _context.Ravis
            .Where(r => r.reliability != null && r.reliability != "-1" && r.reliability != "0")
            .ToDictionaryAsync(r => r.ravi_id, r => r.reliability);

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
        var hadiths = await _context.Hadiths
            .Select(h => new
            {
                h.id,
                h.chain,
                h.arabic,
                h.turkish,
                h.book,
                h.topic,
                h.page_index
            })
            .ToListAsync();

        var ravis = await _context.Ravis
            .Select(r => new { r.ravi_id, r.nisbe })
            .ToListAsync();

        var result = hadiths
            .Where(h => !string.IsNullOrEmpty(h.chain))
            .Select(h => new
            {
                h.id,
                h.arabic,
                h.turkish,
                h.book,
                h.topic,
                h.page_index,
                FirstRaviId = int.Parse(h.chain.Split(';')[0])
            })
            .Join(ravis,
                h => h.FirstRaviId,
                r => r.ravi_id,
                (h, r) => new { h.id, r.nisbe })
            .Where(x => x.nisbe != null)
            .GroupBy(x => x.nisbe)
            .Select(g => new
            {
                Nisbe = g.Key!,
                HadithCount = g.Count()
            })
            .OrderByDescending(x => x.HadithCount)
            .ThenBy(x => x.Nisbe)
            .ToList();

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
                birth_year_h = r.birth_year_h == 0 || r.birth_year_h == -1 ? null : r.birth_year_h,
                birth_year_m = r.birth_year_m == 0 || r.birth_year_m == -1 ? null : r.birth_year_m,
                death_year_h = r.death_year_h == 0 || r.death_year_h == -1 ? null : r.death_year_h,
                death_year_m = r.death_year_m == 0 || r.death_year_m == -1 ? null : r.death_year_m,
                placed_lived = r.placed_lived == "-1" || r.placed_lived == "0" ? null : r.placed_lived,
                tribe = r.tribe == "-1" || r.tribe == "0" ? null : r.tribe,
                nisbe = r.nisbe == "-1" || r.nisbe == "0" ? null : r.nisbe,
                job = r.job == "-1" || r.job == "0" ? null : r.job,
                degree = r.degree == "-1" || r.degree == "0" ? null : r.degree,
                reliability = r.reliability == "-1" || r.reliability == "0" ? null : r.reliability,
                biography = r.biography == "-1" || r.biography == "0" ? null : r.biography,
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
                birth_year_h = r.birth_year_h == 0 || r.birth_year_h == -1 ? null : r.birth_year_h,
                birth_year_m = r.birth_year_m == 0 || r.birth_year_m == -1 ? null : r.birth_year_m,
                death_year_h = r.death_year_h == 0 || r.death_year_h == -1 ? null : r.death_year_h,
                death_year_m = r.death_year_m == 0 || r.death_year_m == -1 ? null : r.death_year_m,
                placed_lived = r.placed_lived == "-1" || r.placed_lived == "0" ? null : r.placed_lived,
                tribe = r.tribe == "-1" || r.tribe == "0" ? null : r.tribe,
                nisbe = r.nisbe == "-1" || r.nisbe == "0" ? null : r.nisbe,
                job = r.job == "-1" || r.job == "0" ? null : r.job,
                degree = r.degree == "-1" || r.degree == "0" ? null : r.degree,
                reliability = r.reliability == "-1" || r.reliability == "0" ? null : r.reliability,
                biography = r.biography == "-1" || r.biography == "0" ? null : r.biography,
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
        var hadiths = await _context.Hadiths
            .Select(h => new { h.id, h.chain })
            .ToListAsync();

        var ravis = await _context.Ravis
            .Select(r => new { r.ravi_id, r.placed_lived })
            .ToListAsync();

        var result = hadiths
            .Where(h => !string.IsNullOrEmpty(h.chain))
            .Select(h => new
            {
                h.id,
                FirstRaviId = int.Parse(h.chain.Split(';')[0])
            })
            .Join(ravis,
                h => h.FirstRaviId,
                r => r.ravi_id,
                (h, r) => new { r.placed_lived })
            .Where(x => !string.IsNullOrEmpty(x.placed_lived) && x.placed_lived != "-1")
            .SelectMany(x => x.placed_lived.Split(',').Select(place => place.Trim()))
            .GroupBy(place => place)
            .Select(g => new { Place = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToList();

        return Ok(result);
    }
    [HttpGet("hadiths-timeline")]
    public async Task<IActionResult> GetHadithsTimeline()
    {
        var hadiths = await _context.Hadiths
            .Select(h => new
            {
                h.id,
                h.chain
            })
            .ToListAsync();

        var ravis = await _context.Ravis
            .Where(r => r.death_year_m != 0 && r.death_year_m != -1)
            .Select(r => new { r.ravi_id, r.death_year_m })
            .ToListAsync();

        var result = hadiths
            .Where(h => !string.IsNullOrEmpty(h.chain))
            .Select(h => new
            {
                FirstRaviId = int.Parse(h.chain.Split(';')[0])
            })
            .Join(ravis,
                h => h.FirstRaviId,
                r => r.ravi_id,
                (h, r) => r.death_year_m)
            .GroupBy(year => year)
            .Select(g => new
            {
                Year = g.Key,
                HadithCount = g.Count()
            })
            .OrderBy(x => x.Year)
            .ToList();

        return Ok(result);
    }
    [HttpGet("count")]
    public async Task<IActionResult> GetRavisCount([FromQuery] string search = "", [FromQuery] List<string> tribe = null, [FromQuery] List<string> nisbe = null)
    {
        var query = _context.Ravis.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(r =>
                EF.Functions.ILike(r.narrator_name, $"%{search}%") ||
                (r.tribe != null && r.tribe != "-1" && r.tribe != "0" && EF.Functions.ILike(r.tribe, $"%{search}%")) ||
                (r.nisbe != null && r.nisbe != "-1" && r.nisbe != "0" && EF.Functions.ILike(r.nisbe, $"%{search}%")) ||
                (r.degree != null && r.degree != "-1" && r.degree != "0" && EF.Functions.ILike(r.degree, $"%{search}%")) ||
                (r.reliability != null && r.reliability != "-1" && r.reliability != "0" && EF.Functions.ILike(r.reliability, $"%{search}%"))
            );
        }

        if (tribe != null && tribe.Count > 0)
        {
            query = query.Where(r => tribe.Contains(r.tribe));
        }

        if (nisbe != null && nisbe.Count > 0)
        {
            query = query.Where(r => nisbe.Contains(r.nisbe));
        }

        var totalCount = await query.CountAsync();
        
        Console.WriteLine($"Total Ravis Count: {totalCount}");

        return Ok(totalCount);
    }
    [HttpGet("job-list")]
    public async Task<IActionResult> GetJobs()
    {
        var jobs = await _context.Ravis
            .Where(r => !string.IsNullOrEmpty(r.job) && r.job != "-1" && r.job != "0")
            .Select(r => r.job)
            .ToListAsync();

        var uniqueJobs = new HashSet<string>();

        foreach (var job in jobs)
        {
            var splittedJobs = job.Split(new string[] { "-#-" }, StringSplitOptions.None);
            foreach (var sJob in splittedJobs)
            {
                uniqueJobs.Add(sJob.Trim());
            }
        }

        var orderedUniqueJobs = uniqueJobs.OrderBy(j => j).ToList();

        return Ok(orderedUniqueJobs);
    }

    [HttpGet("nisbe-list")]
    public async Task<IActionResult> GetNsbes()
    {
        var nisbes = await _context.Ravis
            .Where(r => !string.IsNullOrEmpty(r.nisbe) && r.nisbe != "-1" && r.nisbe != "0")
            .Select(r => r.nisbe)
            .ToListAsync();

        var uniqueNisbes = new HashSet<string>();

        foreach (var nisbe in nisbes)
        {
            var splittedNisbes = nisbe.Split(',').Select(n => n.Trim());
            foreach (var sNisbe in splittedNisbes)
            {
                uniqueNisbes.Add(sNisbe);
            }
        }

        var orderedUniqueNisbes = uniqueNisbes.OrderBy(n => n).ToList();

        return Ok(orderedUniqueNisbes);
    }

}