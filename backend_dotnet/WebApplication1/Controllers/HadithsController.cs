using Microsoft.AspNetCore.Mvc;
        using Microsoft.EntityFrameworkCore;
        using WebApplication1.Data;
        using WebApplication1.Models;

        namespace WebApplication1.Controllers;

        [ApiController]
        [Route("api/[controller]")]
        public class HadithsController : ControllerBase
        {
            private readonly AppDbContext _context;

            public HadithsController(AppDbContext context)
            {
                _context = context;
            }

    [HttpGet]
public async Task<IActionResult> GetHadiths(
    [FromQuery] int page = 1, 
    [FromQuery] string search = "", 
    [FromQuery] List<string> musannif = null, 
    [FromQuery] List<string> book = null, 
    [FromQuery] int? chainLength = null)
{
    int perPage = 10;
    var query = _context.Hadiths.AsQueryable();

    if (!string.IsNullOrEmpty(search))
    {
        query = query.Where(h =>
            EF.Functions.ILike(h.arabic, $"%{search}%") ||
            EF.Functions.ILike(h.turkish, $"%{search}%") ||
            EF.Functions.ILike(h.musannif, $"%{search}%") ||
            EF.Functions.ILike(h.book, $"%{search}%") ||
            EF.Functions.ILike(h.topic, $"%{search}%")
        );
    }

    if (musannif != null && musannif.Count > 0)
    {
        query = query.Where(h => musannif.Contains(h.musannif));
    }

    if (book != null && book.Count > 0)
    {
        query = query.Where(h => book.Contains(h.book));
    }

    // Check if chainLength has a value before using it
    if (chainLength.HasValue && chainLength.Value > 0)
    {
        query = query.Where(h => h.chain_length == chainLength.Value);
    }

    var totalCount = await query.CountAsync(); 
    var totalPages = (int)Math.Ceiling((double)totalCount / perPage);

    var hadiths = await query
        .Skip((page - 1) * perPage)
        .Take(perPage)
        .ToListAsync(); 

    Response.Headers.Add("Total-Pages-hadiths", totalPages.ToString());
    Response.Headers.Add("Total-Count-hadiths", totalCount.ToString());

    return Ok(hadiths);
}

            [HttpGet("hadith-by-book")]
            public async Task<IActionResult> GetHadithByBook()
            {
                var result = await _context.Hadiths
                    .Where(h => !string.IsNullOrEmpty(h.book))
                    .GroupBy(h => h.book)
                    .Select(g => new { Book = g.Key!, HadithCount = g.Count() })
                    .OrderByDescending(x => x.HadithCount)
                    .ToListAsync();

                return Ok(result);
            }

            [HttpGet("hadith-by-musannif")]
            public async Task<IActionResult> GetHadithByMusannif()
            {
                var result = await _context.Hadiths
                    .Where(h => !string.IsNullOrEmpty(h.musannif))
                    .GroupBy(h => h.musannif)
                    .Select(g => new { Musannif = g.Key!, HadithCount = g.Count() })
                    .OrderByDescending(x => x.HadithCount)
                    .ToListAsync();

                return Ok(result);
            }

            [HttpGet("musannif-list")]
            public async Task<IActionResult> GetMusannifList()
            {
                var musannifList = await _context.Hadiths
                    .Where(h => !string.IsNullOrEmpty(h.musannif))
                    .Select(h => h.musannif)
                    .Distinct()
                    .ToListAsync();

                return Ok(musannifList);
            }

            [HttpGet("book-list")]
            public async Task<IActionResult> GetBookList()
            {
                var bookList = await _context.Hadiths
                    .Where(h => !string.IsNullOrEmpty(h.book))
                    .Select(h => h.book)
                    .Distinct()
                    .ToListAsync();

                return Ok(bookList);
            }
            [HttpGet("count")]
            public async Task<IActionResult> GetHadithsCount([FromQuery] string search = "", [FromQuery] List<string> musannif = null, [FromQuery] List<string> book = null)
            {
                var query = _context.Hadiths.AsQueryable();

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(h =>
                        EF.Functions.ILike(h.arabic, $"%{search}%") ||
                        EF.Functions.ILike(h.turkish, $"%{search}%") ||
                        EF.Functions.ILike(h.musannif, $"%{search}%") ||
                        EF.Functions.ILike(h.book, $"%{search}%") ||
                        EF.Functions.ILike(h.topic, $"%{search}%")
                    );
                }

                if (musannif != null && musannif.Count > 0)
                {
                    query = query.Where(h => musannif.Contains(h.musannif));
                }

                if (book != null && book.Count > 0)
                {
                    query = query.Where(h => book.Contains(h.book));
                }

                var totalCount = await query.CountAsync();
                
                Console.WriteLine(totalCount);

                return Ok(totalCount);
            }
        [HttpGet("chain-length/{length}")]
        public async Task<IActionResult> GetHadithsByChainLength(int length, int page = 1, int pageSize = 20)
        {
            var query = _context.Hadiths
                .Where(h => h.chain_length == length)
                .Select(h => new
                {
                    h.id,
                    h.chain_length
                });

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var filteredHadiths = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = pageSize,
                Hadiths = filteredHadiths
            };

            return Ok(result);
        }
        }