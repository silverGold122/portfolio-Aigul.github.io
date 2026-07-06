using SkiaSharp;

var imagesDir = args.Length > 0
    ? args[0]
    : Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "images"));

if (!Directory.Exists(imagesDir))
{
    Console.Error.WriteLine($"Images directory not found: {imagesDir}");
    return 1;
}

foreach (var pngPath in Directory.GetFiles(imagesDir, "*.png"))
{
    var webpPath = Path.ChangeExtension(pngPath, ".webp");
    using var input = File.OpenRead(pngPath);
    using var bitmap = SKBitmap.Decode(input);

    if (bitmap is null)
    {
        Console.Error.WriteLine($"Failed to decode: {pngPath}");
        continue;
    }

    var maxWidth = Path.GetFileName(pngPath).Contains("botanical") ? 400 : 1024;
    SKBitmap output = bitmap;

    if (bitmap.Width > maxWidth)
    {
        var scale = (float)maxWidth / bitmap.Width;
        var height = (int)Math.Round(bitmap.Height * scale);
        output = bitmap.Resize(new SKImageInfo(maxWidth, height), SKSamplingOptions.Default);
    }

    using var image = SKImage.FromBitmap(output);
    using var data = image.Encode(SKEncodedImageFormat.Webp, 82);

    if (data is null)
    {
        Console.Error.WriteLine($"Failed to encode: {pngPath}");
        continue;
    }

    File.WriteAllBytes(webpPath, data.ToArray());

    var pngSize = new FileInfo(pngPath).Length;
    var webpSize = new FileInfo(webpPath).Length;
    var saved = 100 - (webpSize * 100.0 / pngSize);
    Console.WriteLine($"{Path.GetFileName(pngPath)} -> {Path.GetFileName(webpPath)} ({pngSize / 1024}KB -> {webpSize / 1024}KB, -{saved:F0}%)");

    if (!ReferenceEquals(output, bitmap))
    {
        output.Dispose();
    }
}

return 0;
