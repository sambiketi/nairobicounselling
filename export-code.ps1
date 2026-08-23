# Files to exclude
$excludeFolders = @("node_modules", "dist", ".git")
$excludeExtensions = @(".log", ".lock")

# Get all files recursively
$files = Get-ChildItem -Recurse -File | Where-Object {
    $exclude = $false
    foreach ($folder in $excludeFolders) {
        if ($_.FullName -match "\\$folder\\") {
            $exclude = $true
            break
        }
    }
    if (-not $exclude) {
        foreach ($ext in $excludeExtensions) {
            if ($_.Extension -eq $ext) {
                $exclude = $true
                break
            }
        }
    }
    -not $exclude
}

# Write to file
$output = "================================================================================`n"
$output += "CODEBASE EXPORT - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n"
$output += "Total Files: $($files.Count)`n"
$output += "================================================================================`n`n"

foreach ($file in $files) {
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    $output += "================================================================================`n"
    $output += "FILE: $relativePath`n"
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
Write-Host "✅ Exported $($files.Count) files to code.txt" -ForegroundColor Green
