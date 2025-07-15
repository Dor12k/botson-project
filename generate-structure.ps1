



$exclude = @('node_modules', 'dist', '.git', '.next', 'coverage', '.vscode', '.idea')

function Get-Tree($path, $prefix = "") {
    $items = Get-ChildItem $path | Where-Object { -not ($exclude -contains $_.Name) }

    for ($i = 0; $i -lt $items.Count; $i++) {
        $item = $items[$i]
        $isLast = $i -eq $items.Count - 1
        if ($isLast) {
            $connector = "+-- "
        }
        else {
            $connector = "|-- "
        }
        $line = "$prefix$connector$item"

        Write-Output $line

        if ($item.PSIsContainer) {
            if ($isLast) {
                $newPrefix = $prefix + "    "
            }
            else {
                $newPrefix = $prefix + "|   "
            }
            Get-Tree "$path\$item" $newPrefix
        }
    }
}

Get-Tree "." > project-structure.txt
