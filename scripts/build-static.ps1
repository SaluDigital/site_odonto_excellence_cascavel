$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $projectRoot "dist"
$resolvedProject = (Resolve-Path -LiteralPath $projectRoot).Path

if (Test-Path -LiteralPath $dist) {
  $resolvedDist = (Resolve-Path -LiteralPath $dist).Path
  if (-not $resolvedDist.StartsWith($resolvedProject, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove a path outside the project: $resolvedDist"
  }
  Remove-Item -LiteralPath $resolvedDist -Recurse -Force
}

New-Item -ItemType Directory -Path $dist | Out-Null

Copy-Item -LiteralPath (Join-Path $projectRoot "index.html") -Destination $dist
Copy-Item -LiteralPath (Join-Path $projectRoot "robots.txt") -Destination $dist
Copy-Item -LiteralPath (Join-Path $projectRoot "sitemap.xml") -Destination $dist
Copy-Item -LiteralPath (Join-Path $projectRoot "assets") -Destination $dist -Recurse
Copy-Item -LiteralPath (Join-Path $projectRoot "css") -Destination $dist -Recurse
Copy-Item -LiteralPath (Join-Path $projectRoot "js") -Destination $dist -Recurse

$distOpenAi = Join-Path $dist ".openai"
New-Item -ItemType Directory -Path $distOpenAi | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot ".openai\hosting.json") -Destination (Join-Path $distOpenAi "hosting.json")
