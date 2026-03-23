const { execSync } = require('child_process');
const fs = require('fs');
const { google } = require('googleapis');

// --- 1. الإعدادات (Config) ---
const CONFIG = {
    youtube: {
        clientId: "80097892689-fatsck4rfg2n7g66ma33fm9jp24a3fes.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken: "1//04OySrfdvka32CgYIARAAGAQSNwF-L9IrDkZiwdv-6X0c9RfppP38Ngo-Rt0EW5TvZiNTJu3LvbI4VSIx_9NmS-DCaVVskB8yIhM"
    },
    siteUrl: "https://redirectauto4kiro.blogspot.com/",
    dbFile: 'history.json',
    tiktokAccounts: [
        'https://www.tiktok.com/@films2026_',
        'https://www.tiktok.com/@adeyu_77'
    ]
};

// تهيئة API يوتيوب
const oauth2Client = new google.auth.OAuth2(CONFIG.youtube.clientId, CONFIG.youtube.clientSecret);
oauth2Client.setCredentials({ refresh_token: CONFIG.youtube.refreshToken });
const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// --- 2. الدوال المساعدة ---

// دالة فحص الفيديو السابق لحماية القناة
async function checkAndCleanupPrevious() {
    console.log("🛡️ فحص أمان القناة (الفيديو السابق)...");
    try {
        const searchRes = await youtube.search.list({
            part: 'id',
            forMine: true,
            type: 'video',
            maxResults: 2,
            order: 'date'
        });

        const prevId = searchRes.data.items[1]?.id?.videoId;
        if (!prevId) return;

        const videoData = await youtube.videos.list({ part: 'status,snippet', id: prevId });
        const video = videoData.data.items[0];

        if (video && video.status.uploadStatus === 'rejected') {
            console.log(`⚠️ اكتشاف فيديو مرفوض: ${video.snippet.title}. جاري الحذف...`);
            await youtube.videos.delete({ id: prevId });
            console.log("🗑️ تم التنظيف.");
        } else {
            console.log("✅ لا توجد مشاكل في الفيديو السابق.");
        }
    } catch (e) {
        console.log("ℹ️ ملاحظة الفحص: " + e.message);
    }
}

// دالة وضع التعليق المثبت
async function postPinComment(videoId) {
    const commentText = `🍿 شاهد الفيلم كامل أو حمله بجودة عالية من هنا: ${CONFIG.siteUrl}\n\n🔥 تابعوا كيرو زوزو - kirozozo للمزيد من المتعة!\n✨ لا تنسوا اللايك والاشتراك يا أساطير ❤️`;
    try {
        await youtube.commentThreads.insert({
            part: 'snippet',
            requestBody: {
                snippet: {
                    videoId: videoId,
                    topLevelComment: { snippet: { textOriginal: commentText } }
                }
            }
        });
        console.log("💬 تم وضع تعليق الموقع بنجاح.");
    } catch (e) {
        console.error("❌ خطأ في التعليق:", e.message);
    }
}

// بناء الوصف الاحترافي
function getProDescription(title) {
    return `🎬 كيرو زوزو | KiroZozo - عالم الأفلام والمسلسلات\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📍 الرابط الرسمي: ${CONFIG.siteUrl}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n✨ نبذة:\n${title}\n\n🏷️ #kirozozo #كيرو_زوزو #أفلام #Shorts`;
}

// --- 3. المحرك الرئيسي (الروبوت) ---

async function startKiroAutomation() {
    let history = fs.existsSync(CONFIG.dbFile) ? JSON.parse(fs.readFileSync(CONFIG.dbFile)) : [];
    
    // اختيار حساب عشوائي في كل مرة لتنويع المحتوى
    const targetAccount = CONFIG.tiktokAccounts[Math.floor(Math.random() * CONFIG.tiktokAccounts.length)];
    console.log(`🔍 فحص فيديوهات: ${targetAccount}`);

    try {
        // سحب آخر 30 ID لضمان الوصول للفيديوهات القديمة غير المنشورة
        const idsRaw = execSync(`yt-dlp --get-id --playlist-items 30 "${targetAccount}"`, { encoding: 'utf-8' });
        const allIds = idsRaw.trim().split('\n').filter(id => id.length > 0);
        
        // البحث عن أول فيديو لم يسبق نشره
        const nextVideoId = allIds.find(id => !history.includes(id));

        if (!nextVideoId) {
            console.log("✨ مبروك! كل فيديوهات هذا الحساب منشورة بالفعل.");
            await checkAndCleanupPrevious(); // فحص حتى لو لم ينشر
            return;
        }

        console.log(`🚀 معالجة فيديو جديد: ${nextVideoId}`);

        // جلب العنوان
        let videoTitle = "مشهد أسطوري 🔥";
        try {
            videoTitle = execSync(`yt-dlp --get-title "https://www.tiktok.com/@any/video/${nextVideoId}"`, { encoding: 'utf-8' }).trim().split('\n')[0].replace(/#\w+/g, '');
        } catch (e) {}

        // التحميل والمعالجة
        console.log("📥 تحميل...");
        execSync(`yt-dlp -f "bestvideo[height<=1080]+bestaudio/best" -o "input.mp4" "https://www.tiktok.com/@any/video/${nextVideoId}"`);
        
        console.log("🎨 معالجة (بصمة رقمية جديدة)...");
        // زوم 125% + تعديل طفيف للألوان لتخطي الفلتر
        execSync(`ffmpeg -i input.mp4 -vf "scale=iw*1.25:ih*1.25,crop=iw/1.25:ih/1.25,eq=brightness=0.01:contrast=1.02" -map_metadata -1 -c:v libx264 -crf 22 -c:a aac -y output.mp4`);

        // الرفع ليوتيوب
        console.log("📤 جاري الرفع...");
        const upload = await youtube.videos.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: `${videoTitle.substring(0, 70)} 🔥 #kirozozo`,
                    description: getProDescription(videoTitle),
                    tags: ['kirozozo', 'كيرو زوزو', 'أفلام', 'Shorts'],
                    categoryId: '24'
                },
                status: { privacyStatus: 'public' }
            },
            media: { body: fs.createReadStream('output.mp4') }
        });

        const newYoutubeId = upload.data.id;
        console.log(`✅ تم النشر: https://youtu.be/${newYoutubeId}`);

        // تحديث التاريخ فوراً
        history.push(nextVideoId);
        fs.writeFileSync(CONFIG.dbFile, JSON.stringify(history, null, 2));

        // فحص الفيديو السابق
        await checkAndCleanupPrevious();

        // وضع التعليق بعد 10 ثوانٍ
        await delay(10000);
        await postPinComment(newYoutubeId);

    } catch (err) {
        if (err.message.includes("exceeded the number of videos")) {
            console.error("❌ وصلنا للحد اليومي للنشر في يوتيوب. توقف الآن.");
        } else {
            console.error("⚠️ خطأ في العمليات:", err.message);
        }
    } finally {
        // تنظيف الملفات
        ['input.mp4', 'output.mp4'].forEach(f => { if(fs.existsSync(f)) fs.unlinkSync(f); });
    }
}

// انطلاق!
startKiroAutomation();
