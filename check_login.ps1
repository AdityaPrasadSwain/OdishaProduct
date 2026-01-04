$body = @{ 
    identifier = "7848973332"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8085/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body

    Write-Host "Success!"
    Write-Host "Roles: $($response.roles)"
    Write-Host "Email: $($response.email)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())"
    } else {
        Write-Host "No response body."
    }
}
