# Files and folders to exclude
$excludeFolders = @(
    "node_modules",
    "dist",
    ".git",
    ".vscode",
    ".idea",
    "coverage",
    ".nyc_output",
    ".next",
    ".nuxt",
    ".cache",
    "tmp",
    "temp",
    "logs",
    "log",
    "build",
    ".serverless",
    ".terraform",
    ".pytest_cache",
    "__pycache__",
    ".mypy_cache",
    ".tox"
)

$excludeFiles = @(
    "*.log",
    "*.lock",
    "*.map",
    "*.min.js",
    "*.min.css",
    "*.png",
    "*.jpg",
    "*.jpeg",
    "*.gif",
    "*.svg",
    "*.ico",
    "*.webp",
    "*.woff",
    "*.woff2",
    "*.ttf",
    "*.eot",
    "*.mp4",
    "*.mp3",
    "*.avi",
    "*.mov",
    "*.zip",
    "*.rar",
    "*.7z",
    "*.tar",
    "*.gz",
    "*.tgz",
    "*.dmg",
    "*.exe",
    "*.msi",
    "*.dll",
    "*.so",
    "*.dylib",
    "*.pyc",
    "*.pyo",
    "*.class",
    "*.jar",
    "*.war",
    "*.ear",
    "*.pak",
    "*.bin"
)

$excludeExactFiles = @(
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "composer.lock",
    "Gemfile.lock",
    "Cargo.lock",
    "poetry.lock",
    "code.txt",
    "r.txt",
    "export-code.ps1"
)

# Get all files recursively
$files = Get-ChildItem -Recurse -File | Where-Object {
    $exclude = $false
    
    # Check folders
    foreach ($folder in $excludeFolders) {
        if ($_.FullName -match "\\$folder\\") {
            $exclude = $true
            break
        }
    }
    
    # Check exact file names
    if (-not $exclude) {
        foreach ($exactFile in $excludeExactFiles) {
            if ($_.Name -eq $exactFile) {
                $exclude = $true
                break
            }
        }
    }
    
    # Check file extensions
    if (-not $exclude) {
        foreach ($ext in $excludeFiles) {
            if ($_.Name -like $ext) {
                $exclude = $true
                break
            }
        }
    }
    
    -not $exclude
}

# Sort files by extension
$sortedFiles = $files | Sort-Object { $_.Extension }, Name

# Build output
$output = "================================================================================`n"
$output += "CODEBASE EXPORT - SOURCE FILES ONLY`n"
$output += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n"
$output += "Total Files: $($sortedFiles.Count)`n"
$output += "================================================================================`n`n"

$i = 0
foreach ($file in $sortedFiles) {
    $i++
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    $fileType = $file.Extension -replace "^\.", ""
    if ($fileType -eq "") { $fileType = "No Extension" }
    
    $output += "================================================================================`n"
    $output += "[$i/$($sortedFiles.Count)] FILE: $relativePath`n"
    $output += "TYPE: $fileType`n"
    $output += "SIZE: $([math]::Round($file.Length / 1KB, 2)) KB`n"
    $output += "================================================================================`n"
    
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        $output += $content
    } catch {
        $output += "[Binary file - content not displayed]`n"
    }
    $output += "`n"
}

$output | Out-File -FilePath code.txt -Encoding utf8
Write-Host "✅ Exported $($sortedFiles.Count) source files to code.txt" -ForegroundColor Green
Write-Host "📁 File: code.txt" -ForegroundColor Cyan
