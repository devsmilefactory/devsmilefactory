# Test MCP servers connectivity script
# Usage: From repository root in PowerShell run: .\tools\test_mcp.ps1

function Mask-Token($token) {
    if (-not $token) { return '<none>' }
    if ($token.Length -le 8) { return ('*' * ($token.Length - 4)) + $token.Substring($token.Length - 4) }
    return $token.Substring(0,4) + ('*' * ([Math]::Max(4, $token.Length - 8))) + $token.Substring($token.Length - 4)
}

$servers = @(
    @{ name = 'supabase'; url = 'https://mcp.supabase.com/mcp?project_ref=zbinnovation'; headers = @{ Authorization = 'Bearer sbp_bc9a3dfd441bb66d7ff0273f9644871aa95b4730' } },
    @{ name = 'github'; url = 'https://api.githubcopilot.com/mcp/'; headers = @{ Authorization = ('Bearer ' + ($env:GITHUB_MCP_PAT -ne $null ? $env:GITHUB_MCP_PAT : 'REPLACE_WITH_GITHUB_PAT')) } },
    @{ name = 'sequential-thinking'; type = 'npx'; command = 'npx -y @modelcontextprotocol/server-sequential-thinking --help' }
)

$results = @()

foreach ($s in $servers) {
    $entry = [ordered]@{ Name = $s.name; Ok = $false; Details = $null }
    if ($s.type -eq 'npx') {
        $entry.Details = 'Checking for `npx` availability and ability to run the package.'
        try {
            $npx = Get-Command npx -ErrorAction SilentlyContinue
            if (-not $npx) {
                $entry.Details = '`npx` not found in PATH.'
            } else {
                $entry.Details = '`npx` found: ' + $npx.Path
                $entry.Ok = $true
            }
        } catch {
            $entry.Details = "Error checking npx: $_"
        }
    } else {
        $uri = $s.url
        $headers = @{}
        if ($s.headers) {
            foreach ($k in $s.headers.Keys) { $headers[$k] = $s.headers[$k] }
        }

        $maskedAuth = $null
        if ($headers.Authorization) { $maskedAuth = Mask-Token($headers.Authorization) }

        $entry.Details = "URL: $uri; Authorization: $maskedAuth"
        try {
            # Try HEAD first, fallback to GET
            try {
                $resp = Invoke-WebRequest -Uri $uri -Method Head -Headers $headers -UseBasicParsing -TimeoutSec 15
                $entry.Ok = $true
                $entry.Details += "; StatusCode: $($resp.StatusCode) (HEAD)"
            } catch {
                $resp = Invoke-WebRequest -Uri $uri -Method Get -Headers $headers -UseBasicParsing -TimeoutSec 15
                $entry.Ok = $true
                $entry.Details += "; StatusCode: $($resp.StatusCode) (GET)"
            }
        } catch {
            $entry.Ok = $false
            $entry.Details += "; Error: $($_.Exception.Message)"
        }
    }
    $results += $entry
}

# Print summary
"MCP connectivity test results:`n" | Write-Host
foreach ($r in $results) {
    $status = if ($r.Ok) { 'OK' } else { 'FAILED' }
    Write-Host "- $($r.Name): $status`n  $($r.Details)`n"
}

"Done.`n" | Write-Host
