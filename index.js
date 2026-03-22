const { execSync } = require('child_process');
const fs = require('fs');

async function testPipeline() {
    try {
        // حط رابط أي فيديو تيكتوك بدك تجربه هون
        const tiktokUrl = "https://www.tiktok.com/@abu.odai1980/video/7599516768100535573"; 
        
        console.log("--- المرحلة 1: جلب الفيديو بدون علامة مائية ---");
        // yt-dlp بيعمل السحر هون
        execSync(`yt-dlp -f "best" -o "raw_video.mp4" "${tiktokUrl}"`);
        console.log("تم التحميل بنجاح.");

        console.log("--- المرحلة 2: المعالجة بـ FFmpeg (تغيير البصمة الرقمية) ---");
        // رح نغير الحجم لـ 1082x1922 ونغير جودة الصوت شوي عشان يوتيوب ما يعرفه
        execSync(`ffmpeg -i raw_video.mp4 -vf "scale=1082:1922" -c:v libx264 -crf 20 -c:a aac -b:a 128k processed_video.mp4`);
        console.log("تمت المعالجة وحفظ الملف باسم processed_video.mp4");

    } catch (error) {
        console.error("فشلت التجربة في مرحلة ما:", error.message);
        process.exit(1);
    }
}

testPipeline();
