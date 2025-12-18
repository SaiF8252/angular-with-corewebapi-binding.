using LibrarayManagement.Model;
using LibrarayManagement.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibrarayManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   [Authorize]
    public class IssuesController : ControllerBase
    {
        private readonly LIbraryDb _context;
        private readonly IImageUpload upload;

        public IssuesController(LIbraryDb context,IImageUpload upload)
        {
            _context = context;
            this.upload = upload;
        }

        // GET: api/Issues
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Issue>>> GetIssues()
        {
            var issues = await _context.Issues
                .Include(i => i.Member)
                .Include(i => i.Books) // single book per issue
                .ToListAsync();

            return Ok(issues);
        }


        // GET: api/Issues/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Issue>> GetIssue(int id)
        {
            var issue = await _context.Issues.Include(i => i.Member)
                .Include(i => i.Books).FirstOrDefaultAsync(a=> a.IssueId == id);

            if (issue == null)
            {
                return NotFound();
            }
            return issue;
        }

        // PUT: api/Issues/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIssue(int id, Issue issue)
        {
            if (id != issue.IssueId)
                return BadRequest();

            // Existing Issue + Books load
            var existingIssue = await _context.Issues
                .Include(i => i.Books)
                .Include(i => i.Member)
                .FirstOrDefaultAsync(i => i.IssueId == id);

            if (existingIssue == null)
                return NotFound();

            // ===== Master fields =====
            existingIssue.IssueDate = issue.IssueDate;
            existingIssue.ReturnDate = issue.ReturnDate;

            // ===== Member update =====
            if (existingIssue.Member != null && issue.Member != null)
            {
                existingIssue.Member.MemberName = issue.Member.MemberName;
                existingIssue.Member.Mobile = issue.Member.Mobile;
                existingIssue.Member.PhotoPath = issue.Member.PhotoPath;
            }

            // ===== 🔥 Books FIX =====
            // Old books delete
            _context.Books.RemoveRange(existingIssue.Books);

            // New books add
            existingIssue.Books = issue.Books;

            await _context.SaveChangesAsync();
            return NoContent();
        }


        // POST: api/Issues
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Issue>> PostIssue(Issue issue)
        {
            _context.Issues.Add(issue);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIssue", new { id = issue.IssueId }, issue);
        }

        // DELETE: api/Issues/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIssue(int id)
        {
            var issue = await _context.Issues.FindAsync(id);
            if (issue == null)
            {
                return NotFound();
            }

            _context.Issues.Remove(issue);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool IssueExists(int id)
        {
            return _context.Issues.Any(e => e.IssueId == id);
        }
        [HttpPost("Upload")]
        public async Task<IActionResult> Upload(IFormFile file, CancellationToken C)
        {
            return Ok(await upload.UploadFile(file, C));
        }
    }
}
